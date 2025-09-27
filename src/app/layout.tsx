import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteNav } from "@/components/site-nav"
import { Suspense } from "react"
import { WalletProvider } from "@/providers/wallet-provider"
import {PlasmaBackground} from "@/components/plasma-background";
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
    <html lang="en" className="dark h-full">
      <body className={`h-full font-sans ${GeistSans.variable} ${GeistMono.variable} bg-transparent`}>        
        <PlasmaBackground />
        <WalletProvider>
          <SiteNav />
          <Suspense>
            <main className="relative z-10 min-h-screen">{children}</main>
          </Suspense>
          <Analytics />
        </WalletProvider>
      </body>
    </html>
  )
}
