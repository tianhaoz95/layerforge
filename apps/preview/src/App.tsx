import { WaitlistForm } from './components/WaitlistForm'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 py-16 text-gray-100">
      {/* Logo */}
      <a href="http://localhost:5174" className="mb-12 font-mono text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
        LayerForge
      </a>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Be first to master<br />
            <span className="text-cyan-400">AI architecture</span>
          </h1>
          <p className="mt-4 text-gray-400 leading-relaxed">
            LayerForge is launching soon. Join the waitlist for early access to
            the code-first ML engineering platform.
          </p>
        </div>

        <WaitlistForm />

        <p className="mt-8 text-center text-xs text-gray-600">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>

      {/* Social proof hint */}
      <div className="mt-16 flex items-center gap-6 text-sm text-gray-600">
        <span>Built for AI engineers</span>
        <span className="h-1 w-1 rounded-full bg-gray-700" />
        <span>Python &amp; Rust challenges</span>
        <span className="h-1 w-1 rounded-full bg-gray-700" />
        <span>Free tier available</span>
      </div>
    </div>
  )
}
