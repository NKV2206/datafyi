import express from "express";
import { paymentMiddleware } from "x402-express";
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

async function getPaymentConfig(id) {
  console.log(`[X402 Express] Getting payment config for dataset ID: ${id}`);

  const dataset = await prisma.dataset.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });

  if (!dataset) {
    console.log(`[X402 Express] Dataset not found for ID: ${id}`);
    throw new Error('Dataset not found');
  }

  console.log(`[X402 Express] Found dataset:`, {
    id: dataset.id,
    name: dataset.name,
    owner: dataset.owner,
    size: dataset.size,
    price: dataset.price || 0
  });

  return {
    price: dataset.price || 0.01,
    size: dataset.size,
    address: dataset.owner,
    network: 'polygon-amoy',
    description: dataset.description || 'Access to protected content',
  };
}

// Apply x402 only to /payment/:id, with dynamic config like Next.js
app.use("/payment/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const { price, size, address, network, description } = await getPaymentConfig(id);
    const total = price * size;

    console.log(`[X402 Express] Payment configuration:`, {
      price,
      size,
      total,
      address,
      network,
      description
    });

    const middleware = paymentMiddleware(
      '0x951f2210269f0f0EA8B9771FDC28e4634654e10F',
      {
        [`GET /payment/${id}`]: {
          price: `$${total}`,
          network: network,
          config: {
            description,
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string", description: "Dataset ID" }
              }
            },
            outputSchema: {
              type: "object",
              properties: {
                blobId: { type: "string" }
              }
            }
          }
        },
      },
      {
        url: process.env.FACILITATOR_URL || "https://x402.polygon.technology",
      }
    );

    return middleware(req, res, next);
  } catch (error) {
    console.error(`[X402 Express] Error processing payment for dataset ${id}:`, error);
    return res.status(500).json({ error: "Payment configuration failed" });
  }
});

// Synonymous route to Next.js payment/[id]
app.get("/payment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const datasetId = Number.parseInt(id, 10);

    if (!Number.isFinite(datasetId)) {
      return res.status(400).json({ error: "Invalid dataset id" });
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      select: { blobId: true },
    });

    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    res.json({ blobId: dataset.blobId });
  } catch (err) {
    console.error("GET /payment/:id error", err);
    res.status(500).json({ error: "Failed to resolve blob id" });
  }
});

app.listen(4021, () => {
  console.log(`Server listening at http://localhost:4021`);
  console.log(`Try: GET http://localhost:4021/payment/123`);
}); 