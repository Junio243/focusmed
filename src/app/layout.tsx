import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'

import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'FocusMed - Study with measurable focus',
  description: 'Revenue-first EdTech for health students with adaptive study workflows.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
