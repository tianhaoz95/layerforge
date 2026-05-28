import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'
import type { ExecutionResult, Language } from '../types/challenge'

const DIRECT_SANDBOX_BASE = import.meta.env.VITE_SANDBOX_URL ?? 'http://localhost:3001'

export async function runCode(code: string, language: Language): Promise<ExecutionResult> {
  const runCodeFn = httpsCallable<{ code: string; language: Language }, ExecutionResult>(
    functions,
    'runCode'
  )

  try {
    const result = await runCodeFn({ code, language })
    return result.data
  } catch (err: any) {
    const isNetworkError = 
      err.message?.toLowerCase().includes('failed to fetch') || 
      err.message?.toLowerCase().includes('connection') ||
      err.code?.includes('unavailable') ||
      err.code?.includes('internal') ||
      err.code?.includes('network')


    if (import.meta.env.DEV && isNetworkError) {
      console.warn('Firebase Cloud Functions emulator is down. Falling back to direct local Sandbox service fetch on port 3001...')
      
      const res = await fetch(`${DIRECT_SANDBOX_BASE}/run`, {
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

    throw new Error(err.message || 'Failed to execute code in sandbox')
  }
}


