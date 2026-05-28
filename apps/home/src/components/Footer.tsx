export function Footer() {
  return (
    <footer className="border-t border-gray-800/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <span className="font-mono text-sm font-bold text-cyan-400">LayerForge</span>
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} LayerForge. All rights reserved.
        </p>
        <p className="text-xs text-gray-700 italic">"Bridge the AI experience gap."</p>
      </div>
    </footer>
  )
}
