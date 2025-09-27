import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PYUSD_TRANSFER_ABI, PYUSD_DECIMALS } from '@/lib/payments';
import { parseUnits } from 'viem';

interface UsePurchaseDatasetParams {
  pyusdAddress: `0x${string}`;
}

interface PurchaseArgs {
  datasetId: number;
  owner: `0x${string}`;
  price: string; // human readable PYUSD amount
}

export function usePurchaseDataset({ pyusdAddress }: UsePurchaseDatasetParams) {
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const purchase = useCallback(async ({ datasetId, owner, price }: PurchaseArgs) => {
    setError(null);
    setLoading(true);
    try {
      const amount = parseUnits(price, PYUSD_DECIMALS);
      const hash = await writeContractAsync({
        address: pyusdAddress,
        abi: PYUSD_TRANSFER_ABI,
        functionName: 'transfer',
        args: [owner, amount],
        chainId: 421614, // Arbitrum Sepolia
      });
      setTxHash(hash);
      // Optionally notify backend of purchase AFTER confirming receipt externally
      return { hash, datasetId };
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Transaction failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [pyusdAddress, writeContractAsync]);

  const wait = useWaitForTransactionReceipt({ hash: txHash ?? undefined });

  return { purchase, txHash, confirmation: wait, loading, error };
}
