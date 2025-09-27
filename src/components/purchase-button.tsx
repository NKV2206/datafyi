"use client";

import React from 'react';
import { usePurchaseDataset } from '@/hooks/use-purchase-dataset';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { useVerifyPurchase } from '@/hooks/use-verify-purchase';

export interface PurchaseButtonProps {
  datasetId: number;
  owner: `0x${string}`;
  price: string; // human readable PYUSD amount
  pyusdAddress: `0x${string}`;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({ datasetId, owner, price, pyusdAddress }) => {
  const { purchase, loading, error, confirmation, txHash } = usePurchaseDataset({ pyusdAddress });
  const { address } = useAccount();
  const { verify, verified, verifying, error: verifyError, downloadUrl, blobId } = useVerifyPurchase();

  const onClick = async () => {
    try {
      const { hash } = await purchase({ datasetId, owner, price });
      toast.info(`Submitted tx: ${hash.slice(0,10)}...`);
    } catch (_) {}
  };

  React.useEffect(() => {
    if (confirmation.status === 'success' && txHash && address && !verified && !verifying) {
      verify(datasetId, txHash, address as `0x${string}`)
        .then(() => toast.success('Access granted'))
        .catch(() => {});
    }
    if (verified && downloadUrl) {
      // Auto-trigger download (opens in new tab to avoid blocking)
      try {
        const url = downloadUrl.startsWith('http') ? downloadUrl : downloadUrl;
        window.open(url, '_blank');
      } catch(_) {}
    }
    if (error) toast.error(error);
    if (verifyError) toast.error(verifyError);
  }, [confirmation.status, error, verifyError, txHash, address, verified, verifying, datasetId, verify]);

  return (
    <div className="flex flex-col gap-1">
      <Button size="sm" disabled={loading || verifying || !address} onClick={onClick} className="w-full">
        {loading ? 'Processing...' : verifying ? 'Verifying...' : verified ? 'Purchased' : `Buy (${price} PYUSD)`}
      </Button>
      {txHash && <span className="text-[10px] text-muted-foreground">Tx: {txHash.slice(0,14)}...</span>}
    </div>
  );
};