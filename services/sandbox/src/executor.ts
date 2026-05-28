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

export async function executePython(code: string): Promise<ExecutionResult> {
  const runId = randomUUID();
  const runDir = join(tmpdir(), `lf-${runId}`);
  const file = join(runDir, 'submission.py');
  const start = Date.now();

  try {
    await mkdir(runDir, { recursive: true });
    await writeFile(file, code, 'utf8');

    const { stdout, stderr } = await execFileAsync('python3', [file], {
      timeout: TIMEOUT_MS,
      cwd: runDir,
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
