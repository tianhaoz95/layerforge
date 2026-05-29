import { useState, useEffect } from 'react'

const MAX_POS = 16
const BASE_FREQ = 0.5 // High frequency channel rotation speed
const SUB_FREQ = 0.15 // Low frequency channel rotation speed

interface PhasorCircleProps {
  label: string
  angle: number
  color: string
  lang?: 'en' | 'zh'
}

function PhasorCircle({ label, angle, color, lang = 'en' }: PhasorCircleProps) {
  const cx = 36
  const cy = 36
  const r = 28
  
  // Vector coordinates
  const vx = cx + r * Math.cos(angle)
  const vy = cy - r * Math.sin(angle) // SVG coordinates are inverted on Y

  return (
    <div className="flex flex-col items-center bg-gray-950/40 p-2.5 rounded-lg border border-gray-900">
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Unit circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="1.5" />
        {/* Axes */}
        <line x1={cx - r - 4} y1={cy} x2={cx + r + 4} y2={cy} stroke="#111827" strokeWidth="1" strokeDasharray="2,2" />
        <line x1={cx} y1={cy - r - 4} x2={cx} y2={cy + r + 4} stroke="#111827" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Rotating Vector */}
        <line
          x1={cx}
          y1={cy}
          x2={vx}
          y2={vy}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
        {/* Coordinate dot */}
        <circle
          cx={vx}
          cy={vy}
          r="3"
          fill={color}
          className="transition-all duration-300 ease-out shadow-lg"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        {/* Origin dot */}
        <circle cx={cx} cy={cy} r="1.5" fill="#374151" />
      </svg>
      <div className="text-[10px] font-mono font-semibold mt-1.5" style={{ color }}>
        {label}
      </div>
      <div className="text-[8px] font-mono text-gray-500 mt-0.5">
        {lang === 'en' ? 'Angle: ' : '角度: '}{(((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) * 180 / Math.PI).toFixed(0)}°
      </div>
    </div>
  )
}

interface VisualPlaygroundProps {
  lang: 'en' | 'zh'
}

