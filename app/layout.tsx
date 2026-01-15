import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Block Destroy - Break Blocks Game",
  description:
    "An addictive block breaker game with dynamic colors and progressive difficulty. Play Block Destroy online now!",
  keywords: ["block breaker", "game", "block destroy", "puzzle", "arcade"],
  authors: [{ name: "Block Destroy" }],
  generator: "v0.app",
  applicationName: "Block Destroy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Block Destroy",
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
    title: "Block Destroy - Break Blocks Game",
    description: "An addictive block breaker game with dynamic colors and progressive difficulty",
    type: "website",
    siteName: "Block Destroy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Block Destroy",
    description: "Play the ultimate block breaker game",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}