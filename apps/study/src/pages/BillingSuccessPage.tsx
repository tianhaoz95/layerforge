import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'
import { useSubscription } from '../hooks/useSubscription'

const syncCheckoutSession = httpsCallable<{ sessionId: string }, { synced: boolean }>(
  functions,
  'syncCheckoutSession',
)

export function BillingSuccessPage() {
  const { subscription, loading: subLoading } = useSubscription()
  const [syncDone, setSyncDone] = useState(false)
  const [syncError, setSyncError] = useState('')
  const synced = useRef(false)

  const sessionId = new URLSearchParams(window.location.search).get('session_id')

  // No session_id means the user navigated here directly (back button, stale bookmark).
  // Redirect them to an appropriate page once subscription state is known.
  if (!sessionId && !subLoading) {
    const isActive = subscription?.status === 'trialing' || subscription?.status === 'active'
    return <Navigate to={isActive ? '/' : '/billing'} replace />
  }

  useEffect(() => {
    if (synced.current || !sessionId) return
    synced.current = true
    syncCheckoutSession({ sessionId })
      .then(() => setSyncDone(true))
      .catch((err: unknown) => {
        console.error('syncCheckoutSession failed:', err)
        setSyncError(
          (err as { message?: string })?.message ??
          'Could not set up your account automatically.',
        )
        setSyncDone(true)
      })
  }, [sessionId])

  const isSubscribed =
    subscription?.status === 'trialing' || subscription?.status === 'active'

  // Show the dashboard button only once Firestore confirms the subscription.
  // If sync completed but Firestore hasn't caught up yet, keep polling via onSnapshot.
  const showButton = isSubscribed
  const showSpinner = !isSubscribed && !syncError
  const showError = syncError && !isSubscribed

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6">
      <div className="pointer-events-none fixed top-10 left-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="relative w-full max-w-sm text-center space-y-6">
        <p className="font-mono text-xl font-bold text-cyan-400">LayerForge</p>

        <div className="rounded-xl border border-cyan-500/20 bg-gray-900/60 p-10 shadow-xl space-y-4">
          {showButton && (
            <>
              <div className="text-4xl">🎉</div>
              <h1 className="text-2xl font-bold text-white">You're all set!</h1>
              <p className="text-gray-400 text-sm">
                Your 7-day free trial has started. Your card won't be charged until the trial ends.
              </p>
              <a
                href="/"
                className="mt-2 inline-block w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-gray-950 hover:bg-cyan-400 transition-colors"
              >
                Start building →
              </a>
            </>
          )}

          {showSpinner && (
            <>
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              </div>
              <p className="text-gray-400 text-sm">Setting up your account…</p>
              {syncDone && (
                <p className="text-xs text-gray-600">
                  Almost there — waiting for confirmation…
                </p>
              )}
            </>
          )}

          {showError && (
            <>
              <div className="text-3xl">⚠️</div>
              <h1 className="text-lg font-semibold text-white">Setup hit a snag</h1>
              <p className="text-xs text-gray-500 font-mono break-all">{syncError}</p>
              <p className="text-sm text-gray-400">
                Your payment was processed. Try refreshing — if the dashboard still doesn't load,{' '}
                <a href="/billing" className="text-cyan-400 underline">go to billing</a>.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 text-sm font-semibold text-gray-200 hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
