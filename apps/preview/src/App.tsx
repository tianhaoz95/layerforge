import { useState, useEffect } from 'react'
import { WaitlistForm } from './components/WaitlistForm'
import { EditorMockup } from './components/EditorMockup'
import { VisualPlayground } from './components/VisualPlayground'

export default function App() {
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
      title1: 'Be first to master',
      title2: 'AI architecture',
      subtitle: 'LayerForge is launching soon. Join the waitlist for early access to the code-first ML engineering platform where you build modern attention mechanisms, transformer layers, and GPU kernels from first principles.',
      built: 'Built for AI Engineers',
      challenges: 'Python & Rust challenges',
      simulator: 'In-Browser GPU Simulator',
      noSpam: 'No spam, ever. Unsubscribe at any time.',
      dynamicMockup: '✨ Dynamic Socratic AI Hint Mockup',
      ropeMockup: '🪐 Interactive RoPE Phasor Rotation Simulator',
    },
    zh: {
      title1: '抢先一步掌握',
      title2: 'AI 核心架构',
      subtitle: 'LayerForge 即将上线。加入等候名单以尽早体验这个以代码为核心的 ML 工程平台。在这里，您将从第一原理开始构建现代注意力机制、Transformer 层和 GPU 内核。',
      built: '为 AI 工程师打造',
      challenges: 'Python 与 Rust 挑战',
      simulator: '浏览器内 GPU 模拟器',
      noSpam: '绝无垃圾邮件。您可以随时取消订阅。',
      dynamicMockup: '✨ 动态苏格拉底式 AI 提示演示',
      ropeMockup: '🪐 交互式 RoPE 相位旋转模拟器',
    }
  }[lang]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center py-16 px-6 lg:px-12 relative overflow-hidden">
      {/* Top Header with Switchers */}
      <div className="absolute top-4 right-6 flex items-center gap-4 z-50">
        {/* Language Switcher */}
        <button
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          className="text-xs font-semibold px-2 py-1 rounded bg-gray-900 border border-gray-800 hover:border-cyan-500/50 transition-colors font-mono text-cyan-400"
        >
          {lang === 'en' ? '中文' : 'EN'}
        </button>
        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          className="text-xs px-2 py-1.5 rounded bg-gray-900 border border-gray-800 hover:border-cyan-500/50 transition-colors"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Glow effects */}
      <div className="pointer-events-none absolute top-10 left-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]" />

      <div className="mx-auto max-w-6xl w-full grid gap-16 lg:grid-cols-12 items-center">
        {/* Left Column: Waitlist Signup Form (cols 1-5) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {/* Logo */}
          <a href="http://localhost:5174" className="self-start mb-10 font-mono text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
            LayerForge
          </a>

          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl leading-tight">
              {t.title1}<br />
              <span className="text-cyan-400">{t.title2}</span>
            </h1>
            <p className="mt-4 text-base text-gray-400 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-8 bg-gray-900/40 p-6 rounded-xl border border-gray-800/80 shadow-xl">
            <WaitlistForm lang={lang} />
          </div>

          {/* Social proof list */}
          <div className="mt-10 flex flex-wrap gap-4 text-xs font-mono text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400">✓</span> {t.built}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-purple-400">✓</span> {t.challenges}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400">✓</span> {t.simulator}
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer Showcase (cols 6-12) */}
        <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
          {/* Editor/AI Help Visualizer */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 font-sans">
              {t.dynamicMockup}
            </div>
            <EditorMockup />
          </div>

          {/* RoPE Rotation Playground */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 font-sans">
              {t.ropeMockup}
            </div>
            <VisualPlayground />
          </div>
        </div>

      </div>
    </div>
  )
}
