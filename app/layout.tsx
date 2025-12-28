import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scholar - Academic Ecosystem',
  description: 'Research lab, community operations, and academic collaboration platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}

