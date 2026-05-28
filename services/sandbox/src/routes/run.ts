import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { executePython, executeRust } from '../executor';

export const runRouter = Router();

const RunSchema = z.object({
  code: z.string().min(1, 'code must not be empty').max(50_000, 'code exceeds 50 KB limit'),
  language: z.enum(['python', 'rust']),
});

runRouter.post('/', async (req: Request, res: Response) => {
  const parsed = RunSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: 'INVALID_REQUEST',
      message: parsed.error.issues.map((i) => i.message).join('; '),
    });
    return;
  }

  const { code, language } = parsed.data;

  try {
    const result = language === 'python'
      ? await executePython(code)
      : await executeRust(code);

    if (result.errors.includes('timed out')) {
      res.status(408).json({ error: 'TIMEOUT', message: result.errors });
      return;
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: 'SANDBOX_ERROR',
      message: err instanceof Error ? err.message : 'Internal sandbox failure',
    });
  }
});
