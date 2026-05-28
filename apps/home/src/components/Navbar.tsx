const WAITLIST_URL = 'http://localhost:5175'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-mono text-lg font-bold tracking-tight text-cyan-400">
          LayerForge
        </span>
        <nav className="hidden items-center gap-8 text-sm text-gray-400 sm:flex">
          <a href="#features" className="hover:text-gray-100 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-100 transition-colors">How it works</a>
        </nav>
        <a
          href={WAITLIST_URL}
          className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-cyan-400 transition-colors"
        >
          Join Waitlist
        </a>
      </div>
    </header>
  )
}
