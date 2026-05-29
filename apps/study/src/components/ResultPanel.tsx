import type { ExecutionResult, SubmissionStatus } from '../types/challenge'

interface Props {
  status: SubmissionStatus
  result: ExecutionResult | null
  onGetHint: () => void
  lang?: 'en' | 'zh'
}

export function ResultPanel({ status, result, onGetHint, lang = 'en' }: Props) {
  const t = {
    en: {
      running: 'Running in sandbox…',
      passed: '✓ All tests passed',
      error: '⚠ Execution Error',
      failed: '✗ Tests failed',
      getHint: 'AI can help with this — Get Hint',
      connectionErr: 'Could not connect to the sandbox. Make sure ',
      connectionErr2: ' is running on port 3001.',
    },
    zh: {
      running: '正在沙箱中运行…',
      passed: '✓ 所有测试均已通过',
      error: '⚠ 执行错误',
      failed: '✗ 测试未通过',
      getHint: 'AI 导师可以提供帮助 — 获取提示',
      connectionErr: '无法连接到代码沙箱。请确保 ',
      connectionErr2: ' 正在 3001 端口上运行。',
    }
  }[lang]

  if (status === 'idle') return null

  if (status === 'running') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        <span className="text-sm text-gray-400">{t.running}</span>
      </div>
    )
  }

  if (!result) return null

  return (
    <div
      className={`rounded-xl border p-5 ${
        status === 'passed'
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : status === 'error'
          ? 'border-amber-500/30 bg-amber-500/5'
          : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'passed' ? (
            <span className="text-emerald-400 font-semibold">{t.passed}</span>
          ) : status === 'error' ? (
            <span className="text-amber-400 font-semibold">{t.error}</span>
          ) : (
            <span className="text-red-400 font-semibold">{t.failed}</span>
          )}
          {result.executionTimeMs > 0 && (
            <span className="text-xs text-gray-500">({result.executionTimeMs}ms)</span>
          )}
        </div>

        {status !== 'passed' && (
          <button
            onClick={onGetHint}
            className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-colors"
          >
            {t.getHint}
          </button>
        )}
      </div>

      {result.output && (
        <pre className="mb-3 overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs font-mono text-gray-300 leading-relaxed custom-scrollbar">
          {result.output}
        </pre>
      )}

      {result.errors && (
        <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs font-mono text-red-300 leading-relaxed custom-scrollbar">
          {result.errors}
        </pre>
      )}

      {status === 'error' && !result.errors && (
        <p className="text-sm text-red-400">
          {t.connectionErr}
          <code className="font-mono text-xs">@layerforge/sandbox</code>
          {t.connectionErr2}
        </p>
      )}
    </div>
  )
}

