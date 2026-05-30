import { useEffect, useRef, useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'
import { useSubscription } from '../hooks/useSubscription'

const syncCheckoutSession = httpsCallable<{ sessionId: string }, { synced: boolean }>(
  functions,
  'syncCheckoutSession',
)

export function BillingSuccessPage() {
  const { subscription } = useSubscription()
  const [syncFailed, setSyncFailed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const synced = useRef(false)

  const sessionId = new URLSearchParams(window.location.search).get('session_id')

  useEffect(() => {
    if (synced.current || !sessionId) return
    synced.current = true
    syncCheckoutSession({ sessionId }).catch((err: unknown) => {
      console.error('syncCheckoutSession failed:', err)
      setSyncFailed(true)
    })
  }, [sessionId])

  // Fallback: if subscription hasn't appeared in Firestore after 15 s, unblock the
  // button so the user isn't stuck. The webhook will catch up in production.
  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), 15_000)
    return () => window.clearTimeout(t)
  }, [])

  const isSubscribed =
    subscription?.status === 'trialing' || subscription?.status === 'active'

  // Show the button once Firestore confirms, or if sync errored, or if we timed out.
  const isReady = isSubscribed || syncFailed || timedOut

  const showDelayNote = isReady && !isSubscribed

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6">
      <div className="pointer-events-none fixed top-10 left-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="relative w-full max-w-sm text-center space-y-6">
        <p className="font-mono text-xl font-bold text-cyan-400">LayerForge</p>

        <div className="rounded-xl border border-cyan-500/20 bg-gray-900/60 p-10 shadow-xl space-y-4">
          {!isReady ? (
            <>
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              </div>
              <p className="text-gray-400 text-sm">Setting up your account…</p>
            </>
          ) : (
            <>
              <div className="text-4xl">🎉</div>
              <h1 className="text-2xl font-bold text-white">You're all set!</h1>
              <p className="text-gray-400 text-sm">
                Your 7-day free trial has started. Your card won't be charged until the trial ends.
              </p>
              {showDelayNote && (
                <p className="text-xs text-yellow-500">
                  Account setup is still processing — if the dashboard doesn't load, wait a few seconds and try again.
                </p>
              )}
              <a
                href="/"
                className="mt-2 inline-block w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-gray-950 hover:bg-cyan-400 transition-colors"
              >
                Start building →
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
