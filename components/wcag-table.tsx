import { Check, X } from 'lucide-react'
import type { WcagLevels } from '@/lib/contrast'

const ROWS: { key: keyof WcagLevels; label: string; requirement: string }[] = [
  { key: 'normalAA', label: 'Normal text', requirement: 'AA · 4.5:1' },
  { key: 'normalAAA', label: 'Normal text', requirement: 'AAA · 7:1' },
  { key: 'largeAA', label: 'Large text', requirement: 'AA · 3:1' },
  { key: 'largeAAA', label: 'Large text', requirement: 'AAA · 4.5:1' },
]

export function WcagTable({ levels }: { levels: WcagLevels }) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">WCAG 2.1 compliance results for the current color pair</caption>
      <thead>
        <tr className="border-b border-[var(--line)] text-xs tracking-[0.1em] text-[var(--ink-muted)] uppercase">
          <th scope="col" className="py-2 font-medium">
            Text category
          </th>
          <th scope="col" className="py-2 font-medium">
            Requirement
          </th>
          <th scope="col" className="py-2 text-right font-medium">
            Result
          </th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row) => {
          const pass = levels[row.key]
          return (
            <tr key={row.key} className="border-b border-[var(--line)] last:border-0">
              <td className="py-3 text-base text-[var(--ink)]">{row.label}</td>
              <td className="py-3 font-mono text-sm text-[var(--ink-muted)]">{row.requirement}</td>
              <td className="py-3 text-right">
                <span
                  className={
                    'inline-flex items-center gap-1.5 border px-2 py-1 text-xs font-semibold tracking-wide uppercase ' +
                    (pass
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                      : 'border-[var(--ink)] border-dashed bg-transparent text-[var(--ink)]')
                  }
                >
                  {pass ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
                  {pass ? 'Pass' : 'Fail'}
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
