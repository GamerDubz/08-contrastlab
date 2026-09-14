// WCAG 2.1 contrast calculations.
// Reference: https://www.w3.org/TR/WCAG21/#contrast-minimum

export type Rgb = readonly [number, number, number]

export type WcagLevels = {
  normalAA: boolean
  normalAAA: boolean
  largeAA: boolean
  largeAAA: boolean
}

const HEX_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export function isValidHex(value: string): boolean {
  return HEX_PATTERN.test(value)
}

export function hexToRgb(hex: string): Rgb | null {
  if (!isValidHex(hex)) return null
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return [r, g, b]
}

function linearizeChannel(channel: number): number {
  const srgb = channel / 255
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
}

export function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * linearizeChannel(r) + 0.7152 * linearizeChannel(g) + 0.0722 * linearizeChannel(b)
}

export function contrastRatio(hexA: string, hexB: string): number | null {
  const rgbA = hexToRgb(hexA)
  const rgbB = hexToRgb(hexB)
  if (!rgbA || !rgbB) return null
  const lumA = relativeLuminance(rgbA)
  const lumB = relativeLuminance(rgbB)
  const lighter = Math.max(lumA, lumB)
  const darker = Math.min(lumA, lumB)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getWcagLevels(ratio: number): WcagLevels {
  return {
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  }
}

export type ColorPreset = {
  label: string
  fg: string
  bg: string
}

export const CONTRAST_PRESETS: ColorPreset[] = [
  { label: 'Dark UI', fg: '#f5f5f5', bg: '#1a1a1a' },
  { label: 'Light UI', fg: '#111111', bg: '#ffffff' },
  { label: 'Ocean Blue', fg: '#ffffff', bg: '#1d4ed8' },
  { label: 'Warning Yellow', fg: '#000000', bg: '#fbbf24' },
  { label: 'Success Green', fg: '#ffffff', bg: '#16a34a' },
  { label: 'Low Contrast', fg: '#888888', bg: '#aaaaaa' },
  { label: 'Red on Black', fg: '#ef4444', bg: '#000000' },
  { label: 'Slate', fg: '#0f172a', bg: '#e2e8f0' },
]

// Scale used to plot the ratio against the WCAG thresholds on the gauge.
// WCAG ratios run 1:1 (no contrast) to 21:1 (black on white).
export const RATIO_SCALE_MAX = 21
export const RATIO_THRESHOLDS = [
  { value: 3, label: 'AA Large' },
  { value: 4.5, label: 'AA' },
  { value: 7, label: 'AAA' },
] as const
