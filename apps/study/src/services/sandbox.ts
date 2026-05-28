import type { ExecutionResult, Language } from '../types/challenge'

const BASE = import.meta.env.VITE_SANDBOX_URL ?? '/api/sandbox'

export async function runCode(code: string, language: Language): Promise<ExecutionResult> {
  const res = await fetch(`${BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string }
    throw new Error(body.message ?? `Sandbox error: HTTP ${res.status}`)
  }

  return res.json() as Promise<ExecutionResult>
}
