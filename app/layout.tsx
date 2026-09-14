import type { Metadata } from 'next'
import { Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ContrastLab — WCAG Color Contrast Checker',
  description:
    'Measure the WCAG 2.1 contrast ratio between two colors, check AA/AAA compliance for normal and large text, and find accessible color pairs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${instrumentSans.variable} ${ibmPlexMono.variable}`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
