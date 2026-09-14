type LogoProps = {
  size?: number
  className?: string
}

/**
 * ContrastLab mark: a circle split exactly in half — one side solid ink,
 * one side the paper — the smallest possible demonstration of contrast.
 * Pure geometry, no gradients, legible from 16px favicons to 512px marks.
 */
export function Logo({ size = 24, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="ContrastLab"
    >
      <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#0a0a0a" strokeWidth="7" />
      <path d="M50 4 A46 46 0 0 0 50 96 Z" fill="#0a0a0a" />
      <line x1="50" y1="4" x2="50" y2="96" stroke="#0a0a0a" strokeWidth="7" />
    </svg>
  )
}
