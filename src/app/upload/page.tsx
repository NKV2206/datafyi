"use client"

import type React from "react"

import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { saveMyUpload } from "@/lib/storage"
import { randomWalrusId } from "@/lib/walrus"
import type { Dataset } from "@/lib/types"
import {useAccount} from "wagmi";
import { arDZ } from "date-fns/locale"
import { form } from "viem/chains"

export default function UploadPage() {
  const {address} = useAccount();
  const [file, setFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string>("")
  const [desc, setDesc] = useState("")
  const [status, setStatus] = useState<string>("")
  const [price, setPrice] = useState<string>("1.0");


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setStatus("Choose a file first.");
    setStatus("Uploading to Walrus...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name); // Dataset name
      formData.append("description", desc || "—"); // Dataset description
      formData.append("tags", tags); // Comma-separated tags
      formData.append("userAddress", address as string ); // Replace with actual logged-in user ID
      formData.append("price", price.toString());
      const res = await fetch("/api/walrus", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus(`Upload failed: ${result.error || "Unknown error"}`);
        return;
      }

      // Successful upload
      setStatus(`Uploaded • BlobID: ${result.blobId}`);
      setFile(null);
      setTags("");
      setDesc("");
    } catch (err) {
      console.error(err);
      setStatus("Upload failed due to a network or server error.");
    }
  };


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
            <Input
              type="number"
              step="0.0000001" // allow decimals
              min={0}
              placeholder="Price (USD) per Byte"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
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
