// seal_decrypt_backend.ts
import { SealClient, SessionKey, NoAccessError, EncryptedObject } from '@mysten/seal';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

export type MoveCallConstructor = (tx: Transaction, id: string) => void;

/**
 * Download encrypted blobs from Walrus and decrypt them locally
 */
export async function downloadAndDecryptBackend(
  blobIds: string[],
  sessionKey: SessionKey,
  suiClient: SuiClient,
  sealClient: SealClient,
  moveCallConstructor: MoveCallConstructor,
  aggregators: string[]
): Promise<Uint8Array[]> {
  // Download all blobs in parallel
  const downloadResults = await Promise.all(
    blobIds.map(async (blobId) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const randomAggregator = aggregators[Math.floor(Math.random() * aggregators.length)];
        const aggregatorUrl = `/${randomAggregator}/v1/blobs/${blobId}`;
        const response = await fetch(aggregatorUrl, { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) return null;
        return await response.arrayBuffer();
      } catch (err) {
        console.error(`Blob ${blobId} cannot be retrieved`, err);
        return null;
      }
    })
  );

  // Filter valid downloads
  const validDownloads = downloadResults.filter((r): r is ArrayBuffer => r !== null);
  if (validDownloads.length === 0) {
    throw new Error(
      'Cannot retrieve files from any aggregator. Files uploaded more than 1 epoch ago may have been deleted.'
    );
  }

  // Fetch decryption keys in batches
  for (let i = 0; i < validDownloads.length; i += 10) {
    const batch = validDownloads.slice(i, i + 10);
    const ids = batch.map((enc) => EncryptedObject.parse(new Uint8Array(enc)).id);
    const tx = new Transaction();
    ids.forEach((id) => moveCallConstructor(tx, id));
    const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });
    try {
      await sealClient.fetchKeys({ ids, txBytes, sessionKey, threshold: 2 });
    } catch (err) {
      const errorMsg =
        err instanceof NoAccessError
          ? 'No access to decryption keys'
          : 'Unable to decrypt files';
      console.error(errorMsg, err);
      throw new Error(errorMsg);
    }
  }

  // Decrypt each blob sequentially
  const decryptedFiles: Uint8Array[] = [];
  for (const encryptedData of validDownloads) {
    const fullId = EncryptedObject.parse(new Uint8Array(encryptedData)).id;
    const tx = new Transaction();
    moveCallConstructor(tx, fullId);
    const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });
    try {
      const decryptedFile = await sealClient.decrypt({
        data: new Uint8Array(encryptedData),
        sessionKey,
        txBytes,
      });
      decryptedFiles.push(decryptedFile);
    } catch (err) {
      const errorMsg =
        err instanceof NoAccessError
          ? 'No access to decryption keys'
          : 'Unable to decrypt files';
      console.error(errorMsg, err);
      throw new Error(errorMsg);
    }
  }

  return decryptedFiles;
}
