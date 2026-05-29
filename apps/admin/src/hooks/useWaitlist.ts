import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

export interface WaitlistEntry {
  id: string
  name: string
  email: string
  submittedAt: string
}

export function useWaitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'waitlist'), orderBy('submittedAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<WaitlistEntry, 'id'>),
          })),
        )
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )
    return unsub
  }, [])

  return { entries, loading, error }
}
