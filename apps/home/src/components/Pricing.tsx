interface PricingProps {
  lang: 'en' | 'zh'
}

const STUDY_URL = import.meta.env.VITE_STUDY_URL ?? 'https://layerforge-study.web.app'

export function Pricing({ lang }: PricingProps) {
  const t = {
    en: {
      title: 'Simple, transparent pricing',
      subtitle: 'Start with a 7-day free trial. Card required — but you\'re only charged after the trial ends.',
      monthly: 'Monthly',
      annual: 'Annual',
      save: 'Save 28%',
      perMonth: '/ mo',
      perYear: '/ yr',
      effective: '~$20.75 / mo',
      trialCta: 'Start free trial',
      features: [
        'All Python & Rust challenges',
        'Opt-in AI Socratic hints',
        'Activity tracking & progress',
        'New challenges every month',
      ],
      guarantee: '7-day free trial · Cancel any time',
      note: 'You won\'t be charged until your trial ends.',
    },
    zh: {
      title: '简单透明的价格',
      subtitle: '免费试用 7 天，需提供信用卡，试用期结束后才开始计费。',
      monthly: '按月订阅',
      annual: '按年订阅',
      save: '节省 28%',
      perMonth: '/ 月',
      perYear: '/ 年',
      effective: '折合约 ¥149 / 月',
      trialCta: '开始免费试用',
      features: [
        '全部 Python & Rust 挑战',
        '按需 AI 苏格拉底式提示',
        '活动追踪与进度记录',
        '每月新增挑战',
      ],
      guarantee: '7 天免费试用 · 随时取消',
      note: '试用期结束前不会扣款。',
    },
  }[lang]

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.title}</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* Monthly */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 flex flex-col gap-6">
            <div>
              <p className="text-sm font-mono text-gray-400">{t.monthly}</p>
              <p className="mt-2 text-5xl font-bold text-white">
                $29<span className="text-xl font-normal text-gray-500">{t.perMonth}</span>
              </p>
            </div>
            <ul className="space-y-3 text-sm text-gray-400 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href={STUDY_URL}
              className="block text-center rounded-lg border border-gray-700 bg-gray-800 py-3 text-sm font-semibold text-gray-100 hover:bg-gray-700 transition-colors"
            >
              {t.trialCta}
            </a>
          </div>

          {/* Annual — highlighted */}
          <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/5 p-8 flex flex-col gap-6 relative">
            <div className="absolute -top-3 right-6">
              <span className="text-xs font-mono font-semibold text-cyan-400 border border-cyan-500/40 bg-gray-950 rounded-full px-3 py-1">
                {t.save}
              </span>
            </div>
            <div>
              <p className="text-sm font-mono text-gray-400">{t.annual}</p>
              <p className="mt-2 text-5xl font-bold text-white">
                $249<span className="text-xl font-normal text-gray-500">{t.perYear}</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">{t.effective}</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-400 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href={STUDY_URL}
              className="block text-center rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-gray-950 hover:bg-cyan-400 transition-colors"
            >
              {t.trialCta}
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">{t.guarantee}</p>
        <p className="mt-1 text-center text-xs text-gray-700">{t.note}</p>
      </div>
    </section>
  )
}
