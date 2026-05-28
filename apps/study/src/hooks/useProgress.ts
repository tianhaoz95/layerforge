import { useState } from 'react'

interface ProgressEntry {
  completed: boolean
  attempts: number
}

// Phase 2: replace localStorage reads/writes with Firestore subcollection calls
const STORAGE_KEY = 'layerforge:progress'

function load(): Record<string, ProgressEntry> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, ProgressEntry>
  } catch {
    return {}
  }
}

function save(data: Record<string, ProgressEntry>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>(load)

  const markComplete = (id: string) => {
    const next = {
      ...progress,
      [id]: { completed: true, attempts: (progress[id]?.attempts ?? 0) + 1 },
    }
    setProgress(next)
    save(next)
  }

  const incrementAttempt = (id: string) => {
    const next = {
      ...progress,
      [id]: {
        completed: progress[id]?.completed ?? false,
        attempts: (progress[id]?.attempts ?? 0) + 1,
      },
    }
    setProgress(next)
    save(next)
  }

  return { progress, markComplete, incrementAttempt }
}
