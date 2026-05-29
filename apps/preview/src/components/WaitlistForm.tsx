import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

interface WaitlistFormProps {
  lang?: 'en' | 'zh'
}

export function WaitlistForm({ lang = 'en' }: WaitlistFormProps) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
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
      errName: '请输入您的姓名。',
      errEmail: '请输入有效的电子邮箱。',
      errGeneral: '发生了一些错误，请重试。',
    },
  }[lang]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError(t.errName); return }
    if (!email.trim() || !email.includes('@')) { setError(t.errEmail); return }

    setLoading(true)
    try {
      const trimmedName = name.trim()
      const trimmedEmail = email.trim().toLowerCase()
      await addDoc(collection(db, 'waitlist'), {
        name: trimmedName,
        email: trimmedEmail,
        submittedAt: new Date().toISOString(),
      })
      navigate('/joined', { state: { name: trimmedName, email: trimmedEmail } })
    } catch {
      setError(t.errGeneral)
      setLoading(false)
    }
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
