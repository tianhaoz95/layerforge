import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { VisualPlayground } from './components/VisualPlayground'
import { HowItWorks } from './components/HowItWorks'
import { Footer } from './components/Footer'

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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 transition-colors duration-200">
      <Navbar theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <HowItWorks lang={lang} />
        <VisualPlayground lang={lang} />
        <Features lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  )
}

