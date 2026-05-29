import { useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'
import { useSubscription } from '../hooks/useSubscription'
import { useAuth } from '../contexts/AuthContext'

const PRICE_MONTHLY = import.meta.env.VITE_STRIPE_PRICE_MONTHLY as string
const PRICE_ANNUAL  = import.meta.env.VITE_STRIPE_PRICE_ANNUAL  as string

interface CheckoutResult { url: string }
interface PortalResult   { url: string }

const createCheckoutSession = httpsCallable<unknown, CheckoutResult>(functions, 'createCheckoutSession')
const createPortalSession   = httpsCallable<unknown, PortalResult>(functions, 'createPortalSession')

export function BillingPage() {
  const { user } = useAuth()
  const { subscription, loading } = useSubscription()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function startCheckout(priceId: string) {
    setBusy(priceId)
    setError('')
    try {
      const origin = window.location.origin
      const { data } = await createCheckoutSession({
        priceId,
        successUrl: `${origin}/billing/success`,
        cancelUrl:  `${origin}/billing`,
      })
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(null)
    }
  }

  async function openPortal() {
    setBusy('portal')
    setError('')
    try {
      const { data } = await createPortalSession({ returnUrl: window.location.href })
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(null)
    }
  }

  const isActive = subscription?.status === 'trialing' || subscription?.status === 'active'

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-6 py-16">
      <div className="pointer-events-none fixed top-0 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl">
        <a href="/" className="font-mono text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          LayerForge
        </a>

        {loading ? (
          <div className="mt-24 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : isActive ? (
          <ActiveSubscriptionView
            subscription={subscription!}
            user={user}
            busy={busy}
            error={error}
            onManage={openPortal}
          />
        ) : (
          <PricingView busy={busy} error={error} onSelect={startCheckout} />
        )}
      </div>
    </div>
  )
}

function PricingView({
  busy,
  error,
  onSelect,
}: {
  busy: string | null
  error: string
  onSelect: (priceId: string) => void
}) {
  return (
    <div className="mt-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white">Start building AI architecture</h1>
        <p className="mt-3 text-gray-400">7-day free trial — cancel any time. Card required to activate trial.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
        {/* Monthly */}
        <PricingCard
          name="Monthly"
          price="$29"
          period="/mo"
          sub={null}
          badge={null}
          priceId={PRICE_MONTHLY}
          busy={busy}
          onSelect={onSelect}
        />
        {/* Annual */}
        <PricingCard
          name="Annual"
          price="$249"
          period="/yr"
          sub="~$20.75 / mo · save 28%"
          badge="Best value"
          priceId={PRICE_ANNUAL}
          busy={busy}
          onSelect={onSelect}
        />
      </div>

      {error && <p className="mt-6 text-center text-sm text-red-400">{error}</p>}

      <div className="mt-10 text-center space-y-2 text-sm text-gray-600">
        <p>Both plans include full access to all challenges, Python &amp; Rust, and AI hints.</p>
        <p>You will not be charged during your 7-day trial.</p>
      </div>
    </div>
  )
}

function PricingCard({
  name, price, period, sub, badge, priceId, busy, onSelect,
}: {
  name: string
  price: string
  period: string
  sub: string | null
  badge: string | null
  priceId: string
  busy: string | null
  onSelect: (priceId: string) => void
}) {
  const isThis = busy === priceId
  const isAny  = busy !== null
  return (
    <div className={`rounded-xl border p-6 flex flex-col gap-5 ${badge ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-gray-800 bg-gray-900/40'}`}>
      <div>
        {badge && (
          <span className="text-xs font-mono font-semibold text-cyan-400 border border-cyan-500/30 rounded-full px-2 py-0.5 mb-3 inline-block">
            {badge}
          </span>
        )}
        <p className="text-sm font-mono text-gray-400">{name}</p>
        <p className="mt-1 text-4xl font-bold text-white">
          {price}<span className="text-lg font-normal text-gray-500">{period}</span>
        </p>
        {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
      </div>

      <ul className="space-y-2 text-sm text-gray-400 flex-1">
        {['All challenges (Python & Rust)', 'Opt-in AI hints', 'Activity tracking', '7-day free trial'].map(f => (
          <li key={f} className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span> {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(priceId)}
        disabled={isAny}
        className={`w-full rounded-lg py-3 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
          badge
            ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400'
            : 'bg-gray-800 text-gray-100 hover:bg-gray-700'
        }`}
      >
        {isThis ? 'Redirecting…' : 'Start free trial'}
      </button>
    </div>
  )
}

function ActiveSubscriptionView({
  subscription, user, busy, error, onManage,
}: {
  subscription: NonNullable<ReturnType<typeof useSubscription>['subscription']>
  user: ReturnType<typeof useAuth>['user']
  busy: string | null
  error: string
  onManage: () => void
}) {
  const statusLabel: Record<string, string> = {
    trialing: 'Free trial',
    active: 'Active',
    past_due: 'Payment overdue',
    canceled: 'Canceled',
    incomplete: 'Incomplete',
  }

  const trialEnd = subscription.trialEnd?.toDate()
  const periodEnd = subscription.currentPeriodEnd?.toDate()
  const fmt = (d: Date | undefined) =>
    d?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) ?? '—'

  return (
    <div className="mt-16 max-w-md mx-auto">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 space-y-6">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Current plan</p>
          <p className="mt-2 text-2xl font-bold text-white">LayerForge Pro</p>
          <span className={`mt-2 inline-block text-xs font-mono px-2 py-0.5 rounded-full border ${
            subscription.status === 'trialing' ? 'text-purple-400 border-purple-500/30 bg-purple-500/5' :
            subscription.status === 'active'   ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5' :
            'text-red-400 border-red-500/30 bg-red-500/5'
          }`}>
            {statusLabel[subscription.status] ?? subscription.status}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-400 font-mono">
          {subscription.status === 'trialing' && trialEnd && (
            <p>Trial ends: <span className="text-gray-200">{fmt(trialEnd)}</span></p>
          )}
          {periodEnd && (
            <p>
              {subscription.cancelAtPeriodEnd ? 'Access ends:' : 'Next billing:'}
              {' '}<span className="text-gray-200">{fmt(periodEnd)}</span>
            </p>
          )}
          <p>Account: <span className="text-gray-200">{user?.email}</span></p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="space-y-3">
          <button
            onClick={onManage}
            disabled={busy !== null}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 text-sm font-semibold text-gray-100 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {busy === 'portal' ? 'Opening portal…' : 'Manage subscription'}
          </button>
          <a
            href="/"
            className="block w-full text-center rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-gray-950 hover:bg-cyan-400 transition-colors"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
