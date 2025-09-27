import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log("Received upload request");
    const file = formData.get("file") as File | null;
    console.log("wallet address:", formData.get("userAddress"));
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Extract other fields from the request body (assuming FormData)
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const tags = (formData.get("tags") as string)?.split(",") || [];
    const userAddress = (formData.get("userAddress") as string);

    if (!name || !description || !userAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Uploading to Walrus:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload file to publisher
    const response = await fetch(`${PUBLISHER}/v1/blobs`, {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream" },
      body: uint8Array,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Publisher error:", response.status, response.statusText, errorText);
      throw new Error(`Publisher upload failed: ${response.status} ${response.statusText}`);
    }

    const metadata = await response.json();
    const blobId = metadata?.newlyCreated?.blobObject?.blobId;
    if (!blobId) {
      console.error("Invalid response from publisher:", metadata);
      throw new Error("Invalid response from publisher");
    }
    // Save dataset to Prisma
    const dataset = await prisma.dataset.create({
      data: {
        name,
        filename: file.name,
        tags,
        description,
        owner: userAddress, // You may replace this with a proper owner if needed
        size: file.size,
        blobId,
        userAddress: userAddress,
      },
    });

    console.log("Dataset record created:", dataset);

    return NextResponse.json({ success: true, dataset, metadata , blobId });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
