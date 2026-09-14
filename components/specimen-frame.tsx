import type { ReactNode } from 'react'

/**
 * Registration-mark corners, borrowed from print/optics proofing sheets —
 * signals "this area is being measured" without adding chrome color.
 */
export function SpecimenFrame({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <Corner className="top-0 left-0 border-t-2 border-l-2" />
      <Corner className="top-0 right-0 border-t-2 border-r-2" />
      <Corner className="bottom-0 left-0 border-b-2 border-l-2" />
      <Corner className="bottom-0 right-0 border-b-2 border-r-2" />
      {children}
    </div>
  )
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-4 w-4 border-[var(--ink)] ${className}`}
    />
  )
}
