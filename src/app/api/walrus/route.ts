import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("Uploading to Walrus:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const response = await fetch(`${PUBLISHER}/v1/blobs`, {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream" },
      body: uint8Array,
    });
    prisma.dataset.create({
      data: {
        name: "Test Dataset",
        filename: file.name,
        tags: ["test", "walrus"],
        description: "A test dataset uploaded to Walrus",
        owner: "0xTestOwnerAddress",
        size: file.size,
        blobId: "temp-blob-id", // Placeholder, will update after upload
        userId: 1, // Assuming a user with ID 1 exists
      },
    }).then((dataset) => {
      console.log("Dataset record created:", dataset);
    }).catch((err) => {
      console.error("Error creating dataset record:", err);
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Publisher error:", response.status, response.statusText, errorText);
      throw new Error(`Publisher upload failed: ${response.status} ${response.statusText}`);
    }

    const metadata = await response.json();
    const blobId = metadata?.newlyCreated?.blobObject?.blobId;
    const fileType = file.type;
    const originalName = file.name;

    console.log("Saved metadata:", { blobId, fileType, originalName, metadata });

    return NextResponse.json({ success: true, blobId, fileType, originalName, metadata });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
