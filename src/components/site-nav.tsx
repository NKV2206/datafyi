"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "wagmi"
import { cn } from "@/lib/utils"
import { WalletConnectButton } from "./wallet-connect-button"

export function SiteNav() {
  const pathname = usePathname()
  const { isConnected } = useAccount()

  const links = [
    { href: "/", label: "Home", requiresWallet: false },
    { href: "/upload", label: "Upload", requiresWallet: true },
    { href: "/search", label: "Search", requiresWallet: true },
    { href: "/my-data", label: "My Data", requiresWallet: true },
  ]

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Datafyi
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {links.map((l) => {
              const isDisabled = l.requiresWallet && !isConnected
              return (
                <Link
                  key={l.href}
                  href={isDisabled ? "#" : l.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                    isDisabled
                      ? "text-muted-foreground/50 cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                    pathname === l.href && !isDisabled && "text-foreground bg-secondary",
                  )}
                  onClick={isDisabled ? (e) => e.preventDefault() : undefined}
                  title={isDisabled ? "Connect wallet to access this feature" : undefined}
                >
                  {l.label}
                  {l.requiresWallet && !isConnected && (
                    <span className="ml-1 text-xs">🔒</span>
                  )}
                </Link>
              )
            })}
          </div>
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  )
}
