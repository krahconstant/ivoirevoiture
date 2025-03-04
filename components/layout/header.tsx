"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AuthStatus } from "@/components/auth/auth-status"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Véhicules", href: "/vehicules" },
  { name: "Location", href: "/location" },
  { name: "Vente", href: "/vente" },
  { name: "À propos", href: "/a-propos" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const { user, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">IvoireVoiture</span>
        </Link>

        {/* Navigation principale */}
        <nav className="hidden md:flex md:gap-6">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!loading && <AuthStatus user={user} />}
        </div>
      </div>
    </header>
  )
}

