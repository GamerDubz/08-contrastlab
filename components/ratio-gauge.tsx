import { RATIO_SCALE_MAX, RATIO_THRESHOLDS } from '@/lib/contrast'

export function RatioGauge({ ratio }: { ratio: number }) {
  const clamped = Math.min(ratio, RATIO_SCALE_MAX)
  const pointerPct = (clamped / RATIO_SCALE_MAX) * 100

  return (
    <div
      className="w-full"
      role="img"
      aria-label={`Contrast ratio ${ratio.toFixed(2)} to 1 on a scale from 1 to ${RATIO_SCALE_MAX}, with WCAG thresholds marked at 3, 4.5 and 7`}
    >
      <div className="relative h-2 w-full bg-[var(--line)]">
        <div className="absolute inset-y-0 left-0 bg-[var(--ink)]" style={{ width: `${pointerPct}%` }} />
        {RATIO_THRESHOLDS.map((t) => (
          <span
            key={t.value}
            aria-hidden="true"
            className="absolute top-0 h-2 w-px bg-[var(--paper)]"
            style={{ left: `${(t.value / RATIO_SCALE_MAX) * 100}%` }}
          />
        ))}
        <span
          aria-hidden="true"
          className="absolute -top-1.5 h-5 w-0.5 -translate-x-1/2 bg-[var(--ink)]"
          style={{ left: `${pointerPct}%` }}
        />
      </div>
      <div className="relative mt-1.5 h-4 text-[11px] font-medium tracking-wide text-[var(--ink-muted)] uppercase">
        {RATIO_THRESHOLDS.map((t) => (
          <span
            key={t.value}
            aria-hidden="true"
            className="absolute -translate-x-1/2 font-mono"
            style={{ left: `${(t.value / RATIO_SCALE_MAX) * 100}%` }}
          >
            {t.value}
          </span>
        ))}
      </div>
    </div>
  )
}
