import { useState } from 'react'

interface ProgressEntry {
  completed: boolean
  attempts: number
}

// Phase 2: replace localStorage reads/writes with Firestore subcollection calls
const STORAGE_KEY = 'layerforge:progress'
const ACTIVITY_KEY = 'layerforge:activity'

function localDateStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

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

function loadActivity(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) ?? '{}') as Record<string, number>
  } catch {
    return {}
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>(load)
  const [activityLog, setActivityLog] = useState<Record<string, number>>(loadActivity)

  const bumpActivity = () => {
    const today = localDateStr()
    setActivityLog((prev) => {
      const next = { ...prev, [today]: (prev[today] ?? 0) + 1 }
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next))
      return next
    })
  }

  const markComplete = (id: string) => {
    const next = {
      ...progress,
      [id]: { completed: true, attempts: (progress[id]?.attempts ?? 0) + 1 },
    }
    setProgress(next)
    save(next)
    bumpActivity()
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
    bumpActivity()
  }

  return { progress, activityLog, markComplete, incrementAttempt }
}
