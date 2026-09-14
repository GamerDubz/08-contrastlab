'use client'

import { useCallback, useMemo, useState } from 'react'
import { ArrowLeftRight, TriangleAlert } from 'lucide-react'
import { Logo } from '@/components/logo'
import { ColorSwatchPanel } from '@/components/color-swatch-panel'
import { RatioGauge } from '@/components/ratio-gauge'
import { WcagTable } from '@/components/wcag-table'
import { PresetGrid } from '@/components/preset-grid'
import { SpecimenFrame } from '@/components/specimen-frame'
import { contrastRatio, getWcagLevels, isValidHex } from '@/lib/contrast'

const DEFAULT_FG = '#f5f5f5'
const DEFAULT_BG = '#1a1a1a'

export default function ContrastLabPage() {
  const [fg, setFg] = useState(DEFAULT_FG)
  const [bg, setBg] = useState(DEFAULT_BG)
  const [fgInput, setFgInput] = useState(DEFAULT_FG)
  const [bgInput, setBgInput] = useState(DEFAULT_BG)

  const handleFgInput = useCallback((value: string) => {
    setFgInput(value)
    if (isValidHex(value)) setFg(value)
  }, [])

  const handleBgInput = useCallback((value: string) => {
    setBgInput(value)
    if (isValidHex(value)) setBg(value)
  }, [])

  const setPair = useCallback((nextFg: string, nextBg: string) => {
    setFg(nextFg)
    setFgInput(nextFg)
    setBg(nextBg)
    setBgInput(nextBg)
  }, [])

  const swap = useCallback(() => {
    setPair(bg, fg)
  }, [bg, fg, setPair])

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg])
  const levels = useMemo(() => (ratio ? getWcagLevels(ratio) : null), [ratio])
  const ratioDisplay = ratio ? ratio.toFixed(2) : '—'

  return (
    <div className="min-h-full">
      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-5 sm:px-10">
          <Logo size={28} />
          <div>
            <p className="text-base font-bold tracking-[0.08em] uppercase">ContrastLab</p>
            <p className="font-mono text-xs text-[var(--ink-faint)]">WCAG 2.1 contrast instrument</p>
          </div>
          <span className="ml-auto hidden border border-[var(--line)] px-2.5 py-1 font-mono text-xs text-[var(--ink-muted)] sm:inline-block">
            SC 1.4.3 / 1.4.6
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14">
        {/* The instrument: two color panels with the measurement between them */}
        <section aria-labelledby="measure-heading">
          <h1 id="measure-heading" className="sr-only">
            Measure the contrast ratio between two colors
          </h1>

          <div className="flex flex-col gap-0 md:flex-row md:items-stretch">
            <ColorSwatchPanel
              role="Foreground"
              hexInput={fgInput}
              committedColor={fg}
              onHexChange={handleFgInput}
              onColorChange={(v) => setPair(v, bg)}
            />

            <div className="flex shrink-0 items-center justify-center py-3 md:w-14 md:py-0">
              <button
                type="button"
                onClick={swap}
                className="flex h-11 w-11 items-center justify-center border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                aria-label="Swap foreground and background colors"
              >
                <ArrowLeftRight size={18} className="rotate-90 md:rotate-0" aria-hidden="true" />
              </button>
            </div>

            <ColorSwatchPanel
              role="Background"
              hexInput={bgInput}
              committedColor={bg}
              onHexChange={handleBgInput}
              onColorChange={(v) => setPair(fg, v)}
            />
          </div>

          {/* Ratio readout */}
          <div className="mt-8 border border-[var(--line)] p-6 sm:p-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs tracking-[0.15em] text-[var(--ink-faint)] uppercase">
                  Contrast ratio
                </p>
                <p className="mt-1 font-mono text-6xl leading-none font-semibold tabular-nums sm:text-7xl">
                  {ratioDisplay}
                  <span className="ml-2 text-2xl text-[var(--ink-faint)] sm:text-3xl">:1</span>
                </p>
              </div>
              {levels && (
                <p className="font-mono text-sm text-[var(--ink-muted)]">
                  {levels.normalAAA
                    ? 'Meets AAA for normal text'
                    : levels.normalAA
                      ? 'Meets AA for normal text'
                      : levels.largeAA
                        ? 'Meets AA for large text only'
                        : 'Fails minimum WCAG contrast'}
                </p>
              )}
            </div>

            {ratio && (
              <div className="mt-6">
                <RatioGauge ratio={ratio} />
              </div>
            )}
          </div>
        </section>

        {/* Live specimen preview */}
        <section className="mt-10" aria-labelledby="specimen-heading">
          <h2
            id="specimen-heading"
            className="mb-3 font-mono text-xs tracking-[0.15em] text-[var(--ink-faint)] uppercase"
          >
            Specimen preview
          </h2>
          <SpecimenFrame>
            <div className="p-8 sm:p-10" style={{ backgroundColor: bg, color: fg }}>
              <p className="mb-2 text-3xl font-bold sm:text-4xl">Large text sample</p>
              <p className="mb-3 max-w-prose text-base">
                This is normal-size body copy, set the way it would appear in a real interface, so
                you can judge legibility rather than trust the number alone.
              </p>
              <p className="text-sm opacity-80">Small print at 14px — the first place low contrast is felt.</p>
            </div>
          </SpecimenFrame>
        </section>

        {/* Compliance table */}
        {levels && (
          <section className="mt-10" aria-labelledby="compliance-heading">
            <h2
              id="compliance-heading"
              className="mb-3 font-mono text-xs tracking-[0.15em] text-[var(--ink-faint)] uppercase"
            >
              WCAG 2.1 compliance
            </h2>
            <div className="border border-[var(--line)] px-5">
              <WcagTable levels={levels} />
            </div>
            <p className="mt-2 text-base text-[var(--ink-muted)]">
              Large text is 18pt+, or 14pt+ and bold. Non-text UI elements follow the 3:1 minimum.
            </p>
          </section>
        )}

        {/* Suggestion */}
        {ratio && ratio < 4.5 && (
          <section className="mt-6" aria-live="polite">
            <div className="flex gap-3 border border-dashed border-[var(--ink)] p-4">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-base text-[var(--ink)]">
                <strong className="font-semibold">Suggestion —</strong> darken the foreground or
                lighten the background to reach AA (4.5:1). Current ratio is {ratio.toFixed(2)}:1,
                about {(4.5 / ratio * 100 - 100).toFixed(0)}% short.
              </p>
            </div>
          </section>
        )}

        {/* Reference presets */}
        <section className="mt-10" aria-labelledby="presets-heading">
          <h2
            id="presets-heading"
            className="mb-3 font-mono text-xs tracking-[0.15em] text-[var(--ink-faint)] uppercase"
          >
            Reference pairs
          </h2>
          <PresetGrid onSelect={setPair} />
        </section>
      </main>

      <footer className="mt-16 border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-base text-[var(--ink-faint)] sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>Contrast ratios computed per the WCAG 2.1 relative luminance formula.</p>
          <a
            href="https://www.w3.org/TR/WCAG21/#contrast-minimum"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--ink)]"
          >
            Read the specification
          </a>
        </div>
      </footer>
    </div>
  )
}
