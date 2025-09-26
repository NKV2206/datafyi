"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { saveMyUpload } from "@/lib/storage"
import { randomWalrusId } from "@/lib/walrus"
import type { Dataset } from "@/lib/types"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string>("")
  const [desc, setDesc] = useState("")
  const [status, setStatus] = useState<string>("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return setStatus("Choose a file first.")
    setStatus("Uploading to Walrus...")
    // Simulate upload to Walrus and DB update
    const blobId = randomWalrusId()
    const dataset: Dataset = {
      id: crypto.randomUUID(),
      blobId,
      name: file.name,
      sizeMB: Math.max(1, Math.round(file.size / 1_000_000)),
      owner: "0xYOU",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      description: desc || "—",
    }
    saveMyUpload(dataset)
    setStatus(`Uploaded • BlobID: ${blobId}`)
    setFile(null)
    setTags("")
    setDesc("")
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Upload dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              aria-label="Choose dataset file"
            />
            <Input placeholder="tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
            <Textarea placeholder="Short description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <div className="flex items-center gap-2">
              {tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 5)
                .map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
            </div>
            <Button type="submit" className="bg-[var(--brand)] text-[var(--on-brand)] hover:opacity-90">
              Upload to Walrus
            </Button>
            <p className="text-sm text-muted-foreground">{status}</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
