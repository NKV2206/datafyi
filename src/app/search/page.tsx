"use client"

import useSWR from "swr"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { priceForMB } from "@/lib/pricing"
import type { Dataset } from "@/lib/types"
import { savePurchase } from "@/lib/storage"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SearchPage() {
  const [q, setQ] = useState("")
  const { data, isLoading } = useSWR<{ results: Dataset[] }>(
    q ? `/api/search?q=${encodeURIComponent(q)}` : null,
    fetcher,
  )
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const results = data?.results ?? []
  const selectedItems = results.filter((r) => selected[r.id])
  const totalMB = selectedItems.reduce((sum, r) => sum + r.sizeMB, 0)
  const totalPrice = totalMB * priceForMB

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }))

  const buy = async () => {
    if (selectedItems.length === 0) return
    const resp = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ ids: selectedItems.map((s) => s.id) }),
    })
    const payload = await resp.json()
    // Save into "My Data" purchases with the query and blobIDs
    savePurchase({
      query: q,
      blobIds: payload.blobIds as string[],
      totalMB,
      totalPrice,
      at: new Date().toISOString(),
      files: selectedItems.map((i) => ({ id: i.id, name: i.name })),
    })
    setSelected({})
    alert(`Payment simulated ✓\nBlobIDs:\n${payload.blobIds.join("\n")}`)
  }

  return (
    <div className="px-6 md:px-10 lg:px-16 py-8">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search datasets (e.g., Delhi)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-lg"
        />
        <Button onClick={() => {}} disabled variant="secondary" title="Type to search — results load automatically">
          Search
        </Button>
      </div>

      <div className="mt-6">
        {isLoading && <p className="text-muted-foreground">Searching with AI…</p>}
        {!isLoading && q && results.length === 0 && <p className="text-muted-foreground">No datasets found.</p>}
        {!isLoading && results.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <div role="table" className="w-full">
                <div role="row" className="grid grid-cols-12 px-4 py-3 text-sm text-muted-foreground border-b">
                  <div className="col-span-1">Pick</div>
                  <div className="col-span-3">File</div>
                  <div className="col-span-2">Owner</div>
                  <div className="col-span-1 text-right">Size</div>
                  <div className="col-span-2">Tags</div>
                  <div className="col-span-3">Description</div>
                </div>
                {results.map((r) => (
                  <div role="row" key={r.id} className="grid grid-cols-12 items-start px-4 py-3 border-b/50">
                    <div className="col-span-1">
                      <Checkbox checked={!!selected[r.id]} onCheckedChange={() => toggle(r.id)} />
                    </div>
                    <div className="col-span-3 font-medium">{r.name}</div>
                    <div className="col-span-2 text-xs">{r.owner}</div>
                    <div className="col-span-1 text-right">{r.sizeMB} MB</div>
                    <div className="col-span-2 flex flex-wrap gap-1">
                      {r.tags.slice(0, 4).map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="col-span-3 text-sm text-muted-foreground">{r.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <SummaryBar count={selectedItems.length} totalMB={totalMB} totalPrice={totalPrice} onBuy={buy} />
    </div>
  )
}

function SummaryBar({
  count,
  totalMB,
  totalPrice,
  onBuy,
}: {
  count: number
  totalMB: number
  totalPrice: number
  onBuy: () => void
}) {
  const disabled = count === 0
  return (
    <div className="sticky bottom-4 mt-8">
      <div className="mx-auto max-w-4xl rounded-lg border bg-card px-4 py-3 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-muted-foreground">Selected:</span> <strong>{count}</strong> file(s) •{" "}
          <strong>{totalMB} MB</strong> • <span className="text-[var(--brand)]">{totalPrice.toFixed(6)} ETH</span>
        </div>
        <Button
          disabled={disabled}
          onClick={onBuy}
          className="bg-[var(--brand)] text-[var(--on-brand)] hover:opacity-90"
        >
          Buy Selected
        </Button>
      </div>
    </div>
  )
}
