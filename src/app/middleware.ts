import { NextRequest, NextResponse } from 'next/server';
import { paymentMiddleware, Network } from 'x402-next';
import prisma from '@/lib/prisma';

async function getPaymentConfig(id: string) {


  const dataset = await prisma.dataset.findUnique({
    where: {
      id: id,
    },
  });

  // If the dataset is not found, return a default config or handle the error
  if (!dataset) {
    throw new Error('Dataset not found');
  }

  return {
    price: `$${dataset.price}`,
    size : dataset.size,  // Format the price properly
    address: dataset.owner,
    network: 'polygon-amoya',
    description: dataset.description || 'Access to protected content',
  };
}

export const middleware = async (req: NextRequest) => {
  const { id } = req.nextUrl.pathname.split('/').pop(); // Get the 'id' from the URL

  if (!id) {
    return NextResponse.next();
  }

  // Fetch dynamic payment info
  const { price, size, address, network, description } = await getPaymentConfig(id);
  const total : Number = Number(price)*size;

  // Create middleware with dynamic config
  return paymentMiddleware(address, {
    [`/payment/${id}`]: {
      price: `$${total}`,
      network,
      config: {
        description,
      },
    },
  }, {
    url: 'https://x402.polygon.technology', // Add the facilitator URL here
  })(req);
};

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/payment/:id', 
  ],
};