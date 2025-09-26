import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

export async function GET(
  req: Request,
  { params }: { params: { datasetId: string } }
) {
  try {
    const { datasetId } = params;

    // TODO: Retrieve from DB:
    // const { fileType, originalName } = await db.getFile(blobId);
    // For demo purposes, hardcoding like your express example:
    const dataset = await prisma.dataset.findUnique({
      where: { id: parseInt(datasetId, 10) },
    });
    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }
    const blobId = dataset.blobId;
    if (!blobId) {
      return NextResponse.json({ error: "Blob ID not found for dataset" }, { status: 404 });
    }
    const originalName = dataset.filename;
    console.log("Fetching blob:", { blobId, originalName });
    const downloadUrl = `${AGGREGATOR}/v1/blobs/${blobId}`;
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${originalName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Failed to fetch blob" }, { status: 500 });
  }
}
