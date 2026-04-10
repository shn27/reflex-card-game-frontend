import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reflex — Card Duel',
  description: 'React fast. Hit the Ace.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}