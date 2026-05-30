import { useEffect, useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'
import { useSubscription } from '../hooks/useSubscription'

const syncCheckoutSession = httpsCallable<{ sessionId: string }, { synced: boolean }>(
  functions,
  'syncCheckoutSession',
)

export function BillingSuccessPage() {
  const [syncing, setSyncing] = useState(true)
  const [error, setError] = useState('')
  const { subscription } = useSubscription()

  useEffect(() => {
    // If the webhook already wrote the subscription (production fast-path), skip sync.
    if (subscription) {
      setSyncing(false)
      return
    }

    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    if (!sessionId) {
      setSyncing(false)
      return
    }

    syncCheckoutSession({ sessionId })
      .then(() => setSyncing(false))
      .catch((err: unknown) => {
        console.error('syncCheckoutSession failed:', err)
        // Show success anyway — the webhook will catch up in production.
        // In dev this means Stripe emulator state wasn't reachable.
        setError('Account setup is taking a moment. If the dashboard doesn\'t load, wait a few seconds and try again.')
        setSyncing(false)
      })
  }, [subscription])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6">
      <div className="pointer-events-none fixed top-10 left-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="relative w-full max-w-sm text-center space-y-6">
        <p className="font-mono text-xl font-bold text-cyan-400">LayerForge</p>

        <div className="rounded-xl border border-cyan-500/20 bg-gray-900/60 p-10 shadow-xl space-y-4">
          {syncing ? (
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
              {error && <p className="text-xs text-yellow-500">{error}</p>}
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
