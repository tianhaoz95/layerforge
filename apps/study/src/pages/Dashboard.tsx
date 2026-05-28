import { challenges } from '../data/challenges'
import { ChallengeCard } from '../components/ChallengeCard'
import { useProgress } from '../hooks/useProgress'
import { useAuth } from '../contexts/AuthContext'

const modules = [...new Set(challenges.map((c) => c.module))]

export function Dashboard() {
  const { progress } = useProgress()
  const { user, loading, signIn, signOut } = useAuth()

  const completedCount = Object.values(progress).filter((p) => p.completed).length

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-mono text-lg font-bold text-cyan-400">LayerForge</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {completedCount}/{challenges.length} completed
            </span>
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName ?? 'User'}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">
                      {user.displayName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                  <button
                    onClick={() => void signOut()}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => void signIn()}
                  className="flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  Sign in with Google
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Challenge Arena</h1>
          <p className="mt-2 text-gray-400">
            Build AI components from scratch. No shortcuts.
          </p>
        </div>

        {modules.map((mod) => {
          const modChallenges = challenges.filter((c) => c.module === mod)
          return (
            <section key={mod} className="mb-12">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <h2 className="text-lg font-semibold text-gray-200">{mod}</h2>
                <span className="text-sm text-gray-600">
                  {modChallenges.filter((c) => progress[c.id]?.completed).length}/
                  {modChallenges.length} done
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modChallenges.map((c) => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    completed={progress[c.id]?.completed ?? false}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
