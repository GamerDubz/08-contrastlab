'use client'

import { useState, useCallback, useMemo } from 'react'

// WCAG contrast calculation
function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6 && clean.length !== 3) return null
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
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

type WCAGLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'

function getWCAGLevels(ratio: number) {
  return {
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  }
}

const PRESETS = [
  { label: 'Dark UI', fg: '#f5f5f5', bg: '#1a1a1a' },
  { label: 'Light UI', fg: '#111111', bg: '#ffffff' },
  { label: 'Ocean Blue', fg: '#ffffff', bg: '#1d4ed8' },
  { label: 'Warning Yellow', fg: '#000000', bg: '#fbbf24' },
  { label: 'Success Green', fg: '#ffffff', bg: '#16a34a' },
  { label: 'Low Contrast', fg: '#888888', bg: '#aaaaaa' },
  { label: 'Red on Black', fg: '#ef4444', bg: '#000000' },
  { label: 'Slate', fg: '#0f172a', bg: '#e2e8f0' },
]

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ background: pass ? '#16a34a20' : '#dc262620', border: `1px solid ${pass ? '#16a34a50' : '#dc262650'}` }}
      role="status"
    >
      <span className="text-lg">{pass ? '✓' : '✕'}</span>
      <div>
        <div className="text-sm font-semibold" style={{ color: pass ? '#4ade80' : '#f87171' }}>
          {pass ? 'Pass' : 'Fail'}
        </div>
        <div className="text-xs text-neutral-400">{label}</div>
      </div>
    </div>
  )
}

export default function ContrastLabPage() {
  const [fg, setFg] = useState('#f5f5f5')
  const [bg, setBg] = useState('#1a1a1a')
  const [fgHex, setFgHex] = useState('#f5f5f5')
  const [bgHex, setBgHex] = useState('#1a1a1a')

  const handleFgInput = useCallback((v: string) => {
    setFgHex(v)
    if (/^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{3}$/.test(v)) setFg(v)
  }, [])

  const handleBgInput = useCallback((v: string) => {
    setBgHex(v)
    if (/^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{3}$/.test(v)) setBg(v)
  }, [])

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg])
  const levels = useMemo(() => ratio ? getWCAGLevels(ratio) : null, [ratio])

  const ratioDisplay = ratio ? ratio.toFixed(2) : '—'
  const ratioColor = !ratio ? '#888' : ratio >= 7 ? '#4ade80' : ratio >= 4.5 ? '#60a5fa' : ratio >= 3 ? '#fbbf24' : '#f87171'

  const swap = useCallback(() => {
    setFg(bg); setFgHex(bg); setBg(fg); setBgHex(fg)
  }, [fg, bg])

  return (
    <div className="min-h-full bg-[#0f0f0f] text-neutral-100">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">ContrastLab</h1>
          <p className="text-sm text-neutral-500">WCAG 2.1 color contrast checker & accessibility tool</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Color pickers */}
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-neutral-300">Colors</h2>
              {[
                { label: 'Foreground (text)', color: fg, hex: fgHex, onColor: (v: string) => { setFg(v); setFgHex(v) }, onHex: handleFgInput },
                { label: 'Background', color: bg, hex: bgHex, onColor: (v: string) => { setBg(v); setBgHex(v) }, onHex: handleBgInput },
              ].map(({ label, color, hex, onColor, onHex }) => (
                <div key={label}>
                  <label className="block text-xs text-neutral-500 mb-2">{label}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => onColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-[#333] bg-transparent"
                      aria-label={label}
                    />
                    <input
                      type="text"
                      value={hex}
                      onChange={(e) => onHex(e.target.value)}
                      className="flex-1 bg-[#242424] border border-[#333] rounded px-3 py-2 text-sm font-mono text-neutral-200 outline-none focus:border-blue-500"
                      placeholder="#000000"
                      aria-label={`${label} hex value`}
                    />
                    <div className="w-10 h-10 rounded border border-[#333]" style={{ background: color }} aria-hidden />
                  </div>
                </div>
              ))}
              <button
                onClick={swap}
                className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-200 border border-[#2e2e2e] hover:border-[#444] rounded transition-colors"
                aria-label="Swap foreground and background colors"
              >
                ↕ Swap colors
              </button>
            </div>

            {/* Presets */}
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-neutral-300 mb-3">Presets</h2>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => {
                  const r = contrastRatio(p.fg, p.bg)
                  const pass = r ? r >= 4.5 : false
                  return (
                    <button
                      key={p.label}
                      onClick={() => { setFg(p.fg); setFgHex(p.fg); setBg(p.bg); setBgHex(p.bg) }}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#2e2e2e] hover:border-[#444] transition-colors text-left"
                      style={{ background: p.bg }}
                    >
                      <span className="text-xs font-medium" style={{ color: p.fg }}>{p.label}</span>
                      <span
                        className="ml-auto text-xs rounded px-1"
                        style={{
                          background: pass ? '#16a34a30' : '#dc262630',
                          color: pass ? '#4ade80' : '#f87171',
                          border: `1px solid ${pass ? '#16a34a50' : '#dc262650'}`,
                        }}
                      >
                        {r ? r.toFixed(1) : '—'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Preview */}
            <div
              className="rounded-xl p-6 border border-[#2e2e2e]"
              style={{ background: bg }}
              aria-label="Color preview"
            >
              <div style={{ color: fg }}>
                <p className="text-2xl font-bold mb-1">Large Text Sample</p>
                <p className="text-sm mb-3">This is normal-size body text showing how your color combination looks in practice.</p>
                <p className="text-xs text-current opacity-70">Small text (12px) — harder to read at low contrast</p>
              </div>
            </div>

            {/* Ratio display */}
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 text-center">
              <div className="text-sm text-neutral-500 mb-2">Contrast Ratio</div>
              <div className="text-6xl font-black tabular-nums mb-1" style={{ color: ratioColor }}>
                {ratioDisplay}
              </div>
              <div className="text-sm text-neutral-500">:1</div>
            </div>

            {/* WCAG badges */}
            {levels && (
              <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-semibold text-neutral-300">WCAG 2.1 Compliance</h2>
                <div className="grid grid-cols-2 gap-2">
                  <Badge pass={levels.normalAA} label="AA — Normal text (4.5:1)" />
                  <Badge pass={levels.normalAAA} label="AAA — Normal text (7:1)" />
                  <Badge pass={levels.largeAA} label="AA — Large text (3:1)" />
                  <Badge pass={levels.largeAAA} label="AAA — Large text (4.5:1)" />
                </div>
                <div className="text-xs text-neutral-600 pt-2 border-t border-[#2e2e2e]">
                  Large text = 18pt+ or 14pt+ bold. Non-text elements follow 3:1 minimum.
                </div>
              </div>
            )}

            {/* Improvement hint */}
            {ratio && ratio < 4.5 && (
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-sm text-amber-300">
                <strong>Tip:</strong> To reach AA compliance (4.5:1), try darkening your foreground or lightening your background color.
                Current ratio is {ratio.toFixed(2)}:1 — needs {(4.5 / ratio * 100 - 100).toFixed(0)}% more contrast.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
