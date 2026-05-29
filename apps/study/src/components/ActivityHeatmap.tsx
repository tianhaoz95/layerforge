import { useMemo } from 'react'

const CELL = 12
const GAP = 3
const WEEKS = 52
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function localDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function cellColor(count: number): string {
  if (count === 0) return '#1f2937'
  if (count === 1) return '#164e63'
  if (count === 2) return '#0e7490'
  if (count === 3) return '#0891b2'
  return '#22d3ee'
}

interface Props {
  activityLog: Record<string, number>
}

export function ActivityHeatmap({ activityLog }: Props) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const startDate = new Date(today)
    startDate.setDate(today.getDate() - today.getDay() - (WEEKS - 1) * 7)
    startDate.setHours(0, 0, 0, 0)

    const weeks: Array<Array<{ date: string; count: number } | null>> = []
    const monthLabels: Array<{ wi: number; label: string }> = []
    let lastMonth = -1

    for (let w = 0; w < WEEKS; w++) {
      const week: Array<{ date: string; count: number } | null> = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + w * 7 + d)
        if (date > today) {
          week.push(null)
        } else {
          const dateStr = localDateStr(date)
          week.push({ date: dateStr, count: activityLog[dateStr] ?? 0 })
        }
      }

      const firstCell = week.find(c => c !== null)
      if (firstCell) {
        const month = new Date(firstCell.date + 'T00:00:00').getMonth()
        if (month !== lastMonth) {
          monthLabels.push({ wi: w, label: MONTH_NAMES[month] })
          lastMonth = month
        }
      }
      weeks.push(week)
    }

    return { weeks, monthLabels }
  }, [activityLog])

  const gridH = 7 * CELL + 6 * GAP
  const totalW = WEEKS * CELL + (WEEKS - 1) * GAP
  const svgH = 16 + GAP + gridH + GAP + 16

  return (
    <div>
      <svg viewBox={`0 0 ${totalW} ${svgH}`} width="100%" style={{ display: 'block' }}>
        {monthLabels.map(({ wi, label }) => (
          <text
            key={wi}
            x={wi * (CELL + GAP)}
            y={11}
            fill="#6b7280"
            fontSize={10}
            fontFamily="ui-monospace, monospace"
          >
            {label}
          </text>
        ))}

        {weeks.map((week, wi) =>
          week.map((day, di) =>
            day === null ? null : (
              <rect
                key={`${wi}-${di}`}
                x={wi * (CELL + GAP)}
                y={16 + GAP + di * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                fill={cellColor(day.count)}
              >
                <title>
                  {day.date}: {day.count} submission{day.count !== 1 ? 's' : ''}
                </title>
              </rect>
            )
          )
        )}

        <text x={0} y={svgH - 3} fill="#6b7280" fontSize={10} fontFamily="ui-monospace, monospace">
          Less
        </text>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <rect
            key={lvl}
            x={32 + lvl * (CELL + GAP)}
            y={svgH - 14}
            width={CELL}
            height={CELL}
            rx={2}
            fill={cellColor(lvl)}
          />
        ))}
        <text
          x={32 + 5 * (CELL + GAP)}
          y={svgH - 3}
          fill="#6b7280"
          fontSize={10}
          fontFamily="ui-monospace, monospace"
        >
          More
        </text>
      </svg>
    </div>
  )
}
