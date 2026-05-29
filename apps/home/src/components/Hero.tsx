import { useState } from 'react'

const WAITLIST_URL = 'http://localhost:5175'

const CODE_SNIPPET = `def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / math.sqrt(d_k)
    weights = softmax(scores, axis=-1)
    # YOUR IMPLEMENTATION HERE
    pass`

interface HeroProps {
  lang: 'en' | 'zh'
}

export function Hero({ lang }: HeroProps) {
  const [showHint, setShowHint] = useState(false)
  const t = {
    en: {
      badge: 'Early Access — Waitlist Open',
      title1: 'Build AI Architecture.',
      title2: 'From First Principles.',
      subtitle: 'Stop watching slide decks. LayerForge drops you into a code editor immediately — building transformer layers, attention mechanisms, and agentic frameworks from scratch.',
      stuck: 'Stuck? An AI mentor is one click away — but only when you ask for it.',
      stuckAsk: 'you',
      joinWaitlist: 'Join the Waitlist',
      seeHow: 'See how it works',
      footerLine: 'Bridge the AI experience gap.',
      aiCanHelp: 'AI can help →',
      hideAiHint: 'Hide AI Hint',
      socraticHintTitle: 'Socratic Hint (Gemini AI):',
      socraticHintBody: 'Take a look at the magnitude of your scores. When the head size d_k grows large, the dot products can grow extremely large. What happens when you pass very large values into the softmax function, and what scaling factor did Vaswani et al. introduce to counter this?',
    },
    zh: {
      badge: '抢先体验 — 等候名单已开启',
      title1: '构建 AI 核心架构。',
      title2: '从第一原理开始。',
      subtitle: '告别枯燥的 PPT。LayerForge 让您直接进入代码编辑器 —— 从零实现 Transformer 层、注意力机制和智能体框架。',
      stuck: '卡住了？AI 导师近在咫尺 —— 但只有在您主动要求时才会提供帮助。',
      stuckAsk: '您',
      joinWaitlist: '加入等候名单',
      seeHow: '查看运作原理',
      footerLine: '跨越 AI 实践红利与应用鸿沟。',
      aiCanHelp: 'AI 导师求助 →',
      hideAiHint: '隐藏 AI 提示',
      socraticHintTitle: '苏格拉底式提示 (Gemini AI):',
      socraticHintBody: '请关注您的 scores 的数值大小。当注意力头维度 d_k 变大时，点积结果可能会变得极大。当您将极大的数值传入 softmax 函数时会发生什么？Vaswani 等人在论文中引入了什么缩放因子来解决这一问题？',
    }
  }[lang]

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: Copy */}
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {t.badge}
            </span>

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.title1}{' '}
              <span className="text-cyan-400">{t.title2}</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-400">
              {t.subtitle}
            </p>

            <p className="mt-3 text-base text-gray-500">
              {lang === 'en' ? (
                <>
                  Stuck? An AI mentor is one click away — but only when{' '}
                  <em className="text-gray-400">you</em> ask for it.
                </>
              ) : (
                <>
                  卡住了？AI 导师近在咫尺 —— 但只有在{' '}
                  <em className="text-gray-400">您</em> 主动要求时才会提供帮助。
                </>
              )}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={WAITLIST_URL}
                className="rounded-md bg-cyan-500 px-6 py-3 font-semibold text-gray-950 hover:bg-cyan-400 transition-colors"
              >
                {t.joinWaitlist}
              </a>
              <a
                href="#how-it-works"
                className="rounded-md border border-gray-700 px-6 py-3 font-semibold text-gray-300 hover:border-gray-500 hover:text-gray-100 transition-colors"
              >
                {t.seeHow}
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              {t.footerLine}
            </p>
          </div>

          {/* Right: Code preview */}
          <div className="relative">
            {/* Soft decorative background glow behind the editor */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 opacity-30 blur-lg" />
            
            <div className="relative rounded-xl border border-gray-800 bg-gray-950 shadow-2xl shadow-cyan-500/5 overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-gray-800/80 bg-gray-900/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/60" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <span className="h-3 w-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-gray-400 font-mono">attention.py</span>
                </div>
                <div className="text-[10px] font-mono text-gray-500 select-none">
                  workspace/study
                </div>
              </div>

              {/* Editor Workspace */}
              <pre className="overflow-x-auto p-6 text-sm font-mono leading-relaxed bg-gray-950/40">
                <code className="text-gray-300">
                  <span className="text-purple-400">def </span>
                  <span className="text-cyan-300">scaled_dot_product_attention</span>
                  <span className="text-gray-300">(Q, K, V):</span>
                  {'\n'}
                  <span className="text-gray-500">    """Scaled dot-product attention."""</span>
                  {'\n'}
                  <span className="text-gray-300">    scores = Q </span>
                  <span className="text-cyan-400">@</span>
                  <span className="text-gray-300"> K.T</span>
                  {'\n'}
                  <span className="text-gray-300">    weights = softmax(scores, axis=</span>
                  <span className="text-orange-300">-1</span>
                  <span className="text-gray-300">)</span>
                  {'\n'}
                  <span className="text-purple-400">    return </span>
                  <span className="text-gray-300">weights </span>
                  <span className="text-cyan-400">@</span>
                  <span className="text-gray-300"> V</span>
                </code>
              </pre>

              {/* Integrated Interactive Terminal Pane */}
              <div className="border-t border-gray-800 bg-gray-900/60 p-4 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-red-500 font-semibold select-none">✗</span>
                    <div>
                      <span className="text-red-400 font-medium">AssertionError:</span>
                      <span className="text-gray-400 ml-1.5">
                        {lang === 'en' 
                          ? 'Max difference 0.3421 exceeds tolerance 1e-05 (variance too high)' 
                          : '最大误差 0.3421 超过容差 1e-05 (方差过大)'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center self-end sm:self-center shrink-0">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-400 font-medium hover:bg-cyan-500/20 hover:border-cyan-400 transition-all whitespace-nowrap"
                    >
                      {showHint ? t.hideAiHint : t.aiCanHelp}
                    </button>
                  </div>
                </div>

                {/* Socratic Hint Panel */}
                {showHint && (
                  <div className="mt-3 border-t border-cyan-500/20 pt-3 text-[11px] leading-relaxed text-cyan-300 animate-fadeIn">
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 text-sm select-none">💡</span>
                      <div>
                        <span className="font-semibold text-cyan-400 font-sans uppercase tracking-wider text-[8px] block mb-1">
                          {t.socraticHintTitle}
                        </span>
                        {lang === 'en' ? (
                          <>
                            "Take a look at the magnitude of your <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">scores</code>. When the head size <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">d_k</code> grows large, the dot products can grow extremely large. What happens when you pass very large values into the <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">softmax</code> function, and what scaling factor did Vaswani et al. introduce to counter this?"
                          </>
                        ) : (
                          <>
                            "请关注您的 <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">scores</code> 的数值大小。当注意力头维度 <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">d_k</code> 变大时，点积结果可能会变得极大。当您将极大的数值传入 <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white font-mono">softmax</code> 函数时会发生什么？Vaswani 等人在论文中引入了什么缩放因子来解决这一问题？"
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


// silence unused import warning — snippet is rendered as JSX, not used as a var
void CODE_SNIPPET
