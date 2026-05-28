import React from 'react'

interface DescriptionRendererProps {
  description: string
}

export const DescriptionRenderer: React.FC<DescriptionRendererProps> = ({ description }) => {
  const blocks = description.split('\n\n')

  return (
    <div className="space-y-5 text-slate-300 font-sans">
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim()

        // 1. Boxed formula parser (┌── and └──)
        if (trimmed.includes('┌──') && trimmed.includes('└──')) {
          const lines = trimmed.split('\n')
          const formulaLines: string[] = []
          for (const line of lines) {
            if (line.includes('│')) {
              const content = line.split('│')[1]?.trim()
              if (content) formulaLines.push(content)
            }
          }
          if (formulaLines.length > 0) {
            const formula = formulaLines.join('\n')
            return (
              <div
                key={blockIdx}
                className="my-6 p-6 rounded-xl bg-gradient-to-r from-blue-950/30 via-purple-950/20 to-slate-950/30 border border-blue-500/20 hover:border-blue-400/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_25px_rgba(0,0,0,0.3)] transition-all duration-300 text-center select-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                <span className="absolute top-2 right-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 select-none group-hover:text-cyan-400 transition-colors">
                  Closed Form
                </span>
                <code className="block font-mono text-sm sm:text-base font-semibold tracking-wide text-cyan-300 group-hover:text-cyan-200 transition-colors duration-200">
                  {formula}
                </code>
              </div>
            )
          }
        }

        // 2. ASCII Table parser (+---- and |)
        if (trimmed.includes('+--') && trimmed.includes('|')) {
          const lines = trimmed.split('\n')
          const rows: Array<{ name: string; desc: string; shape: string }> = []
          
          for (const line of lines) {
            if (line.includes('|') && !line.includes('+--')) {
              const cells = line.split('|')
                .map(c => c.trim())
                .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
              
              if (cells.length >= 2) {
                rows.push({
                  name: cells[0] || '',
                  desc: cells[1] || '',
                  shape: cells[2] || ''
                })
              }
            }
          }

          if (rows.length > 0) {
            // Check if the first row is header
            const hasHeader = rows[0].name.toLowerCase() === 'tensor' || rows[0].name.toLowerCase() === 'variable'
            const headers = hasHeader ? rows[0] : { name: 'Tensor', desc: 'Description', shape: 'Shape' }
            const dataRows = hasHeader ? rows.slice(1) : rows

            return (
              <div key={blockIdx} className="my-6 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/30 backdrop-blur-sm shadow-md">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-850">
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">{headers.name}</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">{headers.desc}</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-purple-400">{headers.shape}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {dataRows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/10 transition-colors duration-150">
                        <td className="px-4 py-3 font-mono text-sm font-semibold text-cyan-300/90">{row.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-300 leading-relaxed font-sans">{row.desc}</td>
                        <td className="px-4 py-3">
                          {row.shape && (
                            <span className="bg-purple-950/30 border border-purple-900/40 px-2 py-0.5 rounded font-mono text-[10px] tracking-wide text-purple-400 font-medium">
                              {row.shape}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        // 3. Where Block parser (starts with Where: or contains multiple lines with em-dash and shape)
        const lines = trimmed.split('\n')
        const isWhereBlock = lines[0].toLowerCase().startsWith('where:') || 
          (lines.length >= 2 && lines.every(l => l.includes('—') || l.includes('–') || l.includes(' - ')))

        if (isWhereBlock) {
          const rows: Array<{ name: string; desc: string; shape: string }> = []
          for (const line of lines) {
            if (line.trim().toLowerCase() === 'where:') continue
            
            const sepIdx = line.indexOf('—') !== -1 
              ? line.indexOf('—') 
              : (line.indexOf('–') !== -1 ? line.indexOf('–') : line.indexOf(' - '))

            if (sepIdx !== -1) {
              const name = line.substring(0, sepIdx).trim()
              const right = line.substring(sepIdx + (line.includes(' - ') ? 3 : 1)).trim()
              
              let desc = right
              let shape = ''
              
              const keywords = ['shape:', 'of shape', 'shape']
              for (const kw of keywords) {
                const kwIdx = right.toLowerCase().lastIndexOf(kw)
                if (kwIdx !== -1) {
                  desc = right.substring(0, kwIdx).trim()
                  shape = right.substring(kwIdx + kw.length).trim()
                  if (shape.startsWith(':')) shape = shape.substring(1).trim()
                  break
                }
              }

              if (name && desc) {
                if (desc.endsWith(',')) desc = desc.slice(0, -1)
                rows.push({ name, desc, shape })
              }
            }
          }

          if (rows.length > 0) {
            return (
              <div key={blockIdx} className="my-5 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/30 backdrop-blur-sm shadow-md">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-850">
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">Tensor</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Description</th>
                      <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-purple-400">Shape</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/10 transition-colors duration-150">
                        <td className="px-4 py-3 font-mono text-sm font-semibold text-cyan-300/90">{row.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-300 leading-relaxed font-sans">{row.desc}</td>
                        <td className="px-4 py-3">
                          {row.shape && (
                            <span className="bg-purple-950/30 border border-purple-900/40 px-2 py-0.5 rounded font-mono text-[10px] tracking-wide text-purple-400 font-medium">
                              {row.shape}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        // 4. Algorithm Steps block parser (Steps: followed by numbered items)
        const isStepsBlock = lines[0].toLowerCase().startsWith('steps:') ||
          (lines.length >= 2 && lines.some(l => /^\d+\.\s+/.test(l.trim())))

        if (isStepsBlock) {
          const steps: Array<{ index: string; text: string }> = []
          for (const line of lines) {
            if (line.trim().toLowerCase() === 'steps:') continue
            const match = line.trim().match(/^(\d+)\.\s+(.*)$/)
            if (match) {
              steps.push({ index: match[1], text: match[2] })
            }
          }

          if (steps.length > 0) {
            return (
              <div key={blockIdx} className="my-6 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2 select-none">
                  <span className="w-1.5 h-3 bg-purple-500 rounded-full" />
                  Algorithm Steps
                </h4>
                <div className="space-y-2.5">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-3 bg-slate-900/25 hover:bg-slate-900/45 border border-slate-850/80 rounded-xl transition-all duration-150 group"
                    >
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-950/40 border border-purple-900/50 font-mono text-[11px] font-bold text-purple-400 group-hover:bg-purple-900/40 group-hover:border-purple-600/40 transition-all select-none">
                        {step.index}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed font-sans group-hover:text-slate-200 transition-colors pt-0.5">
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        }

        // 5. Requirements block parser (Requirements: followed by bullet points)
        const isReqsBlock = lines[0].toLowerCase().startsWith('requirements:') ||
          (lines.length >= 2 && lines.some(l => /^[•*-]\s+/.test(l.trim())))

        if (isReqsBlock) {
          const reqs: string[] = []
          for (const line of lines) {
            if (line.trim().toLowerCase() === 'requirements:') continue
            const lTrimmed = line.trim()
            if (/^[•*-]\s+/.test(lTrimmed)) {
              reqs.push(lTrimmed.substring(1).trim())
            }
          }

          if (reqs.length > 0) {
            return (
              <div key={blockIdx} className="my-6 p-5 rounded-xl border border-emerald-950/40 bg-emerald-950/5 backdrop-blur-sm shadow-sm">
                <h4 className="text-xs font-bold text-emerald-400/90 tracking-wider uppercase mb-3.5 flex items-center gap-2 select-none">
                  <svg className="w-4 h-4 text-emerald-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Constraints & Requirements
                </h4>
                <ul className="space-y-2.5">
                  {reqs.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed group">
                      <span className="text-emerald-500 mt-1 select-none font-bold text-xs">✓</span>
                      <span className="font-sans group-hover:text-slate-200 transition-colors">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
        }

        // 6. Highlighted emoji / feature card (starts with 👉 or 🌟)
        if (trimmed.startsWith('👉') || trimmed.startsWith('🌟')) {
          const lines = trimmed.split('\n')
          const title = lines[0].trim()
          const rest = lines.slice(1).join('\n').trim()
          
          if (rest) {
            return (
              <div key={blockIdx} className="my-4 p-4 rounded-xl border border-slate-800/80 bg-slate-900/10 hover:bg-slate-900/20 transition-all">
                <div className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2 mb-2 select-none">
                  {title}
                </div>
                <div className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre overflow-x-auto bg-slate-950/30 border border-slate-900/40 p-3.5 rounded-lg">
                  {rest}
                </div>
              </div>
            )
          }
        }

        // 7. General paragraphs or plain code snippets
        return (
          <p key={blockIdx} className="text-sm text-slate-300/90 leading-relaxed my-4 font-sans font-normal">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}
