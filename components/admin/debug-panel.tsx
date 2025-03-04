"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Database, RefreshCw } from "lucide-react"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [reservations, setReservations] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/reservations")
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      setReservations(data.reservations)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Outils de débogage
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <Card>
          <CardHeader>
            <CardTitle>Débogage des réservations</CardTitle>
            <CardDescription>Vérifier les réservations dans la base de données</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={fetchReservations} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Vérifier les réservations
              </Button>

              {error && <div className="p-2 bg-destructive/10 text-destructive rounded-md">{error}</div>}

              {reservations && (
                <div>
                  <p className="font-medium mb-2">{reservations.length} réservation(s) trouvée(s)</p>
                  {reservations.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Statut</th>
                            <th className="p-2 text-left">Véhicule</th>
                            <th className="p-2 text-left">Client</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((res) => (
                            <tr key={res.id} className="border-t">
                              <td className="p-2">{res.id.substring(0, 8)}...</td>
                              <td className="p-2">{res.status}</td>
                              <td className="p-2">
                                {res.vehicle ? `${res.vehicle.brand} ${res.vehicle.model}` : "N/A"}
                              </td>
                              <td className="p-2">{res.user ? res.user.name : "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucune réservation trouvée</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}

