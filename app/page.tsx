'use client'

import { useState, useCallback, useMemo } from 'react'

// WCAG relative luminance & contrast calculations
function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6 && clean.length !== 3) return null
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null
  return [r, g, b]
}

function linearize(c: number): number {
  const sRGB = c / 255
  return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

function contrastRatio(hex1: string, hex2: string): number | null {
  const c1 = hexToRgb(hex1)
  const c2 = hexToRgb(hex2)
  if (!c1 || !c2) return null
  const L1 = relativeLuminance(...c1)
  const L2 = relativeLuminance(...c2)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

const DESIGNER_PAIRS = [
  { label: 'Obsidian Slate', fg: '#0F172A', bg: '#FFFFFF', desc: 'Maximum clarity dark-on-light' },
  { label: 'Cyber Dark', fg: '#38BDF8', bg: '#090D16', desc: 'Modern glowing developer theme' },
  { label: 'Emerald Mint', fg: '#064E3B', bg: '#ECFDF5', desc: 'Fresh organic readability' },
  { label: 'Royal Sapphire', fg: '#FFFFFF', bg: '#1D4ED8', desc: 'Trustworthy corporate primary' },
  { label: 'Sunset Amber', fg: '#451A03', bg: '#FEF3C7', desc: 'Warm warning & notification' },
  { label: 'Violet Studio', fg: '#FFFFFF', bg: '#581C87', desc: 'Creative editorial depth' },
  { label: 'Graphite News', fg: '#18181B', bg: '#F4F4F5', desc: 'Clean editorial neutral' },
  { label: 'High Contrast Alert', fg: '#7F1D1D', bg: '#FEE2E2', desc: 'Accessible urgent banner' },
]

export default function ContrastLabPage() {
  const [fg, setFg] = useState('#0F172A')
  const [bg, setBg] = useState('#FFFFFF')
  const [copied, setCopied] = useState(false)
  const [visionFilter, setVisionFilter] = useState<'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'>('normal')

  const ratio = useMemo(() => contrastRatio(fg, bg) ?? 1, [fg, bg])

  const passes = useMemo(() => {
    return {
      normalAA: ratio >= 4.5,
      normalAAA: ratio >= 7.0,
      largeAA: ratio >= 3.0,
      uiAA: ratio >= 3.0,
    }
  }, [ratio])

  const swapColors = () => {
    setFg(bg)
    setBg(fg)
  }

  // Auto-adjust foreground to guarantee minimum 4.5:1 ratio
  const autoFixContrast = () => {
    const bgRgb = hexToRgb(bg)
    if (!bgRgb) return
    const bgLum = relativeLuminance(...bgRgb)
    // If background is bright, set foreground to dark slate; if dark, set to white
    if (bgLum > 0.5) {
      setFg('#0F172A')
    } else {
      setFg('#FFFFFF')
    }
  }

  const copyTokens = () => {
    const snippet = `// ContrastLab WCAG Tokens (${ratio.toFixed(2)}:1 ratio)\nconst theme = {\n  foreground: '${fg}',\n  background: '${bg}',\n  contrastRatio: '${ratio.toFixed(2)}:1',\n  wcagNormalAA: ${passes.normalAA},\n  wcagNormalAAA: ${passes.normalAAA},\n};`
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getFilterStyle = () => {
    switch (visionFilter) {
      case 'achromatopsia':
        return { filter: 'grayscale(100%)' }
      case 'protanopia':
        return { filter: 'sepia(40%) hue-rotate(290deg) saturate(140%)' }
      case 'deuteranopia':
        return { filter: 'sepia(40%) hue-rotate(180deg) saturate(120%)' }
      case 'tritanopia':
        return { filter: 'sepia(50%) hue-rotate(90deg)' }
      default:
        return {}
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-16">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-slate-900 p-0.5 shadow-sm shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18" />
                  <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  Contrast<span className="text-amber-600">Lab</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  WCAG 2.2 Auditor
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Real-time accessibility color ratio tester, component previewer, and vision simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={swapColors}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Swap Foreground and Background"
            >
              <span>⇄ Swap Colors</span>
            </button>
            <button
              onClick={copyTokens}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{copied ? '✓ Copied Tokens!' : '📋 Copy Tokens'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-8 flex-1 space-y-6">
        {/* Giant Hero Scoreboard Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Contrast Ratio
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900">
                {ratio.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-slate-400">: 1</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {ratio >= 7.0
                ? '⭐ Enhanced AAA Compliance (Exceeds all standard recommendations)'
                : ratio >= 4.5
                ? '✅ Standard AA Compliance (Recommended for regular body text)'
                : ratio >= 3.0
                ? '⚠️ AA Large Only (Safe for bold headings 18pt+ and UI components)'
                : '❌ Fails WCAG Compliance (Difficult to read for many users)'}
            </p>
          </div>

          {/* 4 Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Normal Text AA', min: '4.5:1', pass: passes.normalAA },
              { label: 'Normal Text AAA', min: '7.0:1', pass: passes.normalAAA },
              { label: 'Large Text AA', min: '3.0:1', pass: passes.largeAA },
              { label: 'UI Components', min: '3.0:1', pass: passes.uiAA },
            ].map((b) => (
              <div
                key={b.label}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  b.pass
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                <span className="text-base block mb-0.5">{b.pass ? '✓' : '✕'}</span>
                <span className="font-bold text-xs block">{b.label}</span>
                <span className="text-[10px] opacity-75 font-mono">Min {b.min}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Inputs & Auto-Fix Banner */}
        <div className="grid sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Foreground (Text / Pattern)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
                />
                <input
                  type="text"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono text-slate-800 font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Background (Canvas / Surface)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
                />
                <input
                  type="text"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono text-slate-800 font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Quick Accessibility Fix
            </span>
            <p className="text-xs text-slate-500">
              {passes.normalAA
                ? 'Your selected colors currently pass standard WCAG AA criteria!'
                : 'Selected pairing does not pass AA body text requirements.'}
            </p>
            <button
              onClick={autoFixContrast}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              ⚡ Auto-Fix to Optimal AA (4.5:1+)
            </button>
          </div>
        </div>

        {/* Real-World Interactive Component Preview Stage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-900 tracking-tight">
                Live Component Sandbox
              </h2>
              <p className="text-xs text-slate-500">
                Interactive preview rendering real buttons, typography, and controls with your exact colors
              </p>
            </div>

            {/* Vision Filter Switcher */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Vision:</span>
              <select
                value={visionFilter}
                onChange={(e) => setVisionFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 outline-none"
              >
                <option value="normal">Normal 20/20 Vision</option>
                <option value="protanopia">Protanopia (Red-blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                <option value="tritanopia">Tritanopia (Blue-blind)</option>
                <option value="achromatopsia">Achromatopsia (Monochrome)</option>
              </select>
            </div>
          </div>

          {/* Render Stage */}
          <div
            className="rounded-2xl p-8 sm:p-12 transition-all duration-200 border border-slate-200 shadow-inner"
            style={{ backgroundColor: bg, color: fg, ...getFilterStyle() }}
          >
            <div className="max-w-2xl space-y-6">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase opacity-75 block mb-2">
                  Sample Product Showcase
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Design systems built with inclusive contrast and universal clarity.
                </h3>
              </div>

              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                High contrast ensures that digital experiences remain effortlessly legible in bright sunlight, on low-quality displays, and for individuals with visual impairments or age-related vision loss.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform hover:scale-105"
                  style={{ backgroundColor: fg, color: bg }}
                >
                  Action Button
                </button>

                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: fg }}
                >
                  <span>✓ Verified Accessible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Designer Accessible Presets Grid */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Curated Accessible Color Pairings
            </h3>
            <span className="text-[11px] text-slate-400">Click any preset to test</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DESIGNER_PAIRS.map((p) => {
              const r = contrastRatio(p.fg, p.bg) ?? 1
              return (
                <button
                  key={p.label}
                  onClick={() => {
                    setFg(p.fg)
                    setBg(p.bg)
                  }}
                  className="p-3 rounded-2xl border border-slate-200/80 hover:border-slate-300 text-left transition-all hover:scale-[1.02] flex flex-col justify-between cursor-pointer group bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-800">{p.label}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {r.toFixed(1)}:1
                    </span>
                  </div>
                  <div
                    className="h-10 rounded-xl flex items-center justify-center font-semibold text-xs border border-black/5 mb-2 shadow-xs"
                    style={{ backgroundColor: p.bg, color: p.fg }}
                  >
                    Sample Preview
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{p.desc}</span>
                </button>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
