"use client"

import { Bell, LogOut, Settings, User, Volume2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNotificationSound } from "@/lib/useNotificationSound"

export function Header() {
  const router = useRouter()
  const playNotification = useNotificationSound() // Renommé pour plus de clarté

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="ml-auto flex items-center gap-4">
          {/* Bouton de test du son */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("Test du son...")
              playNotification() // Utiliser directement la fonction retournée par le hook
            }}
            title="Tester le son de notification"
          >
            <Volume2 className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/messages">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/admin/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
                onSelect={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

