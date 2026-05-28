import { useState, useEffect } from 'react'

const D_HEAD = 8
const BASE = 10000.0
const HALF = D_HEAD / 2
const MAX_POS = 24
const COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#fb923c'] as const

function pairTheta(i: number) {
  return BASE ** (-2 * i / D_HEAD)
}

function RotCircle({ idx, pos }: { idx: number; pos: number }) {
  const t = pairTheta(idx)
  const angle = pos * t
  const cx = 32, cy = 32, r = 23
  const tipX = cx + r * Math.sin(angle)
  const tipY = cy - r * Math.cos(angle)
  const col = COLORS[idx]
  const degMod = (((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) * 180 / Math.PI
  const thetaLabel =
    t >= 0.1 ? t.toFixed(1) : t >= 0.01 ? t.toFixed(3) : t.toExponential(0)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="64" height="64" viewBox="0 0 64 64">
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="1.5" />
        {/* 12-o'clock tick */}
        <line x1={cx} y1={cy - r} x2={cx} y2={cy - r + 4} stroke="#2d3748" strokeWidth="1.5" />
        {/* Reference line at angle 0 (dashed) */}
        <line
          x1={cx} y1={cy} x2={cx} y2={cy - r}
          stroke={col} strokeWidth="1" strokeDasharray="2,2" opacity="0.2"
        />
        {/* Rotation vector */}
        <line
          x1={cx} y1={cy} x2={tipX} y2={tipY}
          stroke={col} strokeWidth="2.5" strokeLinecap="round"
        />
        {/* Tip dot */}
        <circle cx={tipX} cy={tipY} r="3" fill={col} />
        {/* Center pivot */}
        <circle cx={cx} cy={cy} r="2" fill="#374151" />
      </svg>
      <div className="text-center text-[10px] font-mono leading-tight">
        <div className="font-semibold" style={{ color: col }}>pair {idx}</div>
        <div className="text-gray-500">θ={thetaLabel}</div>
        <div className="text-gray-400">{degMod.toFixed(degMod < 10 ? 1 : 0)}°</div>
      </div>
    </div>
  )
}

export function RoPEVisualization() {
  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPos(p => (p + 1) % MAX_POS), 620)
    return () => clearInterval(id)
  }, [playing])

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 mb-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Angle = m · θᵢ &nbsp;(d={D_HEAD}, base={BASE.toLocaleString()})
        </span>
        <button
          onClick={() => setPlaying(p => !p)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-1"
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      {/* Vector shown as colour-coded pairs */}
      <div className="flex items-center gap-1 mb-4">
        <span className="text-[11px] font-mono text-gray-600 shrink-0">x =</span>
        <div className="flex flex-1 gap-1">
          {Array.from({ length: HALF }, (_, i) => {
            const col = COLORS[i]
            return (
              <div
                key={i}
                className="flex-1 flex rounded overflow-hidden"
                style={{ border: `1px solid ${col}40` }}
              >
                <span
                  className="flex-1 text-center text-[10px] font-mono py-1.5"
                  style={{ color: col, background: `${col}20` }}
                >
                  {String.fromCharCode(97 + i * 2)}
                </span>
                <span
                  className="flex-1 text-center text-[10px] font-mono py-1.5"
                  style={{ color: col, background: `${col}20`, borderLeft: `1px solid ${col}30` }}
                >
                  {String.fromCharCode(97 + i * 2 + 1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Position slider */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] font-mono text-white w-14 shrink-0">m = {pos}</span>
        <input
          type="range" min={0} max={MAX_POS - 1} value={pos}
          onChange={e => { setPos(+e.target.value); setPlaying(false) }}
          className="flex-1 accent-cyan-500"
        />
        <span className="text-[10px] font-mono text-gray-600">{MAX_POS - 1}</span>
      </div>

      {/* One rotation circle per pair */}
      <div className="flex justify-around">
        {Array.from({ length: HALF }, (_, i) => (
          <RotCircle key={i} idx={i} pos={pos} />
        ))}
      </div>

      <p className="mt-3 text-[10px] text-gray-600 text-center leading-snug">
        Higher pair index → smaller θᵢ → slower rotation — encoding both local and long-range position differences
      </p>
    </div>
  )
}
