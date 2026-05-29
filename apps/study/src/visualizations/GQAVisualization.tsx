import { useState, useEffect } from 'react'

const NUM_Q = 8
const KV_OPTIONS = [1, 2, 4, 8]
const COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#fb923c']

export function GQAVisualization() {
  const [numKv, setNumKv] = useState(2)
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)

  const groups = NUM_Q / numKv

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setFrame(f => f + 1), 60)
    return () => clearInterval(id)
  }, [playing])

  const VW = 560
  const CELL = VW / (NUM_Q + 2)
  const QY = 44
  const KVY = 138

  const groupOf = (i: number) => Math.floor(i * numKv / NUM_Q)
  const colorOf = (g: number) => COLORS[g % COLORS.length]

  const modeLabel =
    numKv === NUM_Q
      ? `MHA — no sharing (G = H = ${NUM_Q})`
      : numKv === 1
      ? 'MQA — all Q heads share one KV head'
      : `GQA — ${numKv} KV heads, ${groups} Q heads per group`

  return (
    <div className="bg-[#0f172a] rounded-xl p-4 select-none">
      <svg width="100%" viewBox={`0 0 ${VW} 172`} style={{ overflow: 'visible' }}>
        {/* Q head boxes */}
        {Array.from({ length: NUM_Q }, (_, i) => {
          const g = groupOf(i)
          const color = colorOf(g)
          const cx = (i + 1) * CELL + CELL / 2
          return (
            <g key={`q${i}`}>
              <rect
                x={cx - 18} y={QY - 15} width={36} height={26}
                rx={4} fill={`${color}22`} stroke={color} strokeWidth={1.5}
              />
              <text
                x={cx} y={QY + 4}
                textAnchor="middle" fill={color}
                fontSize={11} fontFamily="monospace" fontWeight={600}
              >
                Q{i}
              </text>
            </g>
          )
        })}

        {/* Animated flow lines */}
        {Array.from({ length: NUM_Q }, (_, i) => {
          const g = groupOf(i)
          const color = colorOf(g)
          const qcx = (i + 1) * CELL + CELL / 2
          const startI = Math.round(g * NUM_Q / numKv)
          const endI = Math.round((g + 1) * NUM_Q / numKv) - 1
          const midI = (startI + endI) / 2
          const kvcx = (midI + 1) * CELL + CELL / 2
          const dashOffset = String(-(frame * 2) % 20)
          return (
            <line
              key={`line${i}`}
              x1={qcx} y1={QY + 11} x2={kvcx} y2={KVY - 14}
              stroke={color} strokeWidth={1.5} strokeOpacity={0.4}
              strokeDasharray="5,5" strokeDashoffset={dashOffset}
            />
          )
        })}

        {/* KV head boxes */}
        {Array.from({ length: numKv }, (_, g) => {
          const color = colorOf(g)
          const startI = Math.round(g * NUM_Q / numKv)
          const endI = Math.round((g + 1) * NUM_Q / numKv) - 1
          const midI = (startI + endI) / 2
          const cx = (midI + 1) * CELL + CELL / 2
          const bw = Math.max(46, (endI - startI + 1) * CELL - 8)
          return (
            <g key={`kv${g}`}>
              <rect
                x={cx - bw / 2} y={KVY - 14} width={bw} height={26}
                rx={4} fill={`${color}22`} stroke={color} strokeWidth={1.5}
              />
              <text
                x={cx} y={KVY + 4}
                textAnchor="middle" fill={color}
                fontSize={10} fontFamily="monospace" fontWeight={600}
              >
                K{g} / V{g}
              </text>
            </g>
          )
        })}

        {/* Mode label */}
        <text
          x={VW / 2} y={168}
          textAnchor="middle" fill="#6b7280"
          fontSize={10} fontFamily="monospace"
        >
          {modeLabel}
        </text>
      </svg>

      <div className="flex items-center gap-3 mt-2 px-1">
        <button
          onClick={() => setPlaying(p => !p)}
          className="text-[11px] text-gray-400 border border-gray-700 rounded px-2 py-0.5 hover:border-gray-500 transition-colors"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <span className="text-[11px] text-gray-500">G (KV heads):</span>
        <div className="flex gap-1">
          {KV_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setNumKv(n)}
              className={`text-[11px] px-2 py-0.5 rounded border font-mono transition-colors ${
                n === numKv
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-400/10'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-gray-600">
          {groups}× expand via repeat_interleave
        </span>
      </div>

      <p className="text-[10px] text-gray-600 text-center mt-2">
        {numKv === NUM_Q
          ? 'No KV sharing — identical to standard Multi-Head Attention'
          : numKv === 1
          ? `Single KV head shared across all ${NUM_Q} query heads (MQA)`
          : `GQA tiles each KV head across ${groups} query heads, reducing KV cache ${NUM_Q / numKv}× vs MHA`}
      </p>
    </div>
  )
}
