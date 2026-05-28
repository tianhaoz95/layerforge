import { useState, useEffect } from 'react'

interface Props {
  hint: string
}

export function HintPanel({ hint }: Props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  // Simulate async hint fetch (Phase 3: replace with Cloud Function call)
  useEffect(() => {
    setLoading(true)
    setVisible(false)
    const timer = setTimeout(() => {
      setLoading(false)
      setVisible(true)
    }, 900)
    return () => clearTimeout(timer)
  }, [hint])

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-400">
        <span className="text-base">💡</span>
        AI Mentor Hint
        {/* Phase 3: replace tag below with model name from HintResponse */}
        <span className="ml-auto rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-500">
          Phase 1 — static
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          Generating hint…
        </div>
      ) : visible ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{hint}</p>
      ) : null}
    </div>
  )
}
