import { execFile } from 'child_process';
import { writeFile, rm, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const TIMEOUT_MS = 10_000;

export interface ExecutionResult {
  success: boolean;
  output: string;
  errors: string;
  executionTimeMs: number;
}

let isTritonAvailable: boolean | null = null;

async function checkTriton(): Promise<boolean> {
  if (isTritonAvailable !== null) {
    return isTritonAvailable;
  }
  try {
    await execFileAsync('python3', ['-c', 'import triton'], { timeout: 2000, maxBuffer: 1024 });
    isTritonAvailable = true;
  } catch {
    isTritonAvailable = false;
  }
  return isTritonAvailable;
}

const TRITON_SHIM = `import sys
import torch

def cdiv(a, b):
    return (a + b - 1) // b

_active_pids = [0, 0, 0]

class JITFunction:
    def __init__(self, fn):
        self.fn = fn

    def __getitem__(self, grid):
        def launcher(*args, **kwargs):
            meta = kwargs.copy()
            if callable(grid):
                grid_size = grid(meta)
            else:
                grid_size = grid
            
            grid_x = grid_size[0]
            
            for pid_x in range(grid_x):
                _active_pids[0] = pid_x
                wrapped_args = []
                for arg in args:
                    if isinstance(arg, torch.Tensor):
                        wrapped_args.append(MockPointer(arg))
                    else:
                        wrapped_args.append(arg)
                
                self.fn(*wrapped_args, **kwargs)
        return launcher

    def __call__(self, *args, **kwargs):
        return self.fn(*args, **kwargs)

def jit(fn):
    return JITFunction(fn)

class MockPointer:
    def __init__(self, tensor, offset=0):
        self.tensor = tensor
        self.offset = offset

    def __add__(self, other):
        return MockPointer(self.tensor, self.offset + other)

    def __radd__(self, other):
        return self.__add__(other)

class TritonLanguageModule:
    def __init__(self):
        self.constexpr = int
    
    def program_id(self, axis):
        return _active_pids[axis]

    def arange(self, start, end):
        return torch.arange(start, end, dtype=torch.int64)

    def load(self, pointer, mask=None, other=0.0):
        if not isinstance(pointer, MockPointer):
            raise TypeError("Expected MockPointer in tl.load")
        
        flat_tensor = pointer.tensor.view(-1)
        offset = pointer.offset
        
        if isinstance(offset, torch.Tensor):
            safe_indices = torch.clamp(offset, 0, flat_tensor.numel() - 1)
            values = flat_tensor[safe_indices]
            if mask is not None:
                mask = mask.to(torch.bool)
                return torch.where(mask, values, torch.tensor(other, dtype=values.dtype))
            return values
        else:
            if mask is not None and not mask:
                return other
            return flat_tensor[offset]

    def store(self, pointer, value, mask=None):
        if not isinstance(pointer, MockPointer):
            raise TypeError("Expected MockPointer in tl.store")
        
        flat_tensor = pointer.tensor.view(-1)
        offset = pointer.offset
        
        if isinstance(offset, torch.Tensor):
            safe_indices = torch.clamp(offset, 0, flat_tensor.numel() - 1)
            if mask is not None:
                mask = mask.to(torch.bool)
                indices_to_update = safe_indices[mask]
                if isinstance(value, torch.Tensor):
                    flat_value = value.view(-1)
                    val_to_update = flat_value[mask]
                else:
                    val_to_update = value
                flat_tensor[indices_to_update] = val_to_update
            else:
                flat_tensor[safe_indices] = value.view(-1) if isinstance(value, torch.Tensor) else value
        else:
            if mask is not None and not mask:
                return
            flat_tensor[offset] = value

language = TritonLanguageModule()
sys.modules['triton.language'] = language
`;

export async function executePython(code: string): Promise<ExecutionResult> {
  const runId = randomUUID();
  const runDir = join(tmpdir(), `lf-${runId}`);
  const file = join(runDir, 'submission.py');
  const start = Date.now();

  try {
    await mkdir(runDir, { recursive: true });
    await writeFile(file, code, 'utf8');

    const tritonAvailable = await checkTriton();
    if (!tritonAvailable) {
      await writeFile(join(runDir, 'triton.py'), TRITON_SHIM, 'utf8');
    }

    const { stdout, stderr } = await execFileAsync('python3', [file], {
      timeout: TIMEOUT_MS,
      cwd: runDir,
      env: { ...process.env, TRITON_INTERPRET: '1' },
      maxBuffer: 1024 * 1024,
    });

    // execFileAsync only resolves on exit code 0
    return {
      success: true,
      output: stdout.trim(),
      errors: stderr.trim(),
      executionTimeMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException & { stdout?: string; stderr?: string; killed?: boolean };
    if (e.killed) {
      return { success: false, output: '', errors: `Execution timed out after ${TIMEOUT_MS}ms`, executionTimeMs: Date.now() - start };
    }
    return {
      success: false,
      output: (e.stdout ?? '').trim(),
      errors: (e.stderr ?? e.message ?? 'Unknown execution error').trim(),
      executionTimeMs: Date.now() - start,
    };
  } finally {
    await rm(runDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function executeRust(code: string): Promise<ExecutionResult> {
  const runId = randomUUID();
  const runDir = join(tmpdir(), `lf-${runId}`);
  const srcFile = join(runDir, 'main.rs');
  const outFile = join(runDir, 'main');
  const start = Date.now();

  try {
    await mkdir(runDir, { recursive: true });
    await writeFile(srcFile, code, 'utf8');

    // Compile
    try {
      await execFileAsync('rustc', [srcFile, '-o', outFile], {
        timeout: TIMEOUT_MS,
        cwd: runDir,
        maxBuffer: 1024 * 1024,
      });
    } catch (compileErr: unknown) {
      const e = compileErr as { stderr?: string; stdout?: string };
      return {
        success: false,
        output: '',
        errors: (e.stderr ?? 'Compilation failed').trim(),
        executionTimeMs: Date.now() - start,
      };
    }

    // Run
    const { stdout, stderr } = await execFileAsync(outFile, [], {
      timeout: TIMEOUT_MS,
      cwd: runDir,
      maxBuffer: 1024 * 1024,
    });

    return {
      success: stderr.trim() === '',
      output: stdout.trim(),
      errors: stderr.trim(),
      executionTimeMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException & { stdout?: string; stderr?: string; killed?: boolean };
    if (e.killed) {
      return { success: false, output: '', errors: `Execution timed out after ${TIMEOUT_MS}ms`, executionTimeMs: Date.now() - start };
    }
    return {
      success: false,
      output: (e.stdout ?? '').trim(),
      errors: (e.stderr ?? e.message ?? 'Unknown execution error').trim(),
      executionTimeMs: Date.now() - start,
    };
  } finally {
    await rm(runDir, { recursive: true, force: true }).catch(() => undefined);
  }
}
