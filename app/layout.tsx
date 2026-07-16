import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: {
    default: 'Nexa Chat',
    template: '%s | Nexa Chat',
  },
  description:
    'Nexa Chat — real-time team communication. Channels, direct messages, and presence, built for the modern web.',
  icons: {
    icon: '/images/nexa-icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#6c63ff',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
