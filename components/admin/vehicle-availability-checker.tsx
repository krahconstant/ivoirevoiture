"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function VehicleAvailabilityChecker() {
  const [vehicleId, setVehicleId] = useState("")
  const [availability, setAvailability] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const checkAvailability = async () => {
    if (!vehicleId.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un ID de véhicule",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/debug/vehicle-availability?vehicleId=${encodeURIComponent(vehicleId)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      setAvailability(data)
      toast({
        title: "Disponibilité vérifiée",
        description: `${data.vehicle.brand} ${data.vehicle.model}`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      console.error(err)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier la disponibilité",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Formater une date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vérificateur de disponibilité</CardTitle>
        <CardDescription>Vérifier les réservations existantes pour un véhicule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="vehicleId" className="mb-2 block">
                ID du véhicule
              </Label>
              <Input
                id="vehicleId"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                placeholder="Entrez l'ID du véhicule"
              />
            </div>
            <Button onClick={checkAvailability} disabled={isLoading || !vehicleId.trim()}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier"
              )}
            </Button>
          </div>

          {error && <div className="p-2 bg-destructive/10 text-destructive rounded-md">{error}</div>}

          {availability && (
            <div className="space-y-4">
              <div className="border rounded-md p-3 bg-muted/30">
                <h3 className="font-medium mb-2">Informations du véhicule</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">Marque:</span>
                  <span>{availability.vehicle.brand}</span>

                  <span className="font-medium">Modèle:</span>
                  <span>{availability.vehicle.model}</span>

                  <span className="font-medium">Disponible:</span>
                  <Badge variant={availability.vehicle.available ? "success" : "destructive"}>
                    {availability.vehicle.available ? "Oui" : "Non"}
                  </Badge>
                </div>
              </div>

              {availability.reservations.length > 0 ? (
                <div className="border rounded-md p-3">
                  <h3 className="font-medium mb-2">Réservations existantes</h3>
                  <div className="space-y-2">
                    {availability.reservations.map((reservation: any) => (
                      <div key={reservation.id} className="border-b pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{reservation.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                            </p>
                          </div>
                          <Badge variant={reservation.status === "CONFIRMED" ? "success" : "default"}>
                            {reservation.status === "CONFIRMED" ? "Confirmée" : "En attente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-3 text-center">
                  <p className="text-muted-foreground">Aucune réservation existante</p>
                </div>
              )}

              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-2">Calendrier de disponibilité</h3>
                <div className="grid grid-cols-7 gap-1">
                  {availability.availability.map((day: any) => (
                    <div
                      key={day.date}
                      className={`p-1 text-center text-xs rounded ${
                        day.available ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                      }`}
                      title={`${day.date}: ${day.available ? "Disponible" : "Non disponible"}`}
                    >
                      {new Date(day.date).getDate()}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 dark:bg-green-900/20 rounded mr-1"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-100 dark:bg-red-900/20 rounded mr-1"></div>
                    <span>Réservé</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

