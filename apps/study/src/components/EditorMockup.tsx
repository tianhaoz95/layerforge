import { useState } from 'react'

export function EditorMockup() {
  const [showHint, setShowHint] = useState(false)
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 opacity-30 blur-lg" />

      <div className="relative rounded-xl border border-gray-800 bg-gray-950 shadow-2xl shadow-cyan-500/5 overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-gray-800/80 bg-gray-900/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/60" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <span className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-gray-400 font-mono">attention.py</span>
          </div>
          <div className="text-[10px] font-mono text-gray-500 select-none">workspace/study</div>
        </div>

        {/* Code */}
        <pre className="overflow-x-auto p-6 text-sm font-mono leading-relaxed bg-gray-950/40">
          <code className="text-gray-300">
            <span className="text-purple-400">def </span>
            <span className="text-cyan-300">scaled_dot_product_attention</span>
            <span className="text-gray-300">(Q, K, V):</span>
            {'\n'}
            <span className="text-gray-500">    """Scaled dot-product attention."""</span>
            {'\n'}
            <span className="text-gray-300">    scores = Q </span>
            <span className="text-cyan-400">@</span>
            <span className="text-gray-300"> K.T</span>
            {'\n'}
            <span className="text-gray-300">    weights = softmax(scores, axis=</span>
            <span className="text-orange-300">-1</span>
            <span className="text-gray-300">)</span>
            {'\n'}
            <span className="text-purple-400">    return </span>
            <span className="text-gray-300">weights </span>
            <span className="text-cyan-400">@</span>
            <span className="text-gray-300"> V</span>
          </code>
        </pre>

        {/* Terminal pane */}
        <div className="border-t border-gray-800 bg-gray-900/60 p-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-red-500 font-semibold select-none">✗</span>
              <div>
                <span className="text-red-400 font-medium">AssertionError:</span>
                <span className="text-gray-400 ml-1.5">
                  Max difference 0.3421 exceeds tolerance 1e-05 (variance too high)
                </span>
              </div>
            </div>
            <div className="flex items-center self-end sm:self-center shrink-0">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-400 font-medium hover:bg-cyan-500/20 hover:border-cyan-400 transition-all whitespace-nowrap"
              >
                {showHint ? 'Hide AI Hint' : 'AI can help →'}
              </button>
            </div>
          </div>

          {showHint && (
            <div className="mt-3 border-t border-cyan-500/20 pt-3 text-[11px] leading-relaxed text-cyan-300">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 text-sm select-none">💡</span>
                <div>
                  <span className="font-semibold text-cyan-400 font-sans uppercase tracking-wider text-[8px] block mb-1">
                    Socratic Hint (Gemini AI):
                  </span>
                  "Take a look at the magnitude of your{' '}
                  <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">scores</code>.
                  {' '}When the head size{' '}
                  <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">d_k</code>
                  {' '}grows large, the dot products can grow extremely large. What happens when you pass very large values into the{' '}
                  <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">softmax</code>
                  {' '}function, and what scaling factor did Vaswani et al. introduce to counter this?"
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
