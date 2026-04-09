import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reflex',
  description: 'React fast. Hit the ace.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}