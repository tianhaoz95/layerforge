import { Link } from 'react-router-dom'
import type { Challenge } from '../types/challenge'

const DIFFICULTY_CLS = {
  beginner:     'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  intermediate: 'text-amber-400   bg-amber-400/10   border-amber-400/20',
  advanced:     'text-red-400     bg-red-400/10     border-red-400/20',
} as const

const LANG_CLS = {
  python: 'text-blue-400  bg-blue-400/10  border-blue-400/20',
  rust:   'text-orange-400 bg-orange-400/10 border-orange-400/20',
} as const

interface Props {
  challenge: Challenge
  completed: boolean
  lang?: 'en' | 'zh'
}

export function ChallengeCard({ challenge, completed, lang = 'en' }: Props) {
  const diffLabel = {
    en: {
      beginner: 'beginner',
      intermediate: 'intermediate',
      advanced: 'advanced',
    },
    zh: {
      beginner: '初级',
      intermediate: '中级',
      advanced: '高级',
    }
  }[lang][challenge.difficulty]

  return (
    <Link
      to={`/challenge/${challenge.id}`}
      className="group flex flex-col justify-between rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-cyan-500/40 hover:bg-gray-900/80 transition-colors"
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-100 leading-snug group-hover:text-white transition-colors">
            {challenge.title}
          </h3>
          {completed && (
            <span className="flex-shrink-0 text-emerald-400 text-lg" title="Completed">✓</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_CLS[challenge.difficulty]}`}>
          {diffLabel}
        </span>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${LANG_CLS[challenge.language]}`}>
          {challenge.language}
        </span>
      </div>
    </Link>
  )
}

