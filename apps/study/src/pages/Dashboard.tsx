import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { challenges } from '../data/challenges'
import { ChallengeCard } from '../components/ChallengeCard'
import { useProgress } from '../hooks/useProgress'
import { useAuth } from '../contexts/AuthContext'
import { getChallengeWithI18n } from '../data/translations'

export function Dashboard() {
  const { progress } = useProgress()
  const { user, loading } = useAuth()

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

  const t = {
    en: {
      completed: 'completed',
      done: 'done',
      signOut: 'Sign out',
      signIn: 'Sign in with Google',
      arena: 'Challenge Arena',
      arenaSub: 'Build AI components from scratch. No shortcuts.',
      overallProgress: 'Overall Progress',
      completedLabel: 'completed',
      inProgress: 'in progress',
      remaining: 'remaining',
    },
    zh: {
      completed: '已完成',
      done: '已完成',
      signOut: '退出登录',
      signIn: '使用 Google 登录',
      arena: '挑战竞技场',
      arenaSub: '从零开始构建 AI 组件。没有捷径。',
      overallProgress: '整体进度',
      completedLabel: '已完成',
      inProgress: '进行中',
      remaining: '未开始',
    }
  }[lang]

  const translatedChallenges = challenges.map((c) => getChallengeWithI18n(c, lang))
  const modules = [...new Set(translatedChallenges.map((c) => c.module))]
  const completedCount = Object.values(progress).filter((p) => p.completed).length

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-mono text-lg font-bold text-cyan-400">LayerForge</span>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {completedCount}/{translatedChallenges.length} {t.completed}
            </span>

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

            {!loading && user && (
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? 'User'}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">
                    {user.displayName?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                )}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{t.arena}</h1>
          <p className="mt-2 text-gray-400">{t.arenaSub}</p>
        </div>

        {/* Progress overview */}
        <div className="mb-10 rounded-lg border border-gray-800 bg-gray-900/60 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">{t.overallProgress}</span>
            <span className="font-mono text-sm text-gray-500">
              {completedCount}/{translatedChallenges.length} {t.completed}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-700"
              style={{ width: `${Math.round((completedCount / translatedChallenges.length) * 100)}%` }}
            />
          </div>
          <div className="mt-3 flex gap-6 text-xs text-gray-600">
            <span><span className="text-emerald-500">{completedCount}</span> {t.completedLabel}</span>
            <span>
              <span className="text-amber-500">
                {Object.values(progress).filter((p) => !p.completed && p.attempts > 0).length}
              </span>{' '}
              {t.inProgress}
            </span>
            <span>
              <span className="text-gray-500">{translatedChallenges.length - completedCount}</span>{' '}
              {t.remaining}
            </span>
          </div>
        </div>

        {modules.map((mod) => {
          const modChallenges = translatedChallenges.filter((c) => c.module === mod)
          const modCompleted = modChallenges.filter((c) => progress[c.id]?.completed).length
          return (
            <section key={mod} className="mb-12">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <h2 className="text-lg font-semibold text-gray-200">{mod}</h2>
                <span className="text-sm text-gray-600">
                  {modCompleted}/{modChallenges.length} {t.done}
                </span>
                <div className="ml-auto h-1.5 w-16 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full bg-cyan-500/60 transition-all duration-500"
                    style={{ width: `${(modCompleted / modChallenges.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modChallenges.map((c) => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    completed={progress[c.id]?.completed ?? false}
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}

