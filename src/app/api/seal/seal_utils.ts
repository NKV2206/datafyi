import { getFullnodeUrl } from '@mysten/sui/client';
import { TESTNET_PACKAGE_ID } from './seal_constants';
import { createNetworkConfig } from '@mysten/dapp-kit';

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl('testnet'),
    variables: {
      packageId: TESTNET_PACKAGE_ID,
      mvrName: '@pkg/seal-demo-1234',
    },
  },
});

export { useNetworkVariable, useNetworkVariables, networkConfig };