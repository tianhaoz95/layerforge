const WAITLIST_URL = 'http://localhost:5175'

interface NavbarProps {
  theme: 'dark' | 'light'
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>
  lang: 'en' | 'zh'
  setLang: React.Dispatch<React.SetStateAction<'en' | 'zh'>>
}

export function Navbar({ theme, setTheme, lang, setLang }: NavbarProps) {
  const t = {
    en: {
      features: 'Features',
      howItWorks: 'How it works',
      joinWaitlist: 'Join Waitlist',
    },
    zh: {
      features: '核心功能',
      howItWorks: '运作原理',
      joinWaitlist: '加入等候名单',
    }
  }[lang]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-mono text-lg font-bold tracking-tight text-cyan-400">
          LayerForge
        </span>
        <nav className="hidden items-center gap-8 text-sm text-gray-400 sm:flex">
          <a href="#features" className="hover:text-gray-100 transition-colors">{t.features}</a>
          <a href="#how-it-works" className="hover:text-gray-100 transition-colors">{t.howItWorks}</a>
        </nav>
        
        <div className="flex items-center gap-4">
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

          <a
            href={WAITLIST_URL}
            className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-cyan-400 transition-colors whitespace-nowrap"
          >
            {t.joinWaitlist}
          </a>
        </div>
      </div>
    </header>
  )
}

