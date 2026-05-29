import { EditorMockup } from '../components/EditorMockup'
import { RoPEPlayground } from '../components/RoPEPlayground'

interface Props {
  onSignIn: () => void
}

export function SignInPage({ onSignIn }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-gray-100">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-[100px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-16 lg:grid-cols-12 lg:items-center">

          {/* Left: intro + sign-in */}
          <div className="flex flex-col lg:col-span-5">
            <span className="mb-8 font-mono text-2xl font-bold text-cyan-400">LayerForge</span>

            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Code-first AI/ML Learning
            </span>

            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Build AI Architecture.{' '}
              <span className="text-cyan-400">From First Principles.</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-gray-400">
              Stop watching slide decks. LayerForge drops you into a code editor immediately — building transformer layers, attention mechanisms, and GPU kernels from scratch.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Stuck? An AI mentor is one click away — but only when{' '}
              <em className="text-gray-400">you</em> ask for it.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-gray-500">
              <span><span className="text-cyan-400">✓</span> Python &amp; Rust challenges</span>
              <span><span className="text-purple-400">✓</span> 4 modules</span>
              <span><span className="text-cyan-400">✓</span> Opt-in AI hints only</span>
            </div>

            {/* Sign-in card */}
            <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
              <h2 className="mb-1 text-base font-semibold text-gray-100">Sign in to continue</h2>
              <p className="mb-5 text-sm text-gray-500">
                Access the challenge arena and track your progress.
              </p>
              <button
                onClick={onSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-700 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M17.64 9.2a10.3 10.3 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" fill="#4285F4"/>
                  <path d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.43 5.43 0 0 1-8.09-2.85H.97v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.96 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.97a9 9 0 0 0 0 8.08l2.99-2.33z" fill="#FBBC05"/>
                  <path d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0 9 9 0 0 0 .97 4.96L3.96 7.3A5.36 5.36 0 0 1 9 3.58z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          {/* Right: visualizations */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                ✨ Dynamic Socratic AI Hint Mockup
              </p>
              <EditorMockup />
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                🪐 Interactive RoPE Phasor Rotation Simulator
              </p>
              <RoPEPlayground />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
