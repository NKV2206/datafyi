import { parseUnits } from 'viem';

// This file is no longer used for executing payments server-side.
// Kept only for shared constants (ABI) and amount helpers.
export const PYUSD_DECIMALS = 6;
export const PYUSD_TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export function parsePyUsdAmount(human: string) {
  return parseUnits(human, PYUSD_DECIMALS);
}
