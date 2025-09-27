"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { WalletConnectButton } from "./wallet-connect-button"

export function SiteNav() {
  const pathname = usePathname()
  const links = [
    { href: "/", label: "Home" },
    { href: "/upload", label: "Upload" },
    { href: "/search", label: "Search" },
    { href: "/my-data", label: "My Data" },
  ]

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Datafyi
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  pathname === l.href && "text-foreground bg-secondary",
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  )
}
