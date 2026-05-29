import { useState, useEffect } from 'react'

interface Props {
  hint: string
  lang?: 'en' | 'zh'
}

export function HintPanel({ hint, lang = 'en' }: Props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  const t = {
    en: {
      mentorHint: 'AI Mentor Hint',
      phaseStatic: 'Phase 1 — static',
      generating: 'Generating hint…',
    },
    zh: {
      mentorHint: 'AI 导师提示',
      phaseStatic: '第一阶段 — 静态',
      generating: '正在生成提示…',
    }
  }[lang]

  // Simulate async hint fetch (Phase 3: replace with Cloud Function call)
  useEffect(() => {
    setLoading(true)
    setVisible(false)
    const timer = setTimeout(() => {
      setLoading(false)
      setVisible(true)
    }, 900)
    return () => clearTimeout(timer)
  }, [hint])

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-400">
        <span className="text-base">💡</span>
        {t.mentorHint}
        {/* Phase 3: replace tag below with model name from HintResponse */}
        <span className="ml-auto rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-500 font-mono">
          {t.phaseStatic}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          {t.generating}
        </div>
      ) : visible ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{hint}</p>
      ) : null}
    </div>
  )
}

