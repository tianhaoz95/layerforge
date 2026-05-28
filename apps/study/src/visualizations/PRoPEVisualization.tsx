import { useState, useEffect } from 'react'

const D_HEAD = 8
const BASE = 10000.0
const HALF = D_HEAD / 2
const MAX_POS = 24
const COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#fb923c'] as const

function pairTheta(i: number) {
  return BASE ** (-2 * i / D_HEAD)
}

interface RotCircleProps {
  idx: number
  pos: number
  isRotated: boolean
}

function RotCircle({ idx, pos, isRotated }: RotCircleProps) {
  const t = pairTheta(idx)
  const angle = isRotated ? pos * t : 0
  const cx = 24, cy = 24, r = 18
  const tipX = cx + r * Math.sin(angle)
  const tipY = cy - r * Math.cos(angle)
  const col = COLORS[idx]
  const degMod = (((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) * 180 / Math.PI
  const thetaLabel =
    t >= 0.1 ? t.toFixed(1) : t >= 0.01 ? t.toFixed(3) : t.toExponential(0)

  return (
    <div className="flex flex-col items-center">
      <svg width="48" height="48" viewBox="0 0 48 48">
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="1.5" />
        {/* 12-o'clock tick */}
        <line x1={cx} y1={cy - r} x2={cx} y2={cy - r + 3} stroke="#2d3748" strokeWidth="1.5" />
        {/* Reference line at angle 0 (dashed) */}
        <line
          x1={cx} y1={cy} x2={cx} y2={cy - r}
          stroke={col} strokeWidth="1" strokeDasharray="2,2" opacity="0.2"
        />
        {/* Rotation vector */}
        <line
          x1={cx} y1={cy} x2={tipX} y2={tipY}
          stroke={col} strokeWidth="2" strokeLinecap="round"
          opacity={isRotated ? 1.0 : 0.25}
        />
        {/* Tip dot */}
        <circle cx={tipX} cy={tipY} r="2" fill={col} opacity={isRotated ? 1.0 : 0.25} />
        {/* Center pivot */}
        <circle cx={cx} cy={cy} r="1.5" fill="#374151" />
      </svg>
      <div className="text-center text-[9px] font-mono leading-tight mt-0.5">
        <div className="font-semibold" style={{ color: col }}>
          p{idx}
        </div>
        <div className="text-gray-500">
          {isRotated ? `θ=${thetaLabel}` : 'NoPE'}
        </div>
        <div className="text-gray-400">
          {isRotated ? `${degMod.toFixed(0)}°` : '0°'}
        </div>
      </div>
    </div>
  )
}

export function PRoPEVisualization() {
  const [pos, setPos] = useState(0)
  const [pPercentage, setPPercentage] = useState(0.5) // Default to 50%
  const [playing, setPlaying] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPos(p => (p + 1) % MAX_POS), 620)
    return () => clearInterval(id)
  }, [playing])

  const ropeAnglesCount = Math.floor(pPercentage * HALF)

  // Dynamic explanation text based on hovered node
  const getExplanation = () => {
    switch (hoveredNode) {
      case 'config':
        return `Hyperparameters: p = ${(pPercentage * 100).toFixed(0)}% specifies that the first ${ropeAnglesCount} pairs will be rotated. d_head = ${D_HEAD}.`;
      case 'split':
        return `Calculate split: rope_angles = ⌊${pPercentage} × ${HALF}⌋ = ${ropeAnglesCount} rotated pairs. Remaining ${HALF - ropeAnglesCount} pairs are unrotated (NoPE).`;
      case 'theta':
        return `Compute standard RoPE frequencies for rotated channels: θ_i = base^(-2i/d) for i < ${ropeAnglesCount}.`;
      case 'pad':
        return `Pad frequencies with 0.0 for unrotated channels so their rotation evaluates to identity.`;
      case 'vector':
        return `Full frequency vector: [${Array.from({ length: HALF }).map((_, i) => i < ropeAnglesCount ? pairTheta(i).toFixed(2) : '0.0').join(', ')}].`;
      case 'positions':
        return `Integer sequence positions [0, 1, ..., seq_len-1]. Currently displaying position m = ${pos}.`;
      case 'outer':
        return `Outer product: angles = pos[:, None] × θ[None, :] to map phase angles over sequence and dimensions.`;
      case 'angles':
        return `Phase angle matrix of shape (seq_len, d_head/2). Rotated dimensions have active phases; NoPE stays at 0.0.`;
      case 'cos_emb':
        return `cos_emb = concat([cos(angles), cos(angles)], axis=-1) of shape (seq, 8). Values: ${Array.from({ length: D_HEAD }).map((_, i) => (i % HALF) < ropeAnglesCount ? Math.cos(pos * pairTheta(i % HALF)).toFixed(2) : '1.0').join(', ')}`;
      case 'sin_emb':
        return `sin_emb = concat([sin(angles), sin(angles)], axis=-1) of shape (seq, 8). Values: ${Array.from({ length: D_HEAD }).map((_, i) => (i % HALF) < ropeAnglesCount ? Math.sin(pos * pairTheta(i % HALF)).toFixed(2) : '0.0').join(', ')}`;
      case 'rotation':
        return `x_rot = x · cos + rotate_half(x) · sin. Unrotated channels (cos=1, sin=0) simplify to x · 1 + 0 = x, preserving features.`;
      default:
        return 'Hover over any node in the data flow flowchart below to explore the exact shape transformations and values!';
    }
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 mb-4 select-none">
      {/* CSS Styles for Animated Flow Lines */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowAnim {
          to {
            stroke-dashoffset: -20;
          }
        }
        .flow-path {
          stroke-dasharray: 6, 4;
          animation: flowAnim 1.2s linear infinite;
        }
        .flow-path-paused {
          stroke-dasharray: 6, 4;
        }
      `}} />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
          Proportional RoPE &nbsp;(d_head={D_HEAD}, base={BASE.toLocaleString()})
        </span>
        <button
          onClick={() => setPlaying(p => !p)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-1"
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      {/* Control sliders */}
      <div className="grid grid-cols-2 gap-3 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-gray-400 shrink-0 w-16">
            p = {(pPercentage * 100).toFixed(0)}%
          </span>
          <input
            type="range"
            min={0}
            max={1.0}
            step={0.25}
            value={pPercentage}
            onChange={e => setPPercentage(+e.target.value)}
            className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-gray-400 shrink-0 w-16">
            m = {pos}
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
            className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      {/* Visualizers Grid */}
      <div className="grid grid-cols-5 gap-2 items-center border-b border-gray-800/40 pb-2 mb-2">
        {/* Color coded vector */}
        <div className="col-span-1 flex flex-col gap-0.5 pr-1 border-r border-gray-800/30">
          <div className="text-[8px] font-mono text-gray-600">x dimensions</div>
          <div className="flex flex-col gap-0.5">
            {Array.from({ length: HALF }).map((_, i) => {
              const col = COLORS[i]
              const active = i < ropeAnglesCount
              return (
                <div
                  key={i}
                  className="h-2 rounded-sm text-[7px] text-center font-mono leading-none flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: active ? `${col}25` : '#1f2937',
                    border: `1px solid ${active ? `${col}40` : '#2d3748'}`,
                    color: active ? col : '#4a5568',
                  }}
                >
                  p{i}
                </div>
              )
            })}
          </div>
        </div>

        {/* 4 rotation phasors */}
        <div className="col-span-4 flex justify-around pl-1">
          {Array.from({ length: HALF }).map((_, i) => {
            const isRotated = i < ropeAnglesCount
            return <RotCircle key={i} idx={i} pos={pos} isRotated={isRotated} />
          })}
        </div>
      </div>

      {/* Graphical Animated Data Flow Flowchart */}
      <div className="border-t border-gray-800/60 pt-2 flex flex-col">
        <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Animated Data Flow (Interactive):
        </div>

        <div className="bg-gray-950/40 rounded border border-gray-850 p-2 relative flex justify-center items-center">
          <svg width="100%" viewBox="0 0 540 260" className="max-w-full">
            {/* Arrow Marker Definitions */}
            <defs>
              <marker id="arrow-inactive" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#334155" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a78bfa" />
              </marker>
              <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#22d3ee" />
              </marker>
            </defs>

            {/* Connection Lines (Flow Paths) */}
            {/* 1. config -> split */}
            <line
              x1="270" y1="26" x2="270" y2="42"
              stroke={hoveredNode === 'config' || hoveredNode === 'split' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'config' || hoveredNode === 'split' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
              style={{ strokeDashoffset: playing ? undefined : 0 }}
            />
            {/* 2. split -> theta */}
            <line
              x1="270" y1="60" x2="270" y2="76"
              stroke={hoveredNode === 'split' || hoveredNode === 'theta' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'split' || hoveredNode === 'theta' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 3. theta -> pad */}
            <line
              x1="230" y1="85" x2="275" y2="85"
              stroke={hoveredNode === 'theta' || hoveredNode === 'pad' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'theta' || hoveredNode === 'pad' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 4. pad -> vector */}
            <line
              x1="365" y1="85" x2="400" y2="85"
              stroke={hoveredNode === 'pad' || hoveredNode === 'vector' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'pad' || hoveredNode === 'vector' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 5. positions -> outer */}
            <line
              x1="190" y1="129" x2="240" y2="129"
              stroke={hoveredNode === 'positions' || hoveredNode === 'outer' ? '#22d3ee' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'positions' || hoveredNode === 'outer' ? 'url(#arrow-cyan)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 6. vector -> outer (curved down-left) */}
            <path
              d="M 430,94 L 430,129 L 340,129"
              fill="none"
              stroke={hoveredNode === 'vector' || hoveredNode === 'outer' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'vector' || hoveredNode === 'outer' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 7. outer -> angles */}
            <line
              x1="290" y1="138" x2="290" y2="154"
              stroke={hoveredNode === 'outer' || hoveredNode === 'angles' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'outer' || hoveredNode === 'angles' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 8. angles -> cos_emb */}
            <path
              d="M 290,172 L 290,182 L 160,182 L 160,192"
              fill="none"
              stroke={hoveredNode === 'angles' || hoveredNode === 'cos_emb' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'angles' || hoveredNode === 'cos_emb' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 9. angles -> sin_emb */}
            <path
              d="M 290,172 L 290,182 L 420,182 L 420,192"
              fill="none"
              stroke={hoveredNode === 'angles' || hoveredNode === 'sin_emb' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'angles' || hoveredNode === 'sin_emb' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 10. cos_emb -> rotation */}
            <path
              d="M 160,210 L 160,220 L 230,220 L 230,230"
              fill="none"
              stroke={hoveredNode === 'cos_emb' || hoveredNode === 'rotation' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'cos_emb' || hoveredNode === 'rotation' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />
            {/* 11. sin_emb -> rotation */}
            <path
              d="M 420,210 L 420,220 L 350,220 L 350,230"
              fill="none"
              stroke={hoveredNode === 'sin_emb' || hoveredNode === 'rotation' ? '#a78bfa' : '#334155'}
              strokeWidth="1.5"
              markerEnd={hoveredNode === 'sin_emb' || hoveredNode === 'rotation' ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className={playing ? 'flow-path' : 'flow-path-paused'}
            />

            {/* FLOWCHART NODES */}
            {/* 1. config */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('config')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="2" width="180" height="24" rx="4"
                fill="#1e293b" stroke={hoveredNode === 'config' ? '#a78bfa' : '#334155'} strokeWidth="1.5" />
              <text x="270" y="16" fill="#f1f5f9" fontSize="9" fontFamily="monospace" textAnchor="middle">
                rope_percentage, d_head
              </text>
            </g>

            {/* 2. split */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('split')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="200" y="42" width="140" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'split' ? '#a78bfa' : '#334155'} />
              <text x="270" y="54" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                split dimensions
              </text>
            </g>

            {/* 3. theta */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('theta')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="75" y="76" width="155" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'theta' ? '#a78bfa' : '#334155'} />
              <text x="152.5" y="88" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                theta (i &lt; rope_angles)
              </text>
            </g>

            {/* 4. pad */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('pad')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="275" y="76" width="90" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'pad' ? '#a78bfa' : '#334155'} />
              <text x="320" y="88" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                pad with 0.0
              </text>
            </g>

            {/* 5. vector (θ) */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('vector')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="400" y="76" width="65" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'vector' ? '#a78bfa' : '#334155'} />
              <text x="432.5" y="88" fill="#f1f5f9" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                θ (d/2,)
              </text>
            </g>

            {/* 6. positions */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('positions')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="75" y="120" width="115" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'positions' ? '#22d3ee' : '#334155'} />
              <text x="132.5" y="132" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                positions (seq,)
              </text>
            </g>

            {/* 7. outer */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('outer')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="240" y="120" width="100" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'outer' ? '#a78bfa' : '#334155'} />
              <text x="290" y="132" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                outer product
              </text>
            </g>

            {/* 8. angles */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('angles')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="220" y="154" width="140" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'angles' ? '#a78bfa' : '#334155'} />
              <text x="290" y="166" fill="#f1f5f9" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                angles (seq, d/2)
              </text>
            </g>

            {/* 9. cos_emb */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('cos_emb')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="90" y="192" width="140" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'cos_emb' ? '#a78bfa' : '#334155'} />
              <text x="160" y="204" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                cos(angles) concat
              </text>
            </g>

            {/* 10. sin_emb */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('sin_emb')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="350" y="192" width="140" height="18" rx="3"
                fill="#1e293b" stroke={hoveredNode === 'sin_emb' ? '#a78bfa' : '#334155'} />
              <text x="420" y="204" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                sin(angles) concat
              </text>
            </g>

            {/* 11. rotation (merge output) */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode('rotation')}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="110" y="230" width="320" height="24" rx="4"
                fill="#1e293b" stroke={hoveredNode === 'rotation' ? '#a78bfa' : '#334155'} strokeWidth="1.5" />
              <text x="270" y="244" fill="#f1f5f9" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                x · cos_emb  +  rotate_half(x) · sin_emb  →  x_rot (seq, d)
              </text>
            </g>
          </svg>
        </div>

        {/* Dynamic, interactive explanation card below the flowchart */}
        <div className="mt-2 h-12 flex flex-col justify-center bg-gray-950/40 rounded px-2.5 border border-gray-850">
          <p className="text-[9px] text-gray-300 leading-normal transition-all duration-200">
            {getExplanation()}
          </p>
        </div>
      </div>
    </div>
  )
}
