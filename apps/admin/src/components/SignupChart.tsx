import { useState } from 'react'
import type { WaitlistEntry } from '../hooks/useWaitlist'

interface Props {
  entries: WaitlistEntry[]
  days?: number
}

export function SignupChart({ entries, days = 30 }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  const today = new Date()
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (days - 1 - i))
    return d.toISOString().slice(0, 10)
  })

  const countByDay: Record<string, number> = {}
  buckets.forEach((b) => { countByDay[b] = 0 })
  entries.forEach((e) => {
    const day = e.submittedAt?.slice(0, 10)
    if (day && day in countByDay) countByDay[day]++
  })

  const counts = buckets.map((b) => countByDay[b])
  const max = Math.max(...counts, 1)

  // SVG dimensions
  const vW = 700
  const vH = 160
  const pl = 32   // left padding (y-axis)
  const pr = 8
  const pt = 10
  const pb = 30   // bottom padding (x-axis labels)
  const chartW = vW - pl - pr
  const chartH = vH - pt - pb

  const gap = 2
  const barW = Math.max(1, (chartW - gap * (days - 1)) / days)
  const step = barW + gap

  // Y gridline values
  const yTicks = [0, Math.ceil(max / 2), max]

  function xPos(i: number) {
    return pl + i * step
  }
  function yTop(count: number) {
    return pt + chartH - (count / max) * chartH
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${vW} ${vH}`}
        className="w-full"
        style={{ overflow: 'visible' }}
      >
        {/* Y gridlines */}
        {yTicks.map((tick) => {
          const y = pt + chartH - (tick / max) * chartH
          return (
            <g key={tick}>
              <line
                x1={pl} y1={y} x2={vW - pr} y2={y}
                stroke="#1f2937" strokeWidth="1"
              />
              <text x={pl - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#4b5563">
                {tick}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {counts.map((count, i) => {
          const barH = Math.max(count > 0 ? 2 : 0, (count / max) * chartH)
          const x = xPos(i)
          const y = yTop(count)
          const isHov = hovered === i
          return (
            <g key={i}>
              <rect
                x={x} y={y}
                width={barW} height={barH}
                rx="2"
                fill={isHov ? '#67e8f9' : '#22d3ee'}
                opacity={count === 0 ? 0.15 : isHov ? 1 : 0.75}
                style={{ transition: 'opacity 0.1s, fill 0.1s' }}
              />
              {/* Invisible wider hit target */}
              <rect
                x={x - 2} y={pt}
                width={barW + 4} height={chartH}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
              />
              {/* Count label above bar */}
              {count > 0 && (
                <text
                  x={x + barW / 2} y={y - 3}
                  textAnchor="middle" fontSize="9" fill="#22d3ee" opacity="0.9"
                >
                  {count}
                </text>
              )}
            </g>
          )
        })}

        {/* X axis labels — every 7 days */}
        {buckets.map((day, i) => {
          if (i % 7 !== 0) return null
          const x = xPos(i) + barW / 2
          return (
            <text key={i} x={x} y={vH - 2} textAnchor="middle" fontSize="9" fill="#4b5563">
              {day.slice(5)}
            </text>
          )
        })}

        {/* Axis baseline */}
        <line
          x1={pl} y1={pt + chartH} x2={vW - pr} y2={pt + chartH}
          stroke="#374151" strokeWidth="1"
        />
      </svg>

      {/* Tooltip */}
      {hovered !== null && (
        <div
          className="pointer-events-none absolute top-0 left-0 -translate-y-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs font-mono text-gray-200 whitespace-nowrap shadow"
          style={{
            left: `${((xPos(hovered) + barW / 2) / vW) * 100}%`,
            top: `${(yTop(counts[hovered]) / vH) * 100}%`,
            transform: 'translate(-50%, -110%)',
          }}
        >
          {buckets[hovered]}: <span className="text-cyan-400">{counts[hovered]}</span>
        </div>
      )}
    </div>
  )
}
