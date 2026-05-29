import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { StatCard } from './components/StatCard'
import { SignupChart } from './components/SignupChart'
import { WaitlistTable } from './components/WaitlistTable'
import { useWaitlist } from './hooks/useWaitlist'

// Comma-separated list of emails allowed to access the admin dashboard.
// Set VITE_ADMIN_EMAILS at build time to override.
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? 'jacksonzhou666@gmail.com')
  .split(',')
  .map((e: string) => e.trim())
  .filter(Boolean)

type Tab = 'overview' | 'waitlist'

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [tab, setTab] = useState<Tab>('overview')

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  if (user === undefined) return <Spinner />

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <p className="font-mono text-xl font-bold text-cyan-400">LayerForge Admin</p>
          <p className="text-sm text-gray-500">Sign in with your Google account to continue.</p>
          <button
            onClick={() => signInWithPopup(auth, googleProvider)}
            className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  if (!ADMIN_EMAILS.includes(user.email ?? '')) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-4">
          <p className="font-mono text-xl font-bold text-red-400">Access Denied</p>
          <p className="text-sm text-gray-500">
            <span className="text-gray-400">{user.email}</span> is not an admin.
          </p>
          <button
            onClick={() => signOut(auth)}
            className="text-sm text-gray-600 hover:text-gray-400 transition-colors underline"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return <Dashboard user={user} tab={tab} setTab={setTab} />
}

function Dashboard({
  user,
  tab,
  setTab,
}: {
  user: User
  tab: Tab
  setTab: (t: Tab) => void
}) {
  const { entries, loading, error } = useWaitlist()

  const now = Date.now()
  const msPerDay = 86_400_000
  const last7 = entries.filter((e) => now - new Date(e.submittedAt).getTime() < 7 * msPerDay).length
  const last30 = entries.filter((e) => now - new Date(e.submittedAt).getTime() < 30 * msPerDay).length

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-cyan-400">LayerForge Admin</span>
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName ?? ''}
                className="w-7 h-7 rounded-full border border-gray-700"
              />
            )}
            <span className="text-xs text-gray-500 font-mono hidden sm:block">{user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors font-mono"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="border-b border-gray-800">
        <div className="mx-auto max-w-6xl px-6 flex gap-1 pt-1">
          {(['overview', 'waitlist'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-mono capitalize border-b-2 transition-colors ${
                tab === t
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'waitlist' ? `Waitlist${entries.length > 0 ? ` (${entries.length})` : ''}` : t}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total signups" value={loading ? '—' : entries.length} accent="cyan" />
              <StatCard label="Last 7 days" value={loading ? '—' : last7} accent="purple" />
              <StatCard label="Last 30 days" value={loading ? '—' : last30} accent="emerald" />
            </div>

            {/* Signup trend */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-mono text-gray-400">Signup trend — last 30 days</h2>
                {loading && <span className="text-xs font-mono text-gray-600">Loading...</span>}
              </div>
              {error ? (
                <p className="text-xs font-mono text-red-400">Error: {error}</p>
              ) : (
                <SignupChart entries={entries} days={30} />
              )}
            </div>

            {/* Phase notice */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/20 p-5">
              <h2 className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-3">Platform phase</h2>
              <div className="flex flex-wrap gap-3">
                <Badge active label="Phase 1" sub="Auth-less, localStorage" />
                <Badge label="Phase 2" sub="Firebase Auth + Firestore" />
                <Badge label="Phase 3" sub="Gemini hints + Cloud Run sandbox" />
              </div>
              <p className="mt-3 text-xs text-gray-600">
                Waitlist data appears here once the preview app is wired to Firestore (Phase 2).
                For now, signups are stored in visitors' localStorage only.
              </p>
            </div>
          </div>
        )}

        {tab === 'waitlist' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-mono font-semibold text-gray-200">Waitlist</h2>
              <p className="text-xs text-gray-600 mt-0.5">Live from Firestore — updates in real time.</p>
            </div>
            <WaitlistTable entries={entries} loading={loading} error={error} />
          </div>
        )}
      </main>
    </div>
  )
}

function Badge({ label, sub, active }: { label: string; sub: string; active?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-xs font-mono ${
        active
          ? 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400'
          : 'border-gray-800 bg-gray-900/40 text-gray-600'
      }`}
    >
      <span className={active ? 'text-cyan-400' : 'text-gray-500'}>{label}</span>
      <span className="ml-2 text-gray-700">{sub}</span>
    </div>
  )
}

function Spinner() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}
