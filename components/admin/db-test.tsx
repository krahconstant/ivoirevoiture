"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DatabaseTest() {
  const [status, setStatus] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/db-test")
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      setStatus(data)
      toast({
        title: "Test de connexion réussi",
        description: "La connexion à la base de données fonctionne correctement.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      console.error(err)
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de se connecter à la base de données.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTestReservation = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/db-test", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      setTestResult(data)
      toast({
        title: "Réservation de test créée",
        description: `ID: ${data.reservation.id}`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      console.error(err)
      toast({
        variant: "destructive",
        title: "Erreur de création",
        description: "Impossible de créer la réservation de test.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Test de base de données</CardTitle>
            <CardDescription>Vérifier la connexion à la base de données</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={testConnection} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-2 bg-destructive/10 text-destructive rounded-md">{error}</div>
        ) : (
          <div className="space-y-4">
            {status ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Statut:</span>
                  <Badge variant={status.status === "connected" ? "success" : "destructive"}>
                    {status.status === "connected" ? "Connecté" : "Erreur"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Informations de connexion</h3>
                  <div className="border rounded-md p-2 bg-muted/50">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium">Provider:</span>
                      <span className="text-sm">{status.dbInfo.provider}</span>

                      <span className="text-sm font-medium">URL:</span>
                      <span className="text-sm truncate">{status.dbInfo.url}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Tables</h3>
                  <div className="border rounded-md p-2 bg-muted/50">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium">Utilisateurs:</span>
                      <span className="text-sm">{status.tableCheck.users}</span>

                      <span className="text-sm font-medium">Véhicules:</span>
                      <span className="text-sm">{status.tableCheck.vehicles}</span>

                      <span className="text-sm font-medium">Réservations:</span>
                      <span className="text-sm">{status.tableCheck.reservations}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={createTestReservation} disabled={isCreating} className="w-full">
                    {isCreating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer une réservation de test
                      </>
                    )}
                  </Button>
                </div>

                {testResult && (
                  <div className="border rounded-md p-2 bg-muted/50 mt-4">
                    <h3 className="font-medium text-sm mb-2">Résultat du test</h3>
                    <div className="text-xs overflow-auto max-h-40">
                      <pre>{JSON.stringify(testResult, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-24">
                <Database className="h-6 w-6 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Cliquez sur le bouton pour tester la connexion</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

