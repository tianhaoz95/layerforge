import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { httpsCallable } from 'firebase/functions'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../hooks/useProgress'
import { useSubscription } from '../hooks/useSubscription'
import { functions } from '../lib/firebase'
import { challenges } from '../data/challenges'
import { ActivityHeatmap } from '../components/ActivityHeatmap'

const createPortalSession = httpsCallable<unknown, { url: string }>(functions, 'createPortalSession')

function calcStreak(activityLog: Record<string, number>): number {
  const fmt = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cursor = new Date(today)

  if (!activityLog[fmt(cursor)]) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (activityLog[fmt(cursor)]) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

const PRICE_MONTHLY = import.meta.env.VITE_STRIPE_PRICE_MONTHLY as string

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const { progress, activityLog } = useProgress()
  const { subscription, loading: subLoading } = useSubscription()

  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('lf-theme') as 'dark' | 'light') || 'dark'
  )
  const [lang, setLang] = useState<'en' | 'zh'>(
    () => (localStorage.getItem('lf-lang') as 'en' | 'zh') || 'en'
  )
  const [portalBusy, setPortalBusy] = useState(false)
  const [portalError, setPortalError] = useState('')

  useEffect(() => {
    localStorage.setItem('lf-theme', theme)
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    localStorage.setItem('lf-lang', lang)
  }, [lang])

  const completedCount = Object.values(progress).filter((p) => p.completed).length
  const totalAttempts = Object.values(progress).reduce((sum, p) => sum + p.attempts, 0)
  const activeDays = Object.keys(activityLog).filter((k) => activityLog[k] > 0).length
  const streak = calcStreak(activityLog)

  const stats = [
    { label: 'Completed', value: `${completedCount}/${challenges.length}` },
    { label: 'Submissions', value: totalAttempts },
    { label: 'Active Days', value: activeDays },
    { label: 'Streak', value: `${streak}d` },
  ]

  async function openPortal() {
    setPortalBusy(true)
    setPortalError('')
    try {
      const { data } = await createPortalSession({ returnUrl: window.location.href })
      window.location.href = data.url
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Something went wrong.')
      setPortalBusy(false)
    }
  }

  // Derive plan label from price ID
  const planLabel = subscription?.priceId === PRICE_MONTHLY ? 'Monthly' : 'Annual'

  const statusConfig: Record<string, { label: string; color: string }> = {
    trialing:           { label: 'Free trial',      color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' },
    active:             { label: 'Active',           color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5' },
    past_due:           { label: 'Payment overdue',  color: 'text-red-400 border-red-500/30 bg-red-500/5' },
    canceled:           { label: 'Canceled',         color: 'text-gray-500 border-gray-700 bg-gray-800/50' },
    incomplete:         { label: 'Incomplete',       color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5' },
    incomplete_expired: { label: 'Expired',          color: 'text-gray-500 border-gray-700 bg-gray-800/50' },
    unpaid:             { label: 'Unpaid',           color: 'text-red-400 border-red-500/30 bg-red-500/5' },
  }

  const status = subscription ? (statusConfig[subscription.status] ?? { label: subscription.status, color: 'text-gray-400 border-gray-700 bg-gray-800/50' }) : null

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-mono text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              LayerForge
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400 text-sm">Profile</span>
          </div>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-6 py-10">
        {/* User info */}
        <section className="flex items-center gap-5">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? 'User'}
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-full ring-2 ring-gray-800"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 text-xl font-bold text-cyan-400 ring-2 ring-gray-800">
              {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{user?.displayName}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Stats</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-center"
              >
                <div className="text-2xl font-bold text-cyan-400">{value}</div>
                <div className="mt-1 text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity heatmap */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Activity</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <ActivityHeatmap activityLog={activityLog} />
          </div>
        </section>

        {/* Subscription & Billing */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Subscription &amp; Billing</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900 divide-y divide-gray-800">
            {subLoading ? (
              <div className="px-5 py-4">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-800" />
              </div>
            ) : !subscription ? (
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm text-gray-500">No active subscription</span>
                <Link
                  to="/billing"
                  className="rounded-md bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                >
                  Subscribe
                </Link>
              </div>
            ) : (
              <>
                {/* Plan + status */}
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-gray-300">Plan</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-200">LayerForge Pro · {planLabel}</span>
                    {status && (
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trial end */}
                {subscription.status === 'trialing' && subscription.trialEnd && (
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-gray-300">Trial ends</span>
                    <span className="text-sm font-mono text-gray-400">
                      {formatDate(subscription.trialEnd.toDate())}
                    </span>
                  </div>
                )}

                {/* Next billing / access ends */}
                {subscription.currentPeriodEnd && subscription.status !== 'canceled' && (
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-gray-300">
                      {subscription.cancelAtPeriodEnd ? 'Access ends' : 'Next billing'}
                    </span>
                    <span className="text-sm font-mono text-gray-400">
                      {formatDate(subscription.currentPeriodEnd.toDate())}
                    </span>
                  </div>
                )}

                {/* Past due warning */}
                {subscription.status === 'past_due' && (
                  <div className="px-5 py-4">
                    <p className="text-xs text-red-400">
                      Your last payment failed. Update your payment method to keep access.
                    </p>
                  </div>
                )}

                {/* Portal button */}
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-gray-300">
                    {subscription.status === 'past_due'
                      ? 'Update payment method, view invoices, cancel'
                      : 'Change plan, update payment method, view invoices, cancel'}
                  </span>
                  <button
                    onClick={openPortal}
                    disabled={portalBusy}
                    className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap ml-4"
                  >
                    {portalBusy ? 'Opening…' : 'Manage billing'}
                  </button>
                </div>

                {portalError && (
                  <div className="px-5 py-3">
                    <p className="text-xs text-red-400">{portalError}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Settings */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Settings</h2>
          <div className="divide-y divide-gray-800 rounded-lg border border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-gray-300">Theme</span>
              <div className="flex overflow-hidden rounded-md border border-gray-700">
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    theme === 'light' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Light
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-gray-300">Language</span>
              <div className="flex overflow-hidden rounded-md border border-gray-700">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 text-xs font-medium font-mono transition-colors ${
                    lang === 'en' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('zh')}
                  className={`px-3 py-1.5 text-xs font-medium font-mono transition-colors ${
                    lang === 'zh' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  中文
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-gray-300">Account</span>
              <button
                onClick={() => void signOut()}
                className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
