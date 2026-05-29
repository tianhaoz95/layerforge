import { useState, useEffect } from 'react'

const TEXT = 'abracadabra'
const COLORS = {
  256: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/40', name: 'ab' },
  257: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40', name: 'ra' },
  258: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', name: 'abra' },
  259: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', name: 'ad' }
} as const

interface BPEState {
  tokens: { text: string; id: number }[]
  activeRules: { pair: [string, string]; result: string; id: number; active: boolean }[]
}

export function BPEVisualization() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setStep(s => (s + 1) % 5)
    }, 1800)
    return () => clearInterval(id)
  }, [playing])

  // Get token representation at current step
  const getBPEState = (currentStep: number): BPEState => {
    // Start with individual characters
    let tokens = TEXT.split('').map(char => ({
      text: char,
      id: char.charCodeAt(0)
    }))

    const rules = [
      { pair: ['a', 'b'] as [string, string], result: 'ab', id: 256 },
      { pair: ['r', 'a'] as [string, string], result: 'ra', id: 257 },
      { pair: ['ab', 'ra'] as [string, string], result: 'abra', id: 258 },
      { pair: ['a', 'd'] as [string, string], result: 'ad', id: 259 }
    ]

    const activeRules = rules.map((rule, idx) => ({
      ...rule,
      active: idx < currentStep
    }))

    // Sequentially apply active rules
    for (let i = 0; i < currentStep; i++) {
      const rule = rules[i]
      const nextTokens: typeof tokens = []
      let j = 0
      while (j < tokens.length) {
        if (
          j < tokens.length - 1 &&
          tokens[j].text === rule.pair[0] &&
          tokens[j + 1].text === rule.pair[1]
        ) {
          nextTokens.push({
            text: rule.result,
            id: rule.id
          })
          j += 2
        } else {
          nextTokens.push(tokens[j])
          j += 1
        }
      }
      tokens = nextTokens
    }

    return { tokens, activeRules }
  };

  const { tokens, activeRules } = getBPEState(step)

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 mb-5 select-none transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Byte-Pair Encoding (BPE) &nbsp;•&nbsp; Iterative Merging
        </span>
        <button
          onClick={() => setPlaying(p => !p)}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700"
          title={playing ? 'Pause Animation' : 'Play Animation'}
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      {/* Slider */}
      <div className="flex items-center gap-3 mb-4 bg-gray-950/40 p-2.5 rounded border border-gray-850">
        <span className="text-[11px] font-mono text-cyan-400 shrink-0 font-bold w-36">
          Merges Applied: {step} / 4
        </span>
        <input
          type="range"
          min={0}
          max={4}
          value={step}
          onChange={e => {
            setStep(+e.target.value)
            setPlaying(false)
          }}
          className="flex-1 accent-cyan-500 h-1 bg-gray-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Token Pill List */}
      <div className="mb-5">
        <div className="text-[10px] font-mono text-gray-500 mb-1.5 uppercase tracking-wider">
          Current Token Sequence (Length: {tokens.length})
        </div>
        <div className="flex flex-wrap gap-1.5 items-center bg-gray-950/60 p-3 rounded-lg border border-gray-850 min-h-[64px]">
          {tokens.map((t, idx) => {
            const hasColor = t.id >= 256
            const style = hasColor ? COLORS[t.id as keyof typeof COLORS] : null
            return (
              <div
                key={`${t.id}-${idx}`}
                className={`flex flex-col items-center justify-center rounded-md border py-1.5 px-3 transition-all duration-500 ${
                  hasColor
                    ? `${style?.bg} ${style?.text} ${style?.border} shadow-[0_0_8px_rgba(34,211,238,0.05)] scale-105 font-bold`
                    : 'bg-gray-850/40 border-gray-800 text-gray-300'
                }`}
              >
                <span className="text-xs font-mono tracking-tight">{t.text}</span>
                <span className="text-[9px] font-mono opacity-50 mt-0.5">{t.id}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rules Table */}
      <div className="grid grid-cols-2 gap-3">
        {activeRules.map((rule, idx) => {
          const style = COLORS[rule.id as keyof typeof COLORS]
          const isNextMerge = step === idx
          return (
            <div
              key={rule.id}
              className={`rounded-md border p-2 flex items-center justify-between transition-all duration-300 ${
                rule.active
                  ? `${style.bg} ${style.border} ${style.text}`
                  : isNextMerge
                  ? 'border-dashed border-cyan-500/50 bg-cyan-500/5 text-gray-300 shadow-[0_0_10px_rgba(6,182,212,0.05)] animate-pulse'
                  : 'border-gray-850 bg-gray-950/20 text-gray-600'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono bg-gray-900/60 px-1.5 py-0.5 rounded border border-gray-800 text-gray-400">
                  {idx + 1}
                </span>
                <span className="text-[11px] font-mono">
                  '{rule.pair[0]}' + '{rule.pair[1]}'
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">➔</span>
                <span className="text-xs font-mono font-bold bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800">
                  {rule.result} <span className="text-[9px] opacity-60">({rule.id})</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-[10px] text-gray-500 text-center leading-snug">
        BPE training identifies the most frequent adjacent token pairs and merges them. 
        Encoding then applies these learned merges in the exact order they were trained.
      </p>
    </div>
  )
}
