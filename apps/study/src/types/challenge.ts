import type { ComponentType } from 'react'

export type Language = 'python' | 'rust'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Challenge {
  id: string
  title: string
  module: string
  difficulty: Difficulty
  language: Language
  /** Plain text description shown in the problem pane */
  description: string
  /** Full source including embedded test harness — user edits this */
  starterCode: string
  tags: string[]
  /** Shown on "Get Hint" click in Phase 1. Replaced by Gemini in Phase 3. */
  staticHint: string
  /** Optional interactive visualization rendered above the description */
  visualization?: ComponentType
  /** Completed working code solution shown on Reveal Answer request */
  solutionCode?: string
}

export interface ExecutionResult {
  success: boolean
  output: string
  errors: string
  executionTimeMs: number
}

export type SubmissionStatus = 'idle' | 'running' | 'passed' | 'failed' | 'error'
