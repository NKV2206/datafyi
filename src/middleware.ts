import { NextRequest, NextResponse } from 'next/server';
import { paymentMiddleware, Network } from 'x402-next';
import prisma from '@/lib/prisma';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

async function getPaymentConfig(id: string) {
  console.log(`[X402 Middleware] Getting payment config for dataset ID: ${id}`);

  const dataset = await prisma.dataset.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });

  // If the dataset is not found, return a default config or handle the error
  if (!dataset) {
    console.log(`[X402 Middleware] Dataset not found for ID: ${id}`);
    throw new Error('Dataset not found');
  }

  console.log(`[X402 Middleware] Found dataset:`, {
    id: dataset.id,
    name: dataset.name,
    owner: dataset.owner,
    size: dataset.size,
    price: dataset.price || 0
  });

  return {
    price: dataset.price || 0.01, // Use actual price or default
    size: dataset.size,
    address: dataset.owner,
    network: 'polygon-amoy',
    description: dataset.description || 'Access to protected content',
  };
}

export const middleware = async (req: NextRequest) => {
  console.log(`[X402 Middleware] Processing request: ${req.method} ${req.url}`);
  
  const pathSegments = req.nextUrl.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1]; // Get the 'id' from the URL

  console.log(`[X402 Middleware] Extracted ID from URL: ${id}`);

  if (!id) {
    console.log(`[X402 Middleware] No ID found, skipping payment middleware`);
    return NextResponse.next();
  }

  try {
    // Fetch dynamic payment info
    const { price, size, address, network, description } = await getPaymentConfig(id);
    const total = price * size;

    console.log(`[X402 Middleware] Payment configuration:`, {
      price,
      size,
      total,
      address,
      network,
      description
    });

    console.log(`[X402 Middleware] Initiating x402 payment verification for dataset ${id}`);

    // Create middleware with dynamic config
    const result = await paymentMiddleware(address, {
      [`/api/payment/${id}`]: {
        price: `$${total}`,
        network: "polygon-amoy",
        config: {
          description,
        },
      },
    }, {
      url: 'https://x402.polygon.technology', // Add the facilitator URL here
    })(req);

    console.log(`[X402 Middleware] Payment middleware result:`, {
      status: result.status,
      statusText: result.statusText,
      url: result.url
    });

    return result;
  } catch (error) {
    console.error(`[X402 Middleware] Error processing payment for dataset ${id}:`, error);
    return NextResponse.next();
  }
};

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/payment/:id*', 
  ],
};