import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'
import type { ExecutionResult, Language } from '../types/challenge'

export async function runCode(code: string, language: Language): Promise<ExecutionResult> {
  const runCodeFn = httpsCallable<{ code: string; language: Language }, ExecutionResult>(
    functions,
    'runCode'
  )

  try {
    const result = await runCodeFn({ code, language })
    return result.data
  } catch (err: any) {
    throw new Error(err.message || 'Failed to execute code in sandbox')
  }
}

