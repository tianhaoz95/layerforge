import { useState, useEffect } from 'react'

const MAX_POS = 16
const BASE_FREQ = 0.5 // High frequency channel rotation speed
const SUB_FREQ = 0.15 // Low frequency channel rotation speed

interface PhasorCircleProps {
  label: string
  angle: number
  color: string
}

function PhasorCircle({ label, angle, color }: PhasorCircleProps) {
  const cx = 36
  const cy = 36
  const r = 28
  
  // Vector coordinates
  const vx = cx + r * Math.cos(angle)
  const vy = cy - r * Math.sin(angle) // SVG coordinates are inverted on Y

  return (
    <div className="flex flex-col items-center bg-gray-950/40 p-2.5 rounded-lg border border-gray-900">
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Unit circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="1.5" />
        {/* Axes */}
        <line x1={cx - r - 4} y1={cy} x2={cx + r + 4} y2={cy} stroke="#111827" strokeWidth="1" strokeDasharray="2,2" />
        <line x1={cx} y1={cy - r - 4} x2={cx} y2={cy + r + 4} stroke="#111827" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Rotating Vector */}
        <line
          x1={cx}
          y1={cy}
          x2={vx}
          y2={vy}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
        {/* Coordinate dot */}
        <circle
          cx={vx}
          cy={vy}
          r="3"
          fill={color}
          className="transition-all duration-300 ease-out shadow-lg"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        {/* Origin dot */}
        <circle cx={cx} cy={cy} r="1.5" fill="#374151" />
      </svg>
      <div className="text-[10px] font-mono font-semibold mt-1.5" style={{ color }}>
        {label}
      </div>
      <div className="text-[8px] font-mono text-gray-500 mt-0.5">
        Angle: {(((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) * 180 / Math.PI).toFixed(0)}°
      </div>
    </div>
  )
}

export function VisualPlayground() {
  const [pos, setPos] = useState(2)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPos(p => (p + 1) % MAX_POS), 900)
    return () => clearInterval(id)
  }, [playing])

  // Angles for Query vector (fixed pos m) and Key vector (shifting relative offset)
  const qAngleFast = pos * BASE_FREQ
  const qAngleSlow = pos * SUB_FREQ

  return (
    <div className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/60">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">RoPE Phasor Rotation Playground</h3>
          <p className="text-[10px] text-gray-500 font-mono">Simulating Query Vector rotation at Pos m={pos}</p>
        </div>
        <button
          onClick={() => setPlaying(p => !p)}
          className="rounded bg-gray-800 hover:bg-gray-700 px-2 py-1 text-xs text-gray-300 font-mono transition-all"
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      {/* Slider controls */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-gray-400 shrink-0 w-24">
          Token Position m = {pos}
        </span>
        <input
          type="range"
          min={0}
          max={MAX_POS - 1}
          value={pos}
          onChange={e => {
            setPos(+e.target.value)
            setPlaying(false)
          }}
          className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Phasors Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        
        {/* 1. Fast rotating dimension pair */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-gray-500 mb-2">Dimension Pair [0, 1] (High Freq)</span>
          <PhasorCircle
            label="Fast Phasor (θ_0)"
            angle={qAngleFast}
            color="#a78bfa"
          />
        </div>

        {/* 2. Slow rotating dimension pair */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-gray-500 mb-2">Dimension Pair [2, 3] (Low Freq)</span>
          <PhasorCircle
            label="Slow Phasor (θ_1)"
            angle={qAngleSlow}
            color="#22d3ee"
          />
        </div>

      </div>

      {/* Summary / Educational card */}
      <div className="rounded-lg bg-gray-950 p-4 border border-gray-800/80 font-mono text-[10px] leading-relaxed text-gray-400">
        <div className="flex items-start gap-2.5">
          <span className="text-purple-400">ℹ</span>
          <div>
            <span className="text-gray-300 font-semibold uppercase block mb-1">Rotational Preservation:</span>
            RoPE rotates consecutive pairs of embedding dimensions in 2D sub-spaces at frequency <code className="bg-gray-900 border border-gray-850 px-1 py-0.5 rounded text-purple-300">θ_i = base^(-2i/d)</code>. As you scrub token position <code className="text-cyan-300">m</code>, the query vector rotates. When matching against key vectors, their dot product depends solely on the relative rotation offset <code className="text-white">m - n</code>.
          </div>
        </div>
      </div>

    </div>
  )
}
