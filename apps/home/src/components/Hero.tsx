const WAITLIST_URL = 'http://localhost:5175'

const CODE_SNIPPET = `def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / math.sqrt(d_k)
    weights = softmax(scores, axis=-1)
    # YOUR IMPLEMENTATION HERE
    pass`

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: Copy */}
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Early Access — Waitlist Open
            </span>

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build AI Architecture.{' '}
              <span className="text-cyan-400">From First Principles.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-400">
              Stop watching slide decks. LayerForge drops you into a code
              editor immediately — building transformer layers, attention
              mechanisms, and agentic frameworks from scratch.
            </p>

            <p className="mt-3 text-base text-gray-500">
              Stuck? An AI mentor is one click away — but only when{' '}
              <em className="text-gray-400">you</em> ask for it.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={WAITLIST_URL}
                className="rounded-md bg-cyan-500 px-6 py-3 font-semibold text-gray-950 hover:bg-cyan-400 transition-colors"
              >
                Join the Waitlist
              </a>
              <a
                href="#how-it-works"
                className="rounded-md border border-gray-700 px-6 py-3 font-semibold text-gray-300 hover:border-gray-500 hover:text-gray-100 transition-colors"
              >
                See how it works
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Bridge the AI experience gap.
            </p>
          </div>

          {/* Right: Code preview */}
          <div className="relative">
            <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-2xl shadow-cyan-500/5">
              <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-gray-500 font-mono">attention.py</span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm font-mono leading-relaxed">
                <code className="text-gray-300">
                  <span className="text-purple-400">def </span>
                  <span className="text-cyan-300">scaled_dot_product_attention</span>
                  <span className="text-gray-300">(Q, K, V):</span>
                  {'\n'}
                  <span className="text-gray-300">    d_k = Q.shape[</span>
                  <span className="text-orange-300">-1</span>
                  <span className="text-gray-300">]</span>
                  {'\n'}
                  <span className="text-gray-300">    scores = Q </span>
                  <span className="text-cyan-400">@</span>
                  <span className="text-gray-300"> K.T </span>
                  <span className="text-cyan-400">/</span>
                  <span className="text-gray-300"> math.sqrt(d_k)</span>
                  {'\n'}
                  <span className="text-gray-300">    weights = softmax(scores, axis=</span>
                  <span className="text-orange-300">-1</span>
                  <span className="text-gray-300">)</span>
                  {'\n'}
                  <span className="text-gray-500">    # YOUR IMPLEMENTATION HERE</span>
                  {'\n'}
                  <span className="text-purple-400">    pass</span>
                </code>
              </pre>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-lg border border-red-500/30 bg-gray-900/90 px-4 py-2 text-xs font-mono backdrop-blur">
              <span className="text-red-400">✗ AssertionError:</span>
              <span className="text-gray-400"> output is None</span>
            </div>
            <div className="absolute -bottom-4 right-32 mt-2 rounded-lg border border-cyan-500/30 bg-gray-900/90 px-4 py-2 text-xs backdrop-blur">
              <span className="text-cyan-400 font-medium">AI can help →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// silence unused import warning — snippet is rendered as JSX, not used as a var
void CODE_SNIPPET
