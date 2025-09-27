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
          Datafyi: The web3-secure dataset marketplace with first-class Agentic AI compliancy.
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
<section className="mt-16 max-w-5xl mx-auto overflow-hidden relative z-10">
  {/* Logo Section */}
  <div className="flex justify-center gap-8 mb-8">
    {/* Walrus Logo */}
    <div className="w-32 h-32 bg-gray-800 rounded-lg flex justify-center items-center overflow-hidden">
      <img src="/walrus.jpg" alt="Walrus" className="w-full h-full object-cover rounded-lg" />
    </div>
  </div>

  {/* Scrollable Text Section */}
  <div className="whitespace-nowrap animate-scroll text-gray-300 text-lg flex justify-center items-center">
    Define 3 specialised agents with our SDK and access the world's data at your fingertips.
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
