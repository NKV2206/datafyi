import { NextResponse } from "next/server"
import { SAMPLE_DATASETS } from "../_sample-data"

// Simple filter: looks in name, tags, description (case-insensitive)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").trim().toLowerCase()
  if (!q) return NextResponse.json({ results: [] })
  const match = (s: string) => s.toLowerCase().includes(q)
  const results = SAMPLE_DATASETS.filter((d) => match(d.name) || match(d.description) || d.tags.some((t) => match(t)))
  // Note: BlobID intentionally not removed here since this is demo data.
  return NextResponse.json({ results })
}
