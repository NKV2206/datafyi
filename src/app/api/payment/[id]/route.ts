import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const datasetId = Number.parseInt(id, 10);

    if (!Number.isFinite(datasetId)) {
      return NextResponse.json(
        { error: "Invalid dataset id" },
        { status: 400 }
      );
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      select: { blobId: true },
    });

    if (!dataset) {
      return NextResponse.json(
        { error: "Dataset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blobId: dataset.blobId });
  } catch (err) {
    console.error("GET /payment/[did] error", err);
    return NextResponse.json(
      { error: "Failed to resolve blob id" },
      { status: 500 }
    );
  }
}