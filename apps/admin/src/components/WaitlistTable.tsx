import { useState } from 'react'
import type { WaitlistEntry } from '../hooks/useWaitlist'

interface Props {
  entries: WaitlistEntry[]
  loading: boolean
  error: string | null
}

export function WaitlistTable({ entries, loading, error }: Props) {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = entries.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()),
  )

  function exportCsv() {
    const rows = [
      ['#', 'Name', 'Email', 'Joined'],
      ...filtered.map((e, i) => [
        String(i + 1),
        e.name,
        e.email,
        formatDate(e.submittedAt),
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `layerforge-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copyEmail(email: string) {
    await navigator.clipboard.writeText(email)
    setCopied(email)
    setTimeout(() => setCopied(null), 1500)
  }

  async function copyAllEmails() {
    const emails = filtered.map((e) => e.email).join('\n')
    await navigator.clipboard.writeText(emails)
    setCopied('__all__')
    setTimeout(() => setCopied(null), 1500)
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-600 font-mono text-sm">
        Loading waitlist...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm font-mono text-red-400">Firestore error: {error}</p>
        <p className="mt-2 text-xs text-gray-500">
          Make sure your Firestore security rules allow admin reads on the{' '}
          <code className="text-gray-400">waitlist</code> collection.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors font-mono"
        />
        <button
          onClick={copyAllEmails}
          className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-mono text-gray-300 hover:border-gray-600 hover:text-white transition-colors whitespace-nowrap"
        >
          {copied === '__all__' ? 'Copied!' : `Copy ${filtered.length} emails`}
        </button>
        <button
          onClick={exportCsv}
          className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-4 py-2.5 text-sm font-mono text-cyan-400 hover:bg-cyan-500/20 transition-colors whitespace-nowrap"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 py-16 text-center">
          {entries.length === 0 ? (
            <>
              <p className="text-gray-500 font-mono text-sm">No waitlist entries yet.</p>
              <p className="mt-2 text-xs text-gray-600">
                Entries appear here once the preview app is wired to Firestore (Phase 2).
              </p>
            </>
          ) : (
            <p className="text-gray-500 font-mono text-sm">No results for "{search}"</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60">
                <th className="py-3 pl-4 pr-2 text-left text-xs text-gray-500 font-normal">#</th>
                <th className="py-3 px-4 text-left text-xs text-gray-500 font-normal">Name</th>
                <th className="py-3 px-4 text-left text-xs text-gray-500 font-normal">Email</th>
                <th className="py-3 px-4 text-left text-xs text-gray-500 font-normal">Joined</th>
                <th className="py-3 pr-4 text-right text-xs text-gray-500 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr
                  key={entry.id}
                  className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 pl-4 pr-2 text-gray-600">{i + 1}</td>
                  <td className="py-3 px-4 text-gray-200">{entry.name}</td>
                  <td className="py-3 px-4 text-cyan-400">{entry.email}</td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(entry.submittedAt)}</td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() => copyEmail(entry.email)}
                      className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {copied === entry.email ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso.slice(0, 10)
  }
}
