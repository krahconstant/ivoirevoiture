"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/lib/types"

interface AuthStatusProps {
  user: User | null
}

export function AuthStatus({ user }: AuthStatusProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/auth/login">Se connecter</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">S&apos;inscrire</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={user.name} />
            <AvatarFallback>
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Utilisateur"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Tableau de bord</Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Administration</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={handleLogout}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

