import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteNav } from "@/components/site-nav"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Datafyi — Dataset Access Platform",
  description: "Upload datasets to Walrus, search with AI, and access purchased blobs with Web3 payments.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SiteNav />
        <Suspense>
          <main className="min-h-dvh">{children}</main>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
