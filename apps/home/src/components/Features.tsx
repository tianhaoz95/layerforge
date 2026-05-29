interface Feature {
  icon: string
  title: string
  description: string
}

interface FeaturesProps {
  lang: 'en' | 'zh'
}

export function Features({ lang }: FeaturesProps) {
  const t = {
    en: {
      title: 'Master modern AI architecture',
      subtitle: 'at your own pace.',
    },
    zh: {
      title: '掌握现代 AI 架构',
      subtitle: '按您自己的节奏。',
    }
  }[lang]

  const features: Feature[] = {
    en: [
      {
        icon: '⚡',
        title: 'Code-First, Always',
        description:
          'No slides. No theory dumps. You open a challenge and write code immediately — implementing transformer layers, attention heads, and normalisation from scratch.',
      },
      {
        icon: '🧠',
        title: 'AI Hints On Demand',
        description:
          'When you hit a wall, one click surfaces a targeted hint from a Gemini-powered mentor. It never gives the full solution — just enough to unlock your thinking.',
      },
      {
        icon: '🐍',
        title: 'Python & Rust',
        description:
          'Master the ML standard library in Python, then push into systems-level AI infrastructure with Rust challenges. Both run in isolated sandboxes in under 2 seconds.',
      },
      {
        icon: '🏢',
        title: 'Enterprise Upskilling',
        description:
          'Turn your engineering team into AI architects. Per-seat licensing with admin dashboards, progress tracking, and configurable AI credit headroom.',
      },
    ],
    zh: [
      {
        icon: '⚡',
        title: '代码为先，拒绝纸上谈兵',
        description:
          '无需幻灯片或大篇幅理论。直接打开挑战并开始编写代码 —— 从零实现 Transformer 层、注意力头和归一化。',
      },
      {
        icon: '🧠',
        title: '按需获取 AI 提示',
        description:
          '每当遇到瓶颈，只需点击一下，即可唤醒由 Gemini 驱动的 AI 导师。它永远不会直接给出答案 —— 而是提供恰到好处的启发，引导您自主思考。',
      },
      {
        icon: '🐍',
        title: 'Python 与 Rust',
        description:
          '先使用 Python 掌握机器学习标准库，再通过 Rust 挑战深入探索系统级 AI 基础设施。两者均在隔离沙箱中运行，耗时不超过 2 秒。',
      },
      {
        icon: '🏢',
        title: '企业级技能提升',
        description:
          '将您的研发团队转化为 AI 架构师。提供按席位授权的管理后台、进度追踪，以及可配置的 AI 额度管理。',
      },
    ],
  }[lang]

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            {t.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors animate-fadeIn"
            >
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-gray-100">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

