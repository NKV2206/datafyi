import { NextResponse } from "next/server"
import { SAMPLE_DATASETS } from "../_sample-data"
import { priceForMB } from "@/lib/pricing"

// Simulates a smart-contract payment and returns blobIds
export async function POST(req: Request) {
  const body = await req.json()
  const ids = (body?.ids || []) as string[]
  const picks = SAMPLE_DATASETS.filter((d) => ids.includes(d.id))
  const totalMB = picks.reduce((s, d) => s + d.sizeMB, 0)
  const totalPrice = totalMB * priceForMB
  // Pretend txHash is created, on-chain payment succeeds.
  const txHash =
    "0x" +
    Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  const blobIds = picks.map((p) => p.blobId)
  return NextResponse.json({ txHash, totalMB, totalPrice, blobIds })
}
