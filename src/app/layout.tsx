import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brick Breaker Game',
  description: 'Простая игра в стиле Brick Breaker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
          {children}
        </div>
      </body>
    </html>
  )
}