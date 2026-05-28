interface Feature {
  icon: string
  title: string
  description: string
}

const FEATURES: Feature[] = [
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
]

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Master modern AI architecture
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            at your own pace.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors"
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
