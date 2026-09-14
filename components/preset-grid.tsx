'use client'

import { CONTRAST_PRESETS, contrastRatio } from '@/lib/contrast'

export function PresetGrid({ onSelect }: { onSelect: (fg: string, bg: string) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {CONTRAST_PRESETS.map((preset) => {
        const ratio = contrastRatio(preset.fg, preset.bg)
        const pass = ratio !== null && ratio >= 4.5
        return (
          <li key={preset.label}>
            <button
              type="button"
              onClick={() => onSelect(preset.fg, preset.bg)}
              className="flex min-h-[64px] w-full flex-col justify-between border border-[var(--line)] p-2.5 text-left transition-colors hover:border-[var(--ink)]"
              style={{ backgroundColor: preset.bg }}
            >
              <span className="text-sm font-medium" style={{ color: preset.fg }}>
                {preset.label}
              </span>
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: preset.fg, opacity: 0.75 }}
              >
                {ratio ? ratio.toFixed(1) : '—'}:1 · {pass ? 'AA' : 'fail'}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
