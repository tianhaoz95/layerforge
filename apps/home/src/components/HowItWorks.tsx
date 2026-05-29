interface Step {
  num: string
  title: string
  body: string
}

interface HowItWorksProps {
  lang: 'en' | 'zh'
}

export function HowItWorks({ lang }: HowItWorksProps) {
  const t = {
    en: {
      title: 'How it works',
    },
    zh: {
      title: '运作原理',
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

  return (
    <section id="how-it-works" className="border-t border-gray-800/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.title}</h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-[calc(2rem-1px)] top-8 bottom-8 hidden w-px bg-gradient-to-b from-cyan-500/40 via-gray-700 to-transparent lg:block" />

          <div className="space-y-10">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-6 lg:items-start animate-fadeIn">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/40 bg-gray-900 font-mono text-sm font-bold text-cyan-400">
                    {s.num}
                  </div>
                </div>
                <div className="pt-3">
                  <h3 className="mb-1 text-lg font-semibold text-gray-100">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

