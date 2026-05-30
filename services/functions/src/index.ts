import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const CLOUD_RUN_SANDBOX_URL = 'https://sandbox-li4rwaueia-uc.a.run.app';
const METADATA_TOKEN_URL =
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity';

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

async function getIdentityToken(audience: string): Promise<string> {
  const url = `${METADATA_TOKEN_URL}?audience=${encodeURIComponent(audience)}`;
  const res = await fetch(url, { headers: { 'Metadata-Flavor': 'Google' } });
  if (!res.ok) {
    throw new Error(`Metadata server returned HTTP ${res.status} fetching identity token`);
  }
  return res.text();
}

async function callSandbox(
  baseUrl: string,
  code: string,
  language: string,
  useAuth: boolean,
): Promise<ExecutionResult> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (useAuth) {
    const token = await getIdentityToken(baseUrl);
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}/run`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code, language }),
  });

  if (!res.ok) {
    const body = await res.text();
    const msg = `Sandbox returned HTTP ${res.status}: ${body}`;
    console.error(msg);
    throw new Error(msg);
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
  const sandboxUrl = isEmulator
    ? (process.env.SANDBOX_URL ?? 'http://127.0.0.1:3001')
    : (process.env.SANDBOX_URL ?? CLOUD_RUN_SANDBOX_URL);

  try {
    const result = await callSandbox(sandboxUrl, code, language, !isEmulator);
    return result;
  } catch (err) {
    console.error('runCode error:', err);
    if (err instanceof functions.https.HttpsError) throw err;
    throw new functions.https.HttpsError(
      'unavailable',
      err instanceof Error ? err.message : 'Failed to communicate with sandbox',
    );
  }
});

export { createCheckoutSession } from './stripe/checkout';
export { syncCheckoutSession } from './stripe/sync';
export { stripeWebhook } from './stripe/webhook';
export { createPortalSession } from './stripe/portal';
