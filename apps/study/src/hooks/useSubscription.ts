import { useEffect, useState } from 'react'
import { doc, onSnapshot, type Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'

export interface Subscription {
  id: string
  status: SubscriptionStatus
  priceId: string | null
  currentPeriodEnd: Timestamp | null
  cancelAtPeriodEnd: boolean
  trialEnd: Timestamp | null
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null | undefined>(undefined)

  useEffect(() => {
    if (!user) {
      setSubscription(null)
      return
    }

    return onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => setSubscription((snap.data()?.subscription as Subscription) ?? null),
      () => setSubscription(null),
    )
  }, [user])

  const loading = subscription === undefined
  const hasAccess = subscription?.status === 'trialing' || subscription?.status === 'active'

  return { subscription, loading, hasAccess }
}
