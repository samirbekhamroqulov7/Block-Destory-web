import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Block Description - Break Blocks Game",
  description:
    "An addictive block breaker game with dynamic colors and progressive difficulty. Play Block Description online now!",
  keywords: ["block breaker", "game", "block description", "puzzle", "arcade"],
  authors: [{ name: "Block Description" }],
  generator: "v0.app",
  applicationName: "Block Description",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Block Description",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Block Description - Break Blocks Game",
    description: "An addictive block breaker game with dynamic colors and progressive difficulty",
    type: "website",
    siteName: "Block Description",
  },
  twitter: {
    card: "summary_large_image",
    title: "Block Description",
    description: "Play the ultimate block breaker game",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
