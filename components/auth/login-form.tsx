"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRole } from "@/lib/types"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") || "/"

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      const user = await login(email, password)

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      })

      // Rediriger vers callbackUrl si présent, sinon vers la page appropriée selon le rôle
      if (callbackUrl && callbackUrl !== "/") {
        router.push(callbackUrl)
      } else {
        router.push(user.role === UserRole.ADMIN ? "/admin" : "/")
      }

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous à votre compte pour accéder à vos réservations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="exemple@email.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input id="password" name="password" type="password" required disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            S&apos;inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

