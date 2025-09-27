// allowlist_backend.ts
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';

/**
 * Create a new allowlist on-chain
 * @param suiClient - Sui client instance
 * @param packageId - The Move package ID containing the allowlist module
 * @param name - Name of the allowlist
 * @param signAndExecute - Function to sign and execute a transaction
 * @returns The object ID of the created allowlist
 */
export async function createAllowlistBackend(
  suiClient: SuiClient,
  packageId: string,
  name: string,
  signAndExecute: (tx: Transaction) => Promise<any>
): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error('Allowlist name cannot be empty');
  }
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::allowlist::create_allowlist_entry`,
    arguments: [tx.pure.string(name)],
  });
  tx.setGasBudget(10000000);

  const result = await signAndExecute(tx);

  const allowlistObject = result.effects?.created?.find(
    (item: any) => item.owner && typeof item.owner === 'object' && 'Shared' in item.owner
  );
  const createdObjectId = allowlistObject?.reference?.objectId;

  if (!createdObjectId) {
    throw new Error('Failed to create allowlist');
  }

  return createdObjectId;
}

/**
 * Fetch an allowlist object and its Cap object
 * @param suiClient - Sui client instance
 * @param packageId - Move package ID
 * @param ownerAddress - Address of the current user
 * @param allowlistId - ID of the allowlist to fetch
 * @returns { capId: string, allowlist: { id, name, list } }
 */
export async function getAllowlistBackend(
  suiClient: SuiClient,
  packageId: string,
  ownerAddress: string,
  allowlistId: string
): Promise<{ capId: string; allowlist: { id: string; name: string; list: string[] } }> {
  // Load all Cap objects owned by the user
  const res = await suiClient.getOwnedObjects({
    owner: ownerAddress,
    options: { showContent: true, showType: true },
    filter: { StructType: `${packageId}::allowlist::Cap` },
  });

  // Find the Cap corresponding to the given allowlist ID
  const capId = res.data
    .map((obj: any) => {
      const fields = (obj.data?.content as { fields: any })?.fields;
      return {
        id: fields?.id.id,
        allowlist_id: fields?.allowlist_id,
      };
    })
    .filter((item: any) => item.allowlist_id === allowlistId)
    .map((item: any) => item.id)[0];

  if (!capId) throw new Error('Cap object not found for allowlist');

  // Load the allowlist object
  const allowlistObj = await suiClient.getObject({
    id: allowlistId,
    options: { showContent: true },
  });
  const fields = (allowlistObj.data?.content as { fields: any })?.fields || {};

  return {
    capId,
    allowlist: {
      id: allowlistId,
      name: fields.name,
      list: fields.list,
    },
  };
}

/**
 * Add a new address to an allowlist
 * @param suiClient - Sui client instance
 * @param packageId - Move package ID
 * @param wlId - Allowlist object ID
 * @param capId - Cap object ID
 * @param newAddress - Sui address to add
 * @param signAndExecute - Function to sign and execute the transaction
 */
export async function addToAllowlistBackend(
  suiClient: SuiClient,
  packageId: string,
  wlId: string,
  capId: string,
  newAddress: string,
  signAndExecute: (tx: Transaction) => Promise<any>
) {
  if (!newAddress || newAddress.trim() === '') {
    throw new Error('Address cannot be empty');
  }

  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::allowlist::add`,
    arguments: [tx.object(wlId), tx.object(capId), tx.pure.address(newAddress.trim())],
  });
  tx.setGasBudget(10000000);

  await signAndExecute(tx);
}
