'use client'

import { useAccount } from 'wagmi'
import { ReactNode } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WalletGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function WalletGuard({ children, fallback }: WalletGuardProps) {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                You need to connect your wallet to access this feature and interact with the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ConnectButton />
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}
