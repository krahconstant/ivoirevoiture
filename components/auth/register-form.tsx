"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormErrors {
  name?: string
  email?: string
  password?: string
  phone?: string
  general?: string
}

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Validation de l'email
  const validateEmail = async (email: string) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "L'email est requis" }))
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Format d'email invalide" }))
      return false
    }

    try {
      // Vérifier si l'email existe déjà
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.exists) {
        setErrors((prev) => ({ ...prev, email: "Cet email est déjà utilisé" }))
        return false
      }

      setErrors((prev) => ({ ...prev, email: undefined }))
      return true
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error)
      return true // En cas d'erreur de vérification, on laisse passer
    }
  }

  // Validation du téléphone
  const validatePhone = async (phone: string) => {
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: "Le numéro de téléphone est requis" }))
      return false
    }

    const cleanPhone = phone.replace(/\s+/g, "")

    // Si le numéro commence par 0, ajouter +225
    if (cleanPhone.startsWith("0")) {
      const withPrefix = "+225" + cleanPhone.slice(1)
      if (!/^\+225[2-9]\d{8}$/.test(withPrefix)) {
        setErrors((prev) => ({ ...prev, phone: "Format invalide. Exemple: 07 XX XX XX XX" }))
        return false
      }
    } else if (!cleanPhone.startsWith("+225")) {
      setErrors((prev) => ({ ...prev, phone: "Le numéro doit commencer par 0 ou +225" }))
      return false
    } else if (!/^\+225[2-9]\d{8}$/.test(cleanPhone)) {
      setErrors((prev) => ({ ...prev, phone: "Format invalide. Exemple: +225 07 XX XX XX XX" }))
      return false
    }

    try {
      // Vérifier si le téléphone existe déjà
      const formattedPhone = cleanPhone.startsWith("0") ? "+225" + cleanPhone.slice(1) : cleanPhone
      const response = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(formattedPhone)}`)
      const data = await response.json()

      if (data.exists) {
        setErrors((prev) => ({ ...prev, phone: "Ce numéro de téléphone est déjà utilisé" }))
        return false
      }

      setErrors((prev) => ({ ...prev, phone: undefined }))
      return true
    } catch (error) {
      console.error("Erreur lors de la vérification du téléphone:", error)
      return true // En cas d'erreur de vérification, on laisse passer
    }
  }

  // Validation du mot de passe
  const validatePassword = (password: string) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Le mot de passe est requis" }))
      return false
    }

    if (password.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Le mot de passe doit contenir au moins 6 caractères" }))
      return false
    }

    setErrors((prev) => ({ ...prev, password: undefined }))
    return true
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const phone = formData.get("phone") as string
      const password = formData.get("password") as string

      // Valider tous les champs
      const isEmailValid = await validateEmail(email)
      const isPhoneValid = await validatePhone(phone)
      const isPasswordValid = validatePassword(password)

      if (!isEmailValid || !isPhoneValid || !isPasswordValid) {
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email,
          password,
          phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Gérer les erreurs spécifiques aux champs
        if (data.field) {
          setErrors((prev) => ({ ...prev, [data.field]: data.error }))
          throw new Error(data.error)
        }
        throw new Error(data.error || "Une erreur est survenue")
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      })

      router.push("/auth/login")
    } catch (error) {
      // Ne pas afficher de toast si on a déjà des erreurs spécifiques aux champs
      if (!Object.keys(errors).length) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error instanceof Error ? error.message : "Une erreur est survenue",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
        <CardDescription>Créez votre compte pour accéder à nos services</CardDescription>
      </CardHeader>
      <CardContent>
        {errors.general && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              Nom complet
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              disabled={isLoading}
              className={errors.name ? "border-destructive" : ""}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@email.com"
              required
              disabled={isLoading}
              className={errors.email ? "border-destructive" : ""}
              onChange={(e) => validateEmail(e.target.value)}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              Mot de passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
              minLength={6}
              className={errors.password ? "border-destructive" : ""}
              onChange={(e) => validatePassword(e.target.value)}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : "password-hint"}
            />
            {errors.password ? (
              <p id="password-error" className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </p>
            ) : (
              <p id="password-hint" className="text-xs text-muted-foreground">
                Au moins 6 caractères
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium leading-none">
              Téléphone
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="07 XX XX XX XX"
              required
              disabled={isLoading}
              onChange={(e) => validatePhone(e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
            />
            {errors.phone ? (
              <p id="phone-error" className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.phone}
              </p>
            ) : (
              <p id="phone-hint" className="text-xs text-muted-foreground">
                Format: 07 XX XX XX XX ou +225 07 XX XX XX XX
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

