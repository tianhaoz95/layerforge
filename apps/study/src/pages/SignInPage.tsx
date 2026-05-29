interface Props {
  onSignIn: () => void
}

export function SignInPage({ onSignIn }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2 text-center">
          <span className="font-mono text-3xl font-bold text-cyan-400">LayerForge</span>
        </div>
        <p className="mb-10 text-center text-sm text-gray-500">
          Build AI components from scratch. No shortcuts.
        </p>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
          <h2 className="mb-2 text-lg font-semibold text-gray-100">Sign in to continue</h2>
          <p className="mb-6 text-sm text-gray-500">
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

        <p className="mt-8 text-center text-xs text-gray-700">
          Python · Rust · Transformers · GPU Kernels
        </p>
      </div>
    </div>
  )
}
