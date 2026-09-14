import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ContrastLab — WCAG Color Contrast & Accessibility Studio',
  description:
    'Check WCAG 2.1 & 2.2 color contrast ratios in real-time. Test UI components, verify AAA/AA compliance, and generate accessible pairings.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-50 text-slate-900 antialiased selection:bg-amber-500/20 selection:text-amber-900`}>
        {children}
      </body>
    </html>
  )
}
