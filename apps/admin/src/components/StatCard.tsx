interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  accent?: 'cyan' | 'purple' | 'emerald'
}

const accentMap = {
  cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
  purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
  emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
}

export function StatCard({ label, value, sub, accent = 'cyan' }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${accentMap[accent]}`}>
      <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`mt-2 text-3xl font-bold font-mono ${accent === 'cyan' ? 'text-cyan-400' : accent === 'purple' ? 'text-purple-400' : 'text-emerald-400'}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-600">{sub}</p>}
    </div>
  )
}
