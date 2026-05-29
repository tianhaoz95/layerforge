import { useState, useEffect } from 'react'

interface Step {
  num: string
  title: string
  body: string
}

interface HowItWorksProps {
  lang: 'en' | 'zh'
}

export function HowItWorks({ lang }: HowItWorksProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const t = {
    en: {
      title: 'How it works',
      moduleTitle: 'Module Arena Selection',
      locked: 'Locked (Level 2 required)',
      active: 'Active Module',
      completed: 'Completed',
      running: 'Running tests in container sandbox...',
      passed: 'All 3 tests passed!',
      time: 'Execution time: 142ms',
      editorTitle: 'normalization.py',
      sandboxTitle: 'Sandbox Console Output',
      mentorTitle: 'Socratic AI Mentor (Gemini)',
      credits: 'Credits remaining: 9/10',
    },
    zh: {
      title: '运作原理',
      moduleTitle: '模块竞技场选择',
      locked: '未解锁 (需要等级 2)',
      active: '进行中的模块',
      completed: '已通关',
      running: '正在隔离容器沙箱中运行测试套件...',
      passed: '所有 3 项测试均已通过！',
      time: '执行耗时: 142 毫秒',
      editorTitle: 'normalization.py',
      sandboxTitle: '沙箱终端输出',
      mentorTitle: '苏格拉底式 AI 导师 (Gemini)',
      credits: '剩余额度: 9/10 次',
    }
  }[lang]

  const steps: Step[] = {
    en: [
      {
        num: '01',
        title: 'Pick a challenge module',
        body: 'Choose from Transformer Layers, Attention Mechanisms, Agentic Frameworks, and more. Each module unlocks as you progress.',
      },
      {
        num: '02',
        title: 'Write the implementation',
        body: 'An in-browser editor pre-loaded with the function signature, docstring, and test harness. Your job: fill in the body.',
      },
      {
        num: '03',
        title: 'Submit against the sandbox',
        body: 'Your code runs against fixed dummy inputs in an isolated container. Results return in 1–2 seconds.',
      },
      {
        num: '04',
        title: 'Opt in for AI guidance',
        body: 'Failed a test case? The AI mentor sits behind a single button. Click it to get a Socratic hint — not a solution.',
      },
    ],
    zh: [
      {
        num: '01',
        title: '选择挑战模块',
        body: '从 Transformer 层、注意力机制、智能体框架等模块中进行选择。每个模块会随着您的通关而逐步解锁。',
      },
      {
        num: '02',
        title: '编写核心实现',
        body: '浏览器内编辑器已预装函数签名、文档字符串及测试套件。您的任务：填满函数体。',
      },
      {
        num: '03',
        title: '提交至沙箱运行',
        body: '您的代码将在隔离的容器沙箱中针对预设测试用例运行，并在 1–2 秒内返回真实执行结果。',
      },
      {
        num: '04',
        title: '按需获取 AI 指引',
        body: '测试用例未通过？AI 导师静静守候在求助按钮后。点击获取苏格拉底式的启发式提示，而非直接拷贝答案。',
      },
    ],
  }[lang]

  // Auto-advance timeline steps unless hovered
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % 4)
    }, 4200)
    return () => clearInterval(timer)
  }, [isHovered])

  return (
    <section id="how-it-works" className="border-t border-gray-800/60 py-24 bg-gray-950/20 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl tracking-tight">{t.title}</h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-12 items-center">
          {/* Left Column: Interactive Stepper (cols 1-6) */}
          <div className="lg:col-span-6 relative">
            
            {/* Timeline connector line */}
            <div className="absolute left-[calc(2rem-1px)] top-8 bottom-8 w-px bg-gradient-to-b from-cyan-500/40 via-gray-700 to-transparent" />

            {/* Sliding glowing indicator dot */}
            <div
              className="absolute left-[calc(2rem-5px)] w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] transition-all duration-500 ease-out z-10"
              style={{
                top: `${16 + activeIdx * 116}px` // Precise math matching step offsets
              }}
            />

            <div className="space-y-8">
              {steps.map((s, index) => {
                const isActive = index === activeIdx
                return (
                  <div
                    key={s.num}
                    onClick={() => {
                      setActiveIdx(index)
                      setIsHovered(true) // Pause autoplay
                    }}
                    onMouseEnter={() => {
                      setActiveIdx(index)
                      setIsHovered(true)
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex gap-6 items-start cursor-pointer group transition-all duration-300"
                  >
                    <div className="flex-shrink-0 z-20 relative">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full border font-mono text-sm font-bold transition-all duration-300 ${
                          isActive
                            ? 'border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-105'
                            : 'border-gray-800 bg-gray-900 text-gray-400 group-hover:border-cyan-500/40 group-hover:text-gray-300'
                        }`}
                      >
                        {s.num}
                      </div>
                    </div>
                    <div className={`pt-2 transition-all duration-300 ${isActive ? 'opacity-100 pl-2' : 'opacity-40 pl-0 group-hover:opacity-75'}`}>
                      <h3 className={`mb-1 text-lg font-semibold transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-100'}`}>
                        {s.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-md">{s.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Preview Screen (cols 7-12) */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-30 blur-xl" />
            
            <div className="relative rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl min-h-[360px] flex flex-col justify-between overflow-hidden">
              
              {/* Top window bar */}
              <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-4 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                  Live Preview
                </div>
              </div>

              {/* Dynamic Content Display based on activeIdx */}
              <div className="flex-1 flex flex-col justify-center">
                
                {/* ── STEP 01: Pick challenge ── */}
                {activeIdx === 0 && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="text-xs font-semibold text-gray-400 mb-1">{t.moduleTitle}</div>
                    
                    {/* Card 1: Completed */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 font-mono text-xs">
                      <span className="text-emerald-400 font-medium">1. Transformer Layers</span>
                      <span className="text-emerald-400 font-semibold">✓ {t.completed}</span>
                    </div>

                    {/* Card 2: Active */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-mono text-xs shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                      <span className="text-cyan-400 font-bold">2. Attention Mechanisms</span>
                      <span className="text-cyan-300 text-[10px] uppercase font-bold animate-pulse">{t.active}</span>
                    </div>

                    {/* Card 3: Locked */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-900 bg-gray-900/40 font-mono text-xs opacity-50">
                      <span className="text-gray-500">3. CUDA GPU Kernels</span>
                      <span className="text-gray-600 text-[10px]">{t.locked}</span>
                    </div>
                  </div>
                )}

                {/* ── STEP 02: Write implementation ── */}
                {activeIdx === 1 && (
                  <div className="font-mono text-[11px] leading-relaxed p-4 rounded-xl bg-gray-900/40 border border-gray-900 animate-fadeIn relative">
                    <div className="absolute top-2 right-3 text-[9px] text-gray-600 select-none">{t.editorTitle}</div>
                    
                    <div>
                      <span className="text-purple-400">def </span>
                      <span className="text-cyan-300">layer_norm</span>
                      <span className="text-gray-400">(x, gamma, beta, eps=</span>
                      <span className="text-orange-300">1e-5</span>
                      <span className="text-gray-400">):</span>
                    </div>
                    <div className="text-gray-500 pl-4">"""Layer normalization."""</div>
                    <div className="pl-4 text-gray-400">
                      mean = torch.mean(x, dim=-1, keepdim=<span className="text-orange-300">True</span>)
                    </div>
                    <div className="pl-4 text-gray-400">
                      var = torch.var(x, dim=-1, keepdim=<span className="text-orange-300">True</span>)
                    </div>
                    <div className="pl-4 text-cyan-400 font-bold bg-cyan-500/10 rounded px-1.5 py-0.5 my-1 inline-block animate-pulse">
                      # WRITE CODE HERE...
                    </div>
                    <div className="pl-4 text-gray-400">
                      <span className="text-purple-400">return </span>
                      gamma * (x - mean) / torch.sqrt(var + eps) + beta
                    </div>
                  </div>
                )}

                {/* ── STEP 03: Submit sandbox ── */}
                {activeIdx === 2 && (
                  <div className="space-y-4 animate-fadeIn font-mono">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">{t.sandboxTitle}</div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                        {t.running}
                      </div>
                      
                      <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5 animate-fadeIn">
                        <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span>✓</span> {t.passed}
                        </div>
                        <div className="text-[10px] text-gray-500">{t.time}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 04: Opt in AI guidance ── */}
                {activeIdx === 3 && (
                  <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 space-y-3 animate-fadeIn font-mono">
                    <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base select-none">💡</span>
                        {t.mentorTitle}
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{t.credits}</span>
                    </div>
                    
                    <p className="text-[11px] text-cyan-300 leading-relaxed">
                      "Are you using the Bessel correction when computing the variance? Remember, the LayerNorm paper specifies biased estimators. Try setting <code className="bg-cyan-950/60 border border-cyan-500/20 px-1 py-0.5 rounded text-white text-[10px]">unbiased=False</code> in PyTorch."
                    </p>
                  </div>
                )}

              </div>

              {/* Bottom footer status */}
              <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-gray-600 border-t border-gray-900 pt-4">
                <span>STATUS: STABLE</span>
                <span>STEP {activeIdx + 1}/4</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
