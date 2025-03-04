"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Shield, Lock, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [timeoutDuration, setTimeoutDuration] = useState("60")
  const [passwordPolicy, setPasswordPolicy] = useState("medium")

  const handleSave = () => {
    setIsLoading(true)

    // Simuler une sauvegarde
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Paramètres de sécurité mis à jour",
        description: "Vos paramètres de sécurité ont été enregistrés.",
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de sécurité</CardTitle>
        <CardDescription>Gérez les paramètres de sécurité de votre site.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label htmlFor="two-factor" className="font-medium">
                Authentification à deux facteurs
              </Label>
              <p className="text-sm text-muted-foreground">
                Exiger une authentification à deux facteurs pour les administrateurs
              </p>
            </div>
          </div>
          <Switch id="two-factor" checked={twoFactor} onCheckedChange={setTwoFactor} />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label htmlFor="session-timeout" className="font-medium">
                Expiration de session
              </Label>
              <p className="text-sm text-muted-foreground">
                Déconnecter automatiquement les utilisateurs après une période d'inactivité
              </p>
            </div>
          </div>
          <Switch id="session-timeout" checked={sessionTimeout} onCheckedChange={setSessionTimeout} />
        </div>

        {sessionTimeout && (
          <div className="ml-8 pl-3 border-l">
            <Label htmlFor="timeout-duration" className="text-sm">
              Durée d'inactivité (minutes)
            </Label>
            <Input
              id="timeout-duration"
              type="number"
              value={timeoutDuration}
              onChange={(e) => setTimeoutDuration(e.target.value)}
              className="w-24 mt-1"
              min="1"
            />
          </div>
        )}

        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <Label htmlFor="password-policy" className="font-medium">
              Politique de mot de passe
            </Label>
            <p className="text-sm text-muted-foreground mb-2">Définir la complexité requise pour les mots de passe</p>
            <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
              <SelectTrigger id="password-policy">
                <SelectValue placeholder="Sélectionner une politique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basique (minimum 6 caractères)</SelectItem>
                <SelectItem value="medium">Moyenne (8+ caractères, lettres et chiffres)</SelectItem>
                <SelectItem value="high">
                  Élevée (12+ caractères, majuscules, minuscules, chiffres et symboles)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les paramètres
        </Button>
      </CardFooter>
    </Card>
  )
}

