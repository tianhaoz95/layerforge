import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../hooks/useProgress'
import { challenges } from '../data/challenges'
import { ActivityHeatmap } from '../components/ActivityHeatmap'

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

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const { progress, activityLog } = useProgress()

  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('lf-theme') as 'dark' | 'light') || 'dark'
  )
  const [lang, setLang] = useState<'en' | 'zh'>(
    () => (localStorage.getItem('lf-lang') as 'en' | 'zh') || 'en'
  )

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
