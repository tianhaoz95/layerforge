import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleAuth } from 'google-auth-library';

admin.initializeApp();

const CLOUD_RUN_SANDBOX_URL = 'https://sandbox-li4rwaueia-uc.a.run.app';

interface RunCodeRequest {
  code: string;
  language: 'python' | 'rust';
}

interface ExecutionResult {
  success: boolean;
  output: string;
  errors: string;
  executionTimeMs: number;
}

async function callSandbox(
  baseUrl: string,
  code: string,
  language: string,
  useAuth: boolean,
): Promise<ExecutionResult> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (useAuth) {
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(baseUrl);
    const authHeaders = await client.getRequestHeaders();
    Object.assign(headers, authHeaders);
  }

  const res = await fetch(`${baseUrl}/run`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code, language }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(errBody.message ?? `Sandbox error: HTTP ${res.status}`);
  }

  return res.json() as Promise<ExecutionResult>;
}

export const runCode = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    );
  }

  const { code, language } = request.data as RunCodeRequest;

  if (!code || typeof code !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a valid code string.',
    );
  }

  if (language !== 'python' && language !== 'rust') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Supported languages are only "python" and "rust".',
    );
  }

  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

  // Emulator → local sandbox (no auth needed, plain HTTP)
  // Production → Cloud Run (GCP identity token required)
  const sandboxUrl = isEmulator
    ? (process.env.SANDBOX_URL ?? 'http://127.0.0.1:3001')
    : (process.env.SANDBOX_URL ?? CLOUD_RUN_SANDBOX_URL);

  try {
    const result = await callSandbox(sandboxUrl, code, language, !isEmulator);
    return result;
  } catch (err) {
    if (err instanceof functions.https.HttpsError) throw err;
    throw new functions.https.HttpsError(
      'unavailable',
      err instanceof Error ? err.message : 'Failed to communicate with sandbox',
    );
  }
});
