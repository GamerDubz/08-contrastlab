'use client'

import { isValidHex } from '@/lib/contrast'
import { SpecimenFrame } from './specimen-frame'

type ColorSwatchPanelProps = {
  role: 'Foreground' | 'Background'
  hexInput: string
  committedColor: string
  onHexChange: (value: string) => void
  onColorChange: (value: string) => void
}

export function ColorSwatchPanel({
  role,
  hexInput,
  committedColor,
  onHexChange,
  onColorChange,
}: ColorSwatchPanelProps) {
  const inputId = `${role.toLowerCase()}-hex`
  const invalid = hexInput.length > 0 && !isValidHex(hexInput)

  return (
    <SpecimenFrame className="flex flex-1 flex-col">
      <div
        className="flex h-48 flex-col justify-between p-4 sm:h-64"
        style={{ backgroundColor: committedColor }}
      >
        <span
          className="w-fit border border-current px-2 py-1 font-mono text-xs font-medium tracking-[0.15em] uppercase"
          style={{ color: readableLabelColor(committedColor) }}
        >
          {role}
        </span>
        <span
          className="font-mono text-3xl font-semibold tabular-nums sm:text-4xl"
          style={{ color: readableLabelColor(committedColor) }}
        >
          {committedColor.toUpperCase()}
        </span>
      </div>

      <div className="flex items-stretch gap-2 border-t-2 border-[var(--ink)] bg-[var(--surface)] p-3">
        <label className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden border border-[var(--line)]">
          <span className="sr-only">{role} color picker</span>
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(committedColor) ? committedColor : '#000000'}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute -top-1 -left-1 h-[calc(100%+8px)] w-[calc(100%+8px)] cursor-pointer border-0 p-0"
            aria-label={`${role} color picker`}
          />
        </label>
        <div className="flex-1">
          <label htmlFor={inputId} className="sr-only">
            {role} hex value
          </label>
          <input
            id={inputId}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            value={hexInput}
            onChange={(e) => onHexChange(e.target.value)}
            aria-invalid={invalid}
            aria-describedby={invalid ? `${inputId}-error` : undefined}
            placeholder="#000000"
            className="h-11 w-full border border-[var(--line)] bg-[var(--paper)] px-3 font-mono text-base text-[var(--ink)] outline-none focus-visible:border-[var(--ink)]"
          />
          {invalid && (
            <p id={`${inputId}-error`} className="mt-1 text-xs text-[var(--ink-muted)]">
              Enter a hex color, e.g. #1a1a1a
            </p>
          )}
        </div>
      </div>
    </SpecimenFrame>
  )
}

/** Picks pure black or white so the role/hex chrome text stays legible on any swatch. */
function readableLabelColor(hex: string): string {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return '#0a0a0a'
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 140 ? '#0a0a0a' : '#ffffff'
}
