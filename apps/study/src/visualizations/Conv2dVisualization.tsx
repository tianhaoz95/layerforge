import { useState, useEffect } from 'react'

const CELL = 18
const INPUT_H = 5
const INPUT_W = 5
const K_H = 3
const K_W = 3

// Symmetric Gaussian-like input — all values ≤ 6, single digits
const INPUT_VALS = [
  [1, 2, 3, 2, 1],
  [2, 4, 5, 4, 2],
  [3, 5, 6, 5, 3],
  [2, 4, 5, 4, 2],
  [1, 2, 3, 2, 1],
]

// Plus-shaped kernel — outputs stay in range 22–32 (always 2 digits)
const KERNEL_VALS = [
  [0, 1, 0],
  [1, 2, 1],
  [0, 1, 0],
]

export function Conv2dVisualization() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [stride, setStride] = useState(1)

  const Hout = Math.floor((INPUT_H - K_H) / stride) + 1
  const Wout = Math.floor((INPUT_W - K_W) / stride) + 1
  const total = Hout * Wout

  const currH = Math.floor(step / Wout)
  const currW = step % Wout

  function computeVal(h: number, w: number): number {
    let s = 0
    for (let kh = 0; kh < K_H; kh++)
      for (let kw = 0; kw < K_W; kw++)
        s += INPUT_VALS[h * stride + kh][w * stride + kw] * KERNEL_VALS[kh][kw]
    return s
  }

  const outputs = Array.from({ length: Hout }, (_, h) =>
    Array.from({ length: Wout }, (_, w) => computeVal(h, w))
  )

  useEffect(() => {
    if (!isPlaying) return
    const t = setInterval(() => {
      setStep(s => {
        if (s >= total - 1) { setIsPlaying(false); return 0 }
        return s + 1
      })
    }, 650)
    return () => clearInterval(t)
  }, [isPlaying, total])

  useEffect(() => { setStep(0); setIsPlaying(false) }, [stride])

  const inRF = (r: number, c: number) =>
    r >= currH * stride && r < currH * stride + K_H &&
    c >= currW * stride && c < currW * stride + K_W

  const isComputed = (h: number, w: number) =>
    h < currH || (h === currH && w <= currW)

  const isCurrent = (h: number, w: number) => h === currH && w === currW

  const OCELL = stride === 1 ? CELL : CELL + 4

  return (
    <div className="bg-gray-900 rounded-lg p-3 select-none">
      <div className="flex gap-3 justify-center items-start">

        {/* Input grid */}
        <div>
          <p className="text-[10px] text-gray-500 text-center mb-1">Input {INPUT_H}×{INPUT_W}</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${INPUT_W}, ${CELL}px)`, gap: '2px' }}>
            {INPUT_VALS.map((row, r) => row.map((v, c) => (
              <div
                key={`i${r}${c}`}
                style={{ width: CELL, height: CELL }}
                className={`flex items-center justify-center text-[9px] rounded-sm font-mono transition-all duration-200
                  ${inRF(r, c)
                    ? 'bg-cyan-900/60 border border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-gray-800 border border-gray-700 text-gray-500'}`}
              >
                {v}
              </div>
            )))}
          </div>
        </div>

        {/* Multiply symbol + kernel */}
        <div className="flex flex-col items-center" style={{ marginTop: '20px' }}>
          <span className="text-gray-600 text-base mb-1">⊛</span>
          <p className="text-[10px] text-gray-500 text-center mb-1">K 3×3</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, ${CELL}px)`, gap: '2px' }}>
            {KERNEL_VALS.map((row, r) => row.map((v, c) => (
              <div
                key={`k${r}${c}`}
                style={{ width: CELL, height: CELL }}
                className="flex items-center justify-center text-[9px] rounded-sm font-mono bg-purple-900/40 border border-purple-500 text-purple-300"
              >
                {v}
              </div>
            )))}
          </div>
        </div>

        {/* Equals + output grid */}
        <div className="flex flex-col items-center" style={{ marginTop: '20px' }}>
          <span className="text-gray-600 text-base mb-1">=</span>
          <p className="text-[10px] text-gray-500 text-center mb-1">Out {Hout}×{Wout}</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Wout}, ${OCELL}px)`, gap: '2px' }}>
            {Array.from({ length: Hout }, (_, h) => Array.from({ length: Wout }, (_, w) => (
              <div
                key={`o${h}${w}`}
                style={{ width: OCELL, height: OCELL }}
                className={`flex items-center justify-center text-[8px] rounded-sm font-mono transition-all duration-200
                  ${isCurrent(h, w)
                    ? 'bg-amber-900/60 border border-amber-400 text-amber-300 font-bold'
                    : isComputed(h, w)
                      ? 'bg-green-900/40 border border-green-600 text-green-400'
                      : 'bg-gray-800 border border-gray-700 text-gray-600'}`}
              >
                {isComputed(h, w) ? outputs[h][w] : '?'}
              </div>
            )))}
          </div>
        </div>
      </div>

      {/* Current computation info */}
      <div className="text-[10px] text-gray-500 text-center mt-2">
        <span className="text-cyan-400">patch[{currH},{currW}]</span>
        {' '}⊛{' '}
        <span className="text-purple-400">K</span>
        {' = '}
        <span className="text-amber-400 font-bold">{computeVal(currH, currW)}</span>
        <span className="mx-2 text-gray-700">|</span>
        stride={stride} → {Hout}×{Wout}={total} outputs
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded px-2 py-0.5 text-xs"
        >◀</button>
        <button
          onClick={() => { setIsPlaying(p => !p) }}
          className={`${isPlaying ? 'bg-gray-700' : 'bg-blue-700'} hover:opacity-80 text-white rounded px-2.5 py-0.5 text-xs`}
        >{isPlaying ? '⏸' : '▶'}</button>
        <button
          onClick={() => setStep(s => Math.min(total - 1, s + 1))}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded px-2 py-0.5 text-xs"
        >▶</button>
        <input
          type="range" min={0} max={total - 1} value={step}
          onChange={e => { setIsPlaying(false); setStep(+e.target.value) }}
          className="w-16 accent-cyan-400"
        />
        <span className="text-[10px] text-gray-600">{step + 1}/{total}</span>
        <label className="text-[10px] text-gray-500 ml-1 flex items-center gap-1">
          stride
          <select
            value={stride}
            onChange={e => setStride(+e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-400 text-[10px] rounded"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
      </div>

      <p className="text-[10px] text-gray-600 text-center mt-2 mb-0">
        Cyan = receptive field · Purple = kernel · Amber = output being computed — change stride to see how it shrinks the output grid.
      </p>
    </div>
  )
}
