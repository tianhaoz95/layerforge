interface FooterProps {
  lang: 'en' | 'zh'
}

export function Footer({ lang }: FooterProps) {
  const t = {
    en: {
      rights: 'All rights reserved.',
      quote: '"Bridge the AI experience gap."',
    },
    zh: {
      rights: '保留所有权利。',
      quote: '“跨越 AI 实践红利与应用鸿沟。”',
    }
  }[lang]

  return (
    <footer className="border-t border-gray-800/60 py-10 bg-gray-950/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <span className="font-mono text-sm font-bold text-cyan-400">LayerForge</span>
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} LayerForge. {t.rights}
        </p>
        <p className="text-xs text-gray-700 italic">{t.quote}</p>
      </div>
    </footer>
  )
}

