"use client"

import { getMyUploads, getMyPurchases } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MyDataPage() {
  const uploads = getMyUploads()
  const purchases = getMyPurchases()
  const totalEarned = 0 // Placeholder — would come from backend settlements
  const totalSpent = purchases.reduce((s, p) => s + p.totalPrice, 0)

  return (
    <div className="px-6 md:px-10 lg:px-16 py-10 space-y-8">
      <section className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>My Datasets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploads.length === 0 && <p className="text-muted-foreground text-sm">No uploads yet.</p>}
            {uploads.map((u) => (
              <div key={u.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.sizeMB} MB</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{u.description}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {u.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">Walrus BlobID:</span> {u.blobId}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Total Earned</span>
              <span className="font-semibold">{totalEarned.toFixed(6)} ETH</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="font-semibold">{totalSpent.toFixed(6)} ETH</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>My Purchases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {purchases.length === 0 && <p className="text-muted-foreground text-sm">No purchases yet.</p>}
            {purchases.map((p) => (
              <div key={p.at} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    Query: <span className="font-medium">{p.query}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.totalMB} MB • {p.totalPrice.toFixed(6)} ETH
                  </div>
                </div>
                <div className="mt-2 text-xs">
                  <div className="text-muted-foreground">BlobIDs</div>
                  <ul className="list-disc ml-5 mt-1">
                    {p.blobIds.map((b) => (
                      <li key={b} className="break-all">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
