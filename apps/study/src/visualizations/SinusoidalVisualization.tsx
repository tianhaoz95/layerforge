import { useState, useEffect } from 'react'

const D_MODEL = 16
const BASE = 10000.0
const SEQ_LEN = 16

function getPE(pos: number, dim: number): number {
  const i = Math.floor(dim / 2)
  const divTerm = Math.pow(BASE, -2 * i / D_MODEL)
  const angle = pos * divTerm
  return dim % 2 === 0 ? Math.sin(angle) : Math.cos(angle)
}

export function SinusoidalVisualization() {
  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPos(p => (p + 1) % SEQ_LEN), 800)
    return () => clearInterval(id)
  }, [playing])

  // SVG dimensions for Wave Plot
  const svgWidth = 240
  const svgHeight = 90
  const paddingX = 15
  const paddingY = 15

  const getXCoord = (x: number) => {
    return paddingX + (x / (SEQ_LEN - 1)) * (svgWidth - 2 * paddingX)
  }

  const getYCoord = (y: number) => {
    return paddingY + ((1 - y) / 2) * (svgHeight - 2 * paddingY)
  }

  // Generate path points for continuous sine curves
  const getSinePath = (freqIdx: number) => {
    const divTerm = Math.pow(BASE, -2 * freqIdx / D_MODEL)
    let points = []
    const steps = 100
    for (let s = 0; s <= steps; s++) {
      const xVal = (s / steps) * (SEQ_LEN - 1)
      const yVal = Math.sin(xVal * divTerm)
      points.push(`${getXCoord(xVal)},${getYCoord(yVal)}`)
    }
    return `M ${points.join(' L ')}`
  }


  // Active values at the current pos
  const divTerm0 = Math.pow(BASE, 0) // i = 0 (dim 0, 1)
  const divTerm1 = Math.pow(BASE, -2 / D_MODEL) // i = 1 (dim 2, 3)

  const activeSin0 = Math.sin(pos * divTerm0)
  const activeCos0 = Math.cos(pos * divTerm0)
  const activeSin1 = Math.sin(pos * divTerm1)
  const activeCos1 = Math.cos(pos * divTerm1)

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 mb-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
          Sinusoidal Positional Encoding &nbsp;(d_model={D_MODEL}, base={BASE.toLocaleString()})
        </span>
        <button
          onClick={() => setPlaying(p => !p)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-1"
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      {/* Control slider */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-[10px] font-mono text-gray-400 shrink-0 w-24">
          Position m = {pos}
        </span>
        <input
          type="range"
          min={0}
          max={SEQ_LEN - 1}
          value={pos}
          onChange={e => {
            setPos(+e.target.value)
            setPlaying(false)
          }}
          className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Main Grid: Heatmap vs Waveform Plot */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* 1. Heatmap (cols 1-5) */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 self-start">
            16×16 PE Matrix Heatmap
          </div>
          <div className="relative p-1 bg-gray-950/60 rounded border border-gray-800">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, minmax(0, 1fr))', gap: '2px', width: '180px', height: '180px' }}>
              {Array.from({ length: SEQ_LEN }).map((_, r) =>
                Array.from({ length: D_MODEL }).map((_, c) => {
                  const val = getPE(r, c)
                  const isSin = c % 2 === 0
                  const isCurrentRow = r === pos
                  
                  // Color mapping
                  // Positive: Cyan (sin flavor) or Purple (cos flavor)
                  // Negative: Darker variations
                  let bgStyle = {}
                  if (val >= 0) {
                    bgStyle = {
                      backgroundColor: isSin 
                        ? `rgba(34, 211, 238, ${val * 0.85 + 0.15})` // Cyan
                        : `rgba(167, 139, 250, ${val * 0.85 + 0.15})` // Purple
                    }
                  } else {
                    bgStyle = {
                      backgroundColor: isSin
                        ? `rgba(8, 86, 102, ${Math.abs(val) * 0.85 + 0.15})` // Dark Cyan
                        : `rgba(74, 39, 133, ${Math.abs(val) * 0.85 + 0.15})` // Dark Purple
                    }
                  }

                  const isHovered = hoveredCell?.r === r && hoveredCell?.c === c

                  return (
                    <div
                      key={`${r}-${c}`}
                      onMouseEnter={() => setHoveredCell({ r, c })}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => {
                        setPos(r)
                        setPlaying(false)
                      }}
                      className="rounded-[1px] cursor-pointer transition-all duration-150 relative"
                      style={{
                        ...bgStyle,
                        boxShadow: isCurrentRow 
                          ? '0 0 0 1px #fff, 0 0 2px 1px rgba(34,211,238,0.5)' 
                          : isHovered 
                            ? '0 0 0 1px rgba(255,255,255,0.5)' 
                            : 'none',
                        zIndex: isCurrentRow ? 10 : 1
                      }}
                    />
                  )
                })
              )}
            </div>
            {/* Axis labels */}
            <div className="flex justify-between text-[7px] text-gray-500 font-mono mt-1 px-0.5">
              <span>Dim 0 (sin)</span>
              <span>Dim 15 (cos)</span>
            </div>
          </div>
        </div>

        {/* 2. Wave curves & cell info (cols 6-12) */}
        <div className="md:col-span-6 flex flex-col h-full justify-between">
          <div>
            <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Sin/Cos Frequencies (Pos {pos})
            </div>
            
            {/* Continuous SVG curves */}
            <div className="bg-gray-950/40 rounded border border-gray-850 p-1 flex justify-center items-center">
              <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="max-w-full">
                {/* Horizontal reference line (y=0) */}
                <line
                  x1={paddingX} y1={getYCoord(0)} x2={svgWidth - paddingX} y2={getYCoord(0)}
                  stroke="#374151" strokeWidth="1" strokeDasharray="3,3"
                />
                
                {/* High frequency sine (dim 0) */}
                <path
                  d={getSinePath(0)}
                  fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.8"
                />
                
                {/* Mid-Low frequency sine (dim 2) */}
                <path
                  d={getSinePath(1)}
                  fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6"
                />

                {/* Glowing coordinate markers for current pos */}
                {/* Dim 0 marker */}
                <circle
                  cx={getXCoord(pos)} cy={getYCoord(activeSin0)} r="4"
                  fill="#22d3ee" stroke="#111827" strokeWidth="1"
                  className="animate-pulse"
                />
                
                {/* Dim 2 marker */}
                <circle
                  cx={getXCoord(pos)} cy={getYCoord(activeSin1)} r="4"
                  fill="#a78bfa" stroke="#111827" strokeWidth="1"
                />
                
                {/* Text annotations */}
                <text x={getXCoord(1)} y={getYCoord(0.7)} fill="#22d3ee" fontSize="7" fontFamily="monospace">
                  i=0 (dim 0, high freq)
                </text>
                <text x={getXCoord(1.5)} y={getYCoord(-0.7)} fill="#a78bfa" fontSize="7" fontFamily="monospace">
                  i=1 (dim 2, mid freq)
                </text>
              </svg>
            </div>
          </div>

          {/* Hovered cell info card or active state summary */}
          <div className="mt-2 p-1.5 rounded bg-gray-950/80 border border-gray-800/80 text-[9px] font-mono leading-relaxed">
            {hoveredCell ? (
              <div>
                <span className="text-gray-400">Cell:</span> pos=<span className="text-white">{hoveredCell.r}</span>, dim=<span className="text-white">{hoveredCell.c}</span>
                <br />
                <span className="text-gray-400">Formula:</span> {hoveredCell.c % 2 === 0 ? 'sin' : 'cos'}({hoveredCell.r} · 10000^{`-${2 * Math.floor(hoveredCell.c / 2)}/${D_MODEL}`})
                <br />
                <span className="text-gray-400">Value:</span> <span style={{ color: hoveredCell.c % 2 === 0 ? '#22d3ee' : '#a78bfa' }} className="font-semibold">{getPE(hoveredCell.r, hoveredCell.c).toFixed(4)}</span>
              </div>
            ) : (
              <div>
                <span className="text-gray-400">Active values at position m={pos}:</span>
                <div className="grid grid-cols-2 gap-x-2 mt-0.5">
                  <div>
                    <span className="text-[#22d3ee]">PE_(m, 0) (sin):</span> {activeSin0.toFixed(3)}
                  </div>
                  <div>
                    <span className="text-[#a78bfa]">PE_(m, 1) (cos):</span> {activeCos0.toFixed(3)}
                  </div>
                  <div>
                    <span className="text-[#22d3ee]/80">PE_(m, 2) (sin):</span> {activeSin1.toFixed(3)}
                  </div>
                  <div>
                    <span className="text-[#a78bfa]/80">PE_(m, 3) (cos):</span> {activeCos1.toFixed(3)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="text-[10px] text-gray-600 text-center mt-2.5">
        Each index pair (2i, 2i+1) computes a sine and cosine component sharing frequency θ_i = 10000^(-2i/d_model). Notice how frequencies decay from left to right in the heatmap.
      </div>
    </div>
  )
}
