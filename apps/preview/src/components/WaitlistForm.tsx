import { useState, FormEvent } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

interface WaitlistEntry {
  name: string
  email: string
  submittedAt: string
}

async function persistEntry(entry: WaitlistEntry): Promise<void> {
  await addDoc(collection(db, 'waitlist'), entry)
}

interface WaitlistFormProps {
  lang?: 'en' | 'zh'
}

export function WaitlistForm({ lang = 'en' }: WaitlistFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = {
    en: {
      nameLabel: 'Name',
      namePlaceholder: 'Ada Lovelace',
      emailLabel: 'Email',
      emailPlaceholder: 'ada@example.com',
      buttonJoin: 'Join the Waitlist',
      buttonJoining: 'Joining...',
      successTitle: "You're on the list!",
      successText1: "We'll reach out to ",
      successText2: " when early access opens.",
      successSub: "In the meantime, spread the word to other AI engineers.",
      errName: 'Please enter your name.',
      errEmail: 'Please enter a valid email.',
      errGeneral: 'Something went wrong. Please try again.',
    },
    zh: {
      nameLabel: '姓名',
      namePlaceholder: '输入您的姓名',
      emailLabel: '电子邮箱',
      emailPlaceholder: '输入您的电子邮箱',
      buttonJoin: '加入等候名单',
      buttonJoining: '申请中...',
      successTitle: '您已成功加入名单！',
      successText1: '当早鸟体验开启时，我们将联系 ',
      successText2: '。',
      successSub: '在此期间，欢迎向其他 AI 工程师分享 LayerForge。',
      errName: '请输入您的姓名。',
      errEmail: '请输入有效的电子邮箱。',
      errGeneral: '发生了一些错误，请重试。',
    }
  }[lang]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError(t.errName); return }
    if (!email.trim() || !email.includes('@')) { setError(t.errEmail); return }

    setLoading(true)
    try {
      // Simulate async operation (Firestore call in Phase 2)
      await new Promise((r) => setTimeout(r, 400))
      persistEntry({ name: name.trim(), email: email.trim().toLowerCase(), submittedAt: new Date().toISOString() })
      setSubmitted(true)
    } catch {
      setError(t.errGeneral)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-8 text-center">
        <div className="mb-3 text-3xl">🎉</div>
        <h2 className="text-xl font-bold text-white">{t.successTitle}</h2>
        <p className="mt-2 text-gray-400">
          {t.successText1}<span className="text-cyan-400">{email}</span>{t.successText2}
        </p>
        <p className="mt-4 text-sm text-gray-600">
          {t.successSub}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-300">
          {t.nameLabel}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namePlaceholder}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
          disabled={loading}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300">
          {t.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
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
        {loading ? t.buttonJoining : t.buttonJoin}
      </button>
    </form>
  )
}
