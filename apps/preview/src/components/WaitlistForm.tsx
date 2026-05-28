import { useState, FormEvent } from 'react'

interface WaitlistEntry {
  name: string
  email: string
  submittedAt: string
}

const STORAGE_KEY = 'layerforge:waitlist'

// Phase 2: replace this function body with:
//   import { addDoc, collection } from 'firebase/firestore'
//   await addDoc(collection(db, 'waitlist'), entry)
function persistEntry(entry: WaitlistEntry): void {
  const existing: WaitlistEntry[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? '[]',
  )
  existing.push(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

export function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email.'); return }

    setLoading(true)
    try {
      // Simulate async operation (Firestore call in Phase 2)
      await new Promise((r) => setTimeout(r, 400))
      persistEntry({ name: name.trim(), email: email.trim().toLowerCase(), submittedAt: new Date().toISOString() })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-8 text-center">
        <div className="mb-3 text-3xl">🎉</div>
        <h2 className="text-xl font-bold text-white">You're on the list!</h2>
        <p className="mt-2 text-gray-400">
          We'll reach out to <span className="text-cyan-400">{email}</span> when
          early access opens.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          In the meantime, spread the word to other AI engineers.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-300">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
          disabled={loading}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ada@example.com"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
          disabled={loading}
          autoComplete="email"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-gray-950 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Joining…' : 'Join the Waitlist'}
      </button>
    </form>
  )
}
