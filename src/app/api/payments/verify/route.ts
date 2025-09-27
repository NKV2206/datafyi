import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPublicClient, http, decodeEventLog, Hex, parseUnits } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { Prisma } from '@prisma/client';

// Minimal ERC20 Transfer event ABI
const TRANSFER_EVENT_ABI = [
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
] as const;

const PYUSD_DECIMALS = 6;

function getPyUsdAddress() {
  const addr = (process.env.PYUSD_ADDRESS || process.env.NEXT_PUBLIC_PYUSD_CONTRACT) as `0x${string}` | undefined;
  if (!addr) throw new Error('PYUSD contract address env var missing (PYUSD_ADDRESS or NEXT_PUBLIC_PYUSD_CONTRACT)');
  return addr;
}

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(process.env.ARBITRUM_SEPOLIA_RPC_URL || process.env.ETH_RPC_URL),
});

/*
POST body: { datasetId: number, txHash: string, buyer: string }
Verifies that txHash is a PYUSD Transfer from buyer -> dataset.owner for expected amount (dataset.price * dataset.size).
If dataset not found and DEMO fallback enabled (datasetId 999999) returns a demo blobId after only receipt status check.
Environment overrides:
  ENABLE_DEMO_VERIFY=1         => allow demo dataset unlock even if not in DB
  BYPASS_TOKEN_EVENT_CHECK=1   => if set, skip Transfer log matching (use ONLY receipt success) (DEV ONLY!)
*/
export async function POST(req: Request) {
  try {
    const { datasetId, txHash, buyer } = await req.json();

    if (!datasetId || !txHash || !buyer) {
      return NextResponse.json({ error: 'datasetId, txHash, buyer required' }, { status: 400 });
    }

    const enableDemo = process.env.ENABLE_DEMO_VERIFY === '1';
    const bypassEvent = process.env.BYPASS_TOKEN_EVENT_CHECK === '1';

    let dataset = await prisma.dataset.findUnique({ where: { id: Number(datasetId) } });
    // Demo fallback (not persisted) so verification flow can continue in hack/testing mode
    let isDemo = false;
    if (!dataset && enableDemo && Number(datasetId) === 999999) {
      isDemo = true;
      dataset = {
        id: 999999,
        name: 'Demo Test Dataset',
        filename: 'demo.csv',
        tags: ['demo','test'],
        description: 'Temporary demo dataset',
        owner: '0xe3F3ee3a5d1Cf8b03E99eA9F1a22ee2eb7048829',
        size: 10,
        blobId: 'FAKE_BLOB_ID_TEST',
        userAddress: '0xe3F3ee3a5d1Cf8b03E99eA9F1a22ee2eb7048829',
        price: new Prisma.Decimal(0.001),
      } as any; // casting for demo object
    }
    if (!dataset) return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });

    // Idempotency only if real dataset is in DB
    if (!isDemo) {
      const existing = await prisma.transaction.findFirst({
        where: {
          agentId: buyer,
          TransactionDataset: { some: { datasetId: dataset.id } },
        },
      });
      if (existing) {
        return NextResponse.json({ verified: true, alreadyRecorded: true, transactionId: existing.id, blobId: dataset.blobId });
      }
    }

    const receipt = await publicClient.getTransactionReceipt({ hash: txHash as Hex });
    if (receipt.status !== 'success') {
      return NextResponse.json({ error: 'Transaction not successful' }, { status: 400 });
    }

    let matched = false;
    let expectedHuman = '0';
    let expectedUnits = BigInt(0);

    if (bypassEvent || isDemo) {
      matched = true; // trust receipt only (DEV MODE)
    } else {
      const tokenAddress = getPyUsdAddress().toLowerCase();
      const buyerLower = buyer.toLowerCase();
      const ownerLower = dataset.owner.toLowerCase();

      const priceDecimal = dataset.price instanceof Prisma.Decimal ? dataset.price : new Prisma.Decimal(dataset.price as any);
      const expectedAmountDecimal = priceDecimal.mul(dataset.size);
      expectedHuman = expectedAmountDecimal.toString();
      expectedUnits = parseUnits(expectedHuman, PYUSD_DECIMALS);

      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== tokenAddress) continue;
        try {
          const decoded = decodeEventLog({ abi: TRANSFER_EVENT_ABI, data: log.data, topics: log.topics });
          if (decoded.eventName === 'Transfer') {
            const { from, to, value } = decoded.args as { from: string; to: string; value: bigint };
            if (from.toLowerCase() === buyerLower && to.toLowerCase() === ownerLower && value === expectedUnits) {
              matched = true;
              break;
            }
          }
        } catch (_) { /* ignore */ }
      }
    }

    if (!matched) {
      return NextResponse.json({ error: 'Token transfer event not found (and bypass not enabled)' }, { status: 400 });
    }

    // Persist only if not demo
    let txRecord: any = null;
    if (!isDemo) {
      await prisma.user.upsert({ where: { address: buyer }, update: {}, create: { address: buyer } });
      const amountFloat = parseFloat(expectedHuman);
      txRecord = await prisma.transaction.create({
        data: {
          agentId: buyer,
          amountsPaid: [isNaN(amountFloat) ? 0 : amountFloat],
          totalAmount: isNaN(amountFloat) ? 0 : amountFloat,
          TransactionDataset: { create: { datasetId: dataset.id } },
        },
        include: { TransactionDataset: true },
      });
    }

    // Provide blob access info
    const blobId = dataset.blobId;
    const downloadUrl = `/api/walrus/${isDemo ? 'blob/' + blobId : dataset.id}`; // demo uses blob route (will create) real uses id route

    return NextResponse.json({
      verified: true,
      datasetId: dataset.id,
      txHash,
      blobId,
      downloadUrl,
      isDemo,
      transactionId: txRecord?.id || null,
    });
  } catch (e: any) {
    console.error('Verify payment error', e);
    return NextResponse.json({ error: e.message || 'Verification failed' }, { status: 500 });
  }
}