export function VisualPlayground({ lang }: VisualPlaygroundProps) {
  const [pos, setPos] = useState(2)
  const [playing, setPlaying] = useState(true)

  const t = {
    en: {
      badge: '⚡ Cutting-Edge Curriculum',
      title1: 'Visualizing Industrial',
      title2: 'AI / ML Capabilities',
      desc: 'LayerForge goes far beyond simple textbook neural networks. We focus on training you in modern, state-of-the-art transformer components utilized in real-world large language models (like LLaMA 3, Gemma 2, and Mistral):',
      ropeTitle: 'Rotary Position Embeddings (RoPE):',
      ropeBody: ' Learn how block-orthogonal rotation matrices encode relative distance into self-attention.',
      gqaTitle: 'Grouped-Query Attention (GQA):',
      gqaBody: ' Master memory-efficient key-value caching implemented in high-throughput LLMs.',
      tritonTitle: 'Triton GPU Kernels:',
      tritonBody: ' Write parallelized vector addition, softmax, and normalization kernels that run directly on simulated hardware.',
      playgroundTitle: 'RoPE Phasor Rotation Playground',
      playgroundSubtitle: `Simulating Query Vector rotation at Pos m=${pos}`,
      pause: '⏸ Pause',
      play: '▶ Play',
      tokenPos: `Token Position m = ${pos}`,
      highFreq: 'Dimension Pair [0, 1] (High Freq)',
      lowFreq: 'Dimension Pair [2, 3] (Low Freq)',
      fastPhasor: 'Fast Phasor (θ_0)',
      slowPhasor: 'Slow Phasor (θ_1)',
      infoTitle: 'Rotational Preservation:',
      infoBody: 'RoPE rotates consecutive pairs of embedding dimensions in 2D sub-spaces at frequency ',
      infoBody2: '. As you scrub token position ',
      infoBody3: ', the query vector rotates. When matching against key vectors, their dot product depends solely on the relative rotation offset ',
    },
    zh: {
      badge: '⚡ 前沿实战课程',
      title1: '可视化工业级',
      title2: 'AI / ML 核心机制',
      desc: 'LayerForge 绝不停留在教科书式的简单神经网络。我们专注于训练您掌握在真实大语言模型（如 LLaMA 3、Gemma 2 和 Mistral）中使用的现代顶尖 Transformer 组件：',
      ropeTitle: '旋转位置编码 (RoPE):',
      ropeBody: ' 学习块正交旋转矩阵如何将相对距离编码到自注意力机制中。',
      gqaTitle: '分组查询注意力 (GQA):',
      gqaBody: ' 掌握高吞吐量 LLM 中实现的内存高效型 Key-Value 缓存。',
      tritonTitle: 'Triton GPU 内核:',
      tritonBody: ' 编写可直接在模拟硬件上运行的并行化向量加法、Softmax 和归一化内核。',
      playgroundTitle: 'RoPE 相位旋转演练场',
      playgroundSubtitle: `模拟 Token 位置 m = ${pos}`,
      pause: '⏸ 暂停',
      play: '▶ 播放',
      tokenPos: `Token 位置 m = ${pos}`,
      highFreq: '维度对 [0, 1] (高频)',
      lowFreq: '维度对 [2, 3] (低频)',
      fastPhasor: '快速相位器 (θ_0)',
      slowPhasor: '慢速相位器 (θ_1)',
      infoTitle: '旋转保持性:',
      infoBody: 'RoPE 在二维子空间中以频率 ',
      infoBody2: ' 旋转连续的嵌入维度对。当您滑动 Token 位置 ',
      infoBody3: ' 时，查询向量会随之旋转。当与键向量进行匹配时，它们的点积仅取决于相对旋转偏移量 ',
    }
  }[lang]

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPos(p => (p + 1) % MAX_POS), 900)
    return () => clearInterval(id)
  }, [playing])

  // Angles for Query vector (fixed pos m) and Key vector (shifting relative offset)
  const qAngleFast = pos * BASE_FREQ
  const qAngleSlow = pos * SUB_FREQ

  return (
    <section className="border-t border-gray-800/60 bg-gray-950/20 py-24 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px] -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[90px] -translate-y-1/2" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Copy Column (cols 1-5) */}
          <div className="lg:col-span-5">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/5 px-3 py-1 text-xs font-medium text-purple-400">
              {t.badge}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {t.title2}
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-400">
              {t.desc}
            </p>
            
            <ul className="mt-8 space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">✓</span>
                <div>
                  <strong className="text-gray-200">{t.ropeTitle}</strong>{t.ropeBody}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">✓</span>
                <div>
                  <strong className="text-gray-200">{t.gqaTitle}</strong>{t.gqaBody}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">✓</span>
                <div>
                  <strong className="text-gray-200">{t.tritonTitle}</strong>{t.tritonBody}
                </div>
              </li>
            </ul>
          </div>

          {/* Interactive Widget Column (cols 6-12) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/60">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">{t.playgroundTitle}</h3>
                  <p className="text-[10px] text-gray-500 font-mono">{t.playgroundSubtitle}</p>
                </div>
                <button
                  onClick={() => setPlaying(p => !p)}
                  className="rounded bg-gray-800 hover:bg-gray-700 px-2 py-1 text-xs text-gray-300 font-mono transition-all"
                >
                  {playing ? t.pause : t.play}
                </button>
              </div>

              {/* Slider controls */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono text-gray-400 shrink-0 w-24">
                  {t.tokenPos}
                </span>
                <input
                  type="range"
                  min={0}
                  max={MAX_POS - 1}
                  value={pos}
                  onChange={e => {
                    setPos(+e.target.value)
                    setPlaying(false)
                  }}
                  className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Phasors Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                
                {/* 1. Fast rotating dimension pair */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-gray-500 mb-2">{t.highFreq}</span>
                  <PhasorCircle
                    label={t.fastPhasor}
                    angle={qAngleFast}
                    color="#a78bfa"
                    lang={lang}
                  />
                </div>

                {/* 2. Slow rotating dimension pair */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-gray-500 mb-2">{t.lowFreq}</span>
                  <PhasorCircle
                    label={t.slowPhasor}
                    angle={qAngleSlow}
                    color="#22d3ee"
                    lang={lang}
                  />
                </div>

              </div>

              {/* Summary / Educational card */}
              <div className="rounded-lg bg-gray-950 p-4 border border-gray-800/80 font-mono text-[10px] leading-relaxed text-gray-400">
                <div className="flex items-start gap-2.5">
                  <span className="text-purple-400">ℹ</span>
                  <div>
                    <span className="text-gray-300 font-semibold uppercase block mb-1">{t.infoTitle}</span>
                    {t.infoBody}
                    <code className="bg-gray-900 border border-gray-850 px-1 py-0.5 rounded text-purple-300">θ_i = base^(-2i/d)</code>
                    {t.infoBody2}
                    <code className="text-cyan-300">m</code>
                    {t.infoBody3}
                    <code className="text-white">m - n</code>.
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

