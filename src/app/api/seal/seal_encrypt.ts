// seal_encrypt_backend.ts
import { Transaction } from '@mysten/sui/transactions';
import { useSuiClient } from '@mysten/dapp-kit';
import { SealClient } from '@mysten/seal';
import { fromHex, toHex } from '@mysten/sui/utils';

export type WalrusService = {
  id: string;
  name: string;
  publisherUrl: string;
  aggregatorUrl: string;
};

const NUM_EPOCH = 1;

/**
 * Encrypt a file buffer and store it on a Walrus service
 */
export async function encryptAndStoreBlob(
  fileBuffer: ArrayBuffer,
  policyObject: string,
  packageId: string,
  serverObjectIds: string[],
  selectedService: WalrusService,
  storeBlobFn: (data: Uint8Array, url: string) => Promise<any>
) {
  // Initialize Seal client
  const suiClient = useSuiClient();
  const sealClient = new SealClient({
    suiClient,
    serverConfigs: serverObjectIds.map((id) => ({ objectId: id, weight: 1 })),
    verifyKeyServers: false,
  });

  // Generate unique ID for the encrypted object
  const nonce = crypto.getRandomValues(new Uint8Array(5));
  const policyObjectBytes = fromHex(policyObject);
  const id = toHex(new Uint8Array([...policyObjectBytes, ...nonce]));

  // Encrypt
  const { encryptedObject: encryptedBytes } = await sealClient.encrypt({
    threshold: 2,
    packageId,
    id,
    data: new Uint8Array(fileBuffer),
  });

  // Upload to publisher
  const url = `${selectedService.publisherUrl}/v1/blobs?epochs=${NUM_EPOCH}`;
  const storageInfo = await storeBlobFn(encryptedBytes, url);

  return { id, storageInfo };
}

/**
 * Publish the encrypted blob on-chain
 */
export async function publishBlobOnChain(
  wlId: string,
  capId: string,
  blobId: string,
  moduleName: string,
  packageId: string,
  signAndExecute: (tx: Transaction) => Promise<any>
) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::${moduleName}::publish`,
    arguments: [tx.object(wlId), tx.object(capId), tx.pure.string(blobId)],
  });

  tx.setGasBudget(10000000);

  return await signAndExecute(tx);
}

/**
 * Default blob storage function
 */
export async function defaultStoreBlob(encryptedData: Uint8Array, publisherUrl: string) {
  const response = await fetch(publisherUrl, {
    method: 'PUT',
    body: encryptedData,
  });

  if (!response.ok) {
    throw new Error('Failed to store blob on Walrus');
  }

  return await response.json();
}
