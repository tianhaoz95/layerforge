import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { challenges } from '../data/challenges'
import { runCode } from '../services/sandbox'
import { useProgress } from '../hooks/useProgress'
import { ResultPanel } from '../components/ResultPanel'
import { HintPanel } from '../components/HintPanel'
import { DescriptionRenderer } from '../components/DescriptionRenderer'
import type { ExecutionResult, SubmissionStatus } from '../types/challenge'
import { getChallengeWithI18n } from '../data/translations'

const DIFFICULTY_CLS = {
  beginner:     'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  intermediate: 'text-amber-400   bg-amber-400/10   border-amber-400/20',
  advanced:     'text-red-400     bg-red-400/10     border-red-400/20',
} as const

export function ChallengePage() {
  const { id } = useParams<{ id: string }>()

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('lf-theme') as 'dark' | 'light') || 'dark'
  })
  const [lang, setLang] = useState<'en' | 'zh'>(() => {
    return (localStorage.getItem('lf-lang') as 'en' | 'zh') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('lf-theme', theme)
    if (theme === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('lf-lang', lang)
  }, [lang])

  const challengeBase = challenges.find((c) => c.id === id)
  const challenge = challengeBase ? getChallengeWithI18n(challengeBase, lang) : undefined

  const { progress, markComplete, incrementAttempt } = useProgress()
  const isCompleted = progress[id ?? '']?.completed ?? false

  const [code, setCode] = useState(challenge?.starterCode ?? '')
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [showHint, setShowHint] = useState(false)

  // Sync code state if challenge changes or loads
  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode)
    }
  }, [id])

  const t = {
    en: {
      completed: 'Completed',
      hintsRemaining: 'hints remaining',
      reset: 'Reset to starter',
      reveal: 'Reveal Answer',
      submit: 'Submit',
      running: 'Running…',
      notFound: 'Challenge not found',
      back: '← Back to Dashboard',
      beginner: 'beginner',
      intermediate: 'intermediate',
      advanced: 'advanced',
    },
    zh: {
      completed: '已完成',
      hintsRemaining: '次剩余提示',
      reset: '重置代码',
      reveal: '显示答案',
      submit: '提交运行',
      running: '运行中…',
      notFound: '未找到该挑战',
      back: '← 返回主面板',
      beginner: '初级',
      intermediate: '中级',
      advanced: '高级',
    }
  }[lang]

  if (!challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600 mb-3">{t.notFound}</p>
          <Link to="/" className="text-cyan-400 hover:underline text-sm">{t.back}</Link>
        </div>
      </div>
    )
  }

  const diffLabels: Record<'en' | 'zh', Record<'beginner' | 'intermediate' | 'advanced', string>> = {
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
  }
  const diffLabel = diffLabels[lang][challenge.difficulty]

  const handleSubmit = async () => {
    setStatus('running')
    setResult(null)
    setShowHint(false)

    try {
      const res = await runCode(code, challenge.language)
      setResult(res)

      if (res.success) {
        setStatus('passed')
        if (!isCompleted) markComplete(challenge.id)
      } else {
        setStatus('failed')
        incrementAttempt(challenge.id)
      }
    } catch (err) {
      setStatus('error')
      setResult({
        success: false,
        output: '',
        errors: err instanceof Error ? err.message : 'Connection to sandbox failed',
        executionTimeMs: 0,
      })
    }
  }

  const handleReset = () => {
    setCode(challenge.starterCode)
    setStatus('idle')
    setResult(null)
    setShowHint(false)
  }

  const handleRevealAnswer = () => {
    if (challenge.solutionCode) {
      setCode(challenge.solutionCode)
      setStatus('idle')
      setResult(null)
      setShowHint(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-gray-100 overflow-hidden transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Link to="/" className="font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              LayerForge
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-500">{challenge.module}</span>
            <span className="text-gray-700">/</span>
            <span className="text-gray-200 font-medium">{challenge.title}</span>
          </div>

          <div className="flex items-center gap-4">
            {isCompleted && (
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                ✓ {t.completed}
              </span>
            )}
            {/* Phase 2: replace with real credit count from Firestore */}
            <span className="text-xs text-gray-600 hidden sm:inline">10/10 {t.hintsRemaining}</span>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
              className="text-xs font-semibold px-2 py-1 rounded bg-gray-900 border border-gray-800 hover:border-cyan-500/50 transition-colors font-mono text-cyan-400"
            >
              {lang === 'en' ? '中文' : 'EN'}
            </button>
            
            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(th => th === 'dark' ? 'light' : 'dark')}
              className="text-xs px-2 py-1.5 rounded bg-gray-900 border border-gray-800 hover:border-cyan-500/50 transition-colors"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left pane: problem description */}
        <div className="w-full border-b border-gray-800 bg-gray-900/40 lg:w-[38%] lg:border-b-0 lg:border-r lg:overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <h1 className="mb-4 text-xl font-bold text-white">{challenge.title}</h1>

            {/* Metadata badges */}
            <div className="mb-5 flex flex-wrap gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_CLS[challenge.difficulty as 'beginner' | 'intermediate' | 'advanced']}`}>
                {diffLabel}
              </span>
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                {challenge.language}
              </span>
              {challenge.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="rounded-full border border-gray-700 bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400">
                  {tag}
                </span>
              ))}
            </div>

            {/* Visualization (optional, challenge-specific) */}
            {challenge.visualization && React.createElement(challenge.visualization)}

            {/* Description */}
            <div className="prose prose-sm prose-invert max-w-none">
              <DescriptionRenderer description={challenge.description} />
            </div>
          </div>
        </div>

        {/* Right pane: editor + results */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={challenge.language === 'python' ? 'python' : 'rust'}
              value={code}
              onChange={(v) => setCode(v ?? '')}
              theme={theme === 'light' ? 'vs' : 'vs-dark'}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'off',
                padding: { top: 16, bottom: 16 },
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            />
          </div>

          {/* Editor toolbar */}
          <div className="flex items-center justify-between border-t border-gray-800 bg-gray-900 px-5 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                {t.reset}
              </button>

              {challenge.solutionCode && (
                <>
                  <span className="text-gray-700">|</span>
                  <button
                    onClick={handleRevealAnswer}
                    className="text-sm text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
                  >
                    {t.reveal}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === 'running'}
              className="rounded-md bg-cyan-500 px-5 py-2 text-sm font-semibold text-gray-950 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'running' ? t.running : t.submit}
            </button>
          </div>

          {/* Results + Hint */}
          {status !== 'idle' && (
            <div className="border-t border-gray-800 bg-gray-950 p-5 space-y-4 overflow-y-auto max-h-72 custom-scrollbar">
              <ResultPanel
                status={status}
                result={result}
                onGetHint={() => setShowHint(true)}
                lang={lang}
              />
              {showHint && <HintPanel hint={challenge.staticHint} lang={lang} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
