"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"
import { Role } from "@prisma/client"

interface AuthButtonsProps {
  user: User | null
}

export function AuthButtons({ user }: AuthButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="text-sm">{user.name}</span>
          {user.role === Role.ADMIN && (
            <Button variant="ghost" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          )}
          <form action="/api/auth/logout" method="POST">
            <Button variant="ghost" type="submit">
              Déconnexion
            </Button>
          </form>
        </>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Connexion</Link>
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" asChild>
            <Link href="/auth/register">Inscription</Link>
          </Button>
        </>
      )}
    </div>
  )
}

