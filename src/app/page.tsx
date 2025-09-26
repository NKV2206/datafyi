"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="px-6 md:px-10 lg:px-16 py-10">
      <header className="max-w-5xl">
        <h1 className="text-balance text-4xl md:text-6xl font-semibold tracking-tight">
          Datafyi: secure, reliable, and built to power your data access journey.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-6">
          Upload datasets with tags and descriptions. Search via AI. Pay per size. Get Walrus BlobIDs instantly.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button asChild size="lg" className="bg-[var(--brand)] text-[var(--on-brand)] hover:opacity-90">
            <Link href="/search">Search Datasets</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/upload">Upload Data</Link>
          </Button>
        </div>
      </header>

      <section className="mt-12 grid md:grid-cols-3 gap-4">
        <Stat label="Total Users" value="15K+" />
        <Stat label="Datasets Indexed" value="400+" />
        <Stat label="Executed Purchases" value="25M" />
      </section>

      {/* <aside className="mt-10">
        <Card>
          <CardContent className="p-4 text-xs text-muted-foreground">
            Inspired by clean fintech hero layouts — adapted to a web3 dark theme.
            <img
              src="/images/hero-inspiration.png"
              alt="Reference layout inspiration"
              className="mt-3 w-full max-w-md rounded-md opacity-70"
            />
          </CardContent>
        </Card>
      </aside> */}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  )
}
