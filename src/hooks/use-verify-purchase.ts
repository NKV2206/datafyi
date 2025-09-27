import { useState, useCallback } from 'react';

interface VerifyResponse {
  verified: boolean;
  alreadyRecorded?: boolean;
  transactionId?: number;
  datasetId?: number;
  paid?: string;
  txHash?: string;
  error?: string;
}

export function useVerifyPurchase() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [alreadyRecorded, setAlreadyRecorded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverTxId, setServerTxId] = useState<number | null>(null);

  const verify = useCallback(async (datasetId: number, txHash: `0x${string}`, buyer: `0x${string}`) => {
    if (verifying || verified) return; // prevent duplicate
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId, txHash, buyer }),
      });
      const json: VerifyResponse = await res.json();
      if (!res.ok || !json.verified) {
        throw new Error(json.error || 'Verification failed');
      }
      setVerified(true);
      setAlreadyRecorded(!!json.alreadyRecorded);
      if (json.transactionId) setServerTxId(json.transactionId);
      return json;
    } catch (e: any) {
      setError(e.message || 'Verification error');
      throw e;
    } finally {
      setVerifying(false);
    }
  }, [verifying, verified]);

  return { verify, verifying, verified, alreadyRecorded, error, serverTxId };
}
