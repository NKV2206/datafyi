"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="relative px-6 md:px-10 lg:px-16 py-16 min-h-screen text-gray-100 overflow-x-hidden">
      {/* Dark vignette for readability without washing out plasma */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_70%)]" />

      <header className="relative max-w-5xl mx-auto text-center z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Datafyi: secure, reliable, and built to power your data access journey.
        </h1>
        <p className="text-gray-300 mt-4 max-w-3xl mx-auto leading-7">
          Upload datasets with tags and descriptions. Search via AI. Pay per size. Get Walrus BlobIDs instantly.
        </p>

        <div className="mt-8 flex justify-center items-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-[var(--brand)] text-[var(--on-brand)] hover:opacity-90 rounded-lg shadow-md transition-all hover:shadow-xl"
          >
            <Link href="/search">Search Datasets</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <Link href="/upload">Upload Data</Link>
          </Button>
        </div>
      </header>

      <section className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
        <Stat label="Total Users" value="15K+" />
        <Stat label="Datasets Indexed" value="400+" />
        <Stat label="Executed Purchases" value="25M" />
      </section>

      <section className="mt-16 max-w-5xl mx-auto overflow-hidden relative z-10">
        <div className="whitespace-nowrap animate-scroll text-gray-300 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. &nbsp;&nbsp;&nbsp; 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. &nbsp;&nbsp;&nbsp;
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. &nbsp;&nbsp;&nbsp;
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. &nbsp;&nbsp;&nbsp;
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition-transform">
      <CardContent className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
        <div className="text-gray-300 mt-2">{label}</div>
      </CardContent>
    </Card>
  )
}
