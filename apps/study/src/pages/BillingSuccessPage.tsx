export function BillingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6">
      <div className="pointer-events-none fixed top-10 left-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="relative w-full max-w-sm text-center space-y-6">
        <p className="font-mono text-xl font-bold text-cyan-400">LayerForge</p>
        <div className="rounded-xl border border-cyan-500/20 bg-gray-900/60 p-10 shadow-xl space-y-4">
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
        </div>
      </div>
    </div>
  )
}
