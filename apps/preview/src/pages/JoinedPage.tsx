import { useLocation } from 'react-router-dom'

interface LocationState {
  email?: string
  name?: string
}

export function JoinedPage() {
  const { state } = useLocation()
  const { email, name } = (state as LocationState) ?? {}

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6">
      <div className="pointer-events-none absolute top-10 left-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]" />

      <div className="relative w-full max-w-md text-center space-y-6">
        <a href="/" className="inline-block font-mono text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          LayerForge
        </a>

        <div className="rounded-xl border border-cyan-500/20 bg-gray-900/60 p-10 shadow-xl">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-white">You're on the list!</h1>
          {email ? (
            <p className="mt-3 text-gray-400">
              We'll reach out to{' '}
              <span className="text-cyan-400">{email}</span>{' '}
              when early access opens.
            </p>
          ) : (
            <p className="mt-3 text-gray-400">
              {name ? `Thanks, ${name}! ` : ''}We'll be in touch when early access opens.
            </p>
          )}
          <p className="mt-5 text-sm text-gray-600">
            Know another AI engineer who'd be interested?
          </p>
          <a
            href="/"
            className="mt-3 inline-block text-sm font-mono text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            Share the waitlist →
          </a>
        </div>
      </div>
    </div>
  )
}
