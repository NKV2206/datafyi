'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ 
        account, 
        chain, 
        openAccountModal, 
        openChainModal, 
        openConnectModal, 
        authenticationStatus, 
        mounted 
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected = ready && account && chain
        
        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Connect Wallet
            </button>
          )
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              type="button"
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Wrong network
            </button>
          )
        }

        return (
          <div className="flex gap-3">
            <button
              onClick={openChainModal}
              className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              type="button"
            >
              {chain.hasIcon && chain.iconUrl && (
                <img
                  alt={chain.name ?? 'Chain icon'}
                  src={chain.iconUrl}
                  style={{ width: 16, height: 16 }}
                />
              )}
              {chain.name}
            </button>

            <button
              onClick={openAccountModal}
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {account.displayName}
              {account.displayBalance ? ` (${account.displayBalance})` : ''}
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
