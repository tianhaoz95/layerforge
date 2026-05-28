const STEPS = [
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
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-gray-800/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">How it works</h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-[calc(2rem-1px)] top-8 bottom-8 hidden w-px bg-gradient-to-b from-cyan-500/40 via-gray-700 to-transparent lg:block" />

          <div className="space-y-10">
            {STEPS.map((s) => (
              <div key={s.num} className="flex gap-6 lg:items-start">
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
