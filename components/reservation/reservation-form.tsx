"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Vehicle } from "@/lib/types"
import { createReservation } from "@/app/reserver/actions"

interface ReservationFormProps {
  vehicle: Vehicle
  user?: {
    name?: string | null
    email?: string | null
  }
  initialStartDate?: Date
  initialEndDate?: Date
}

export function ReservationForm({ vehicle, user, initialStartDate, initialEndDate }: ReservationFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate)
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [disabledDates, setDisabledDates] = useState<Date[]>([])
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Charger les dates indisponibles
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      if (!vehicle.id) return

      setIsLoadingDates(true)
      try {
        const response = await fetch(`/api/debug/vehicle-availability?vehicleId=${encodeURIComponent(vehicle.id)}`)

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des dates")
        }

        const data = await response.json()

        // Convertir les dates indisponibles en objets Date
        const unavailableDates = data.availability
          .filter((day: any) => !day.available)
          .map((day: any) => new Date(day.date))

        setDisabledDates(unavailableDates)
      } catch (error) {
        console.error("Erreur lors du chargement des dates indisponibles:", error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les dates indisponibles",
        })
      } finally {
        setIsLoadingDates(false)
      }
    }

    fetchUnavailableDates()
  }, [vehicle.id, toast])

  // Fonction pour mettre à jour les dates et notifier le composant de résumé
  const updateDates = (start?: Date, end?: Date) => {
    if (start) setStartDate(start)
    if (end) setEndDate(end)

    // Réinitialiser les erreurs lors du changement de dates
    setFormError(null)

    // Émettre un événement pour le composant de résumé
    if (typeof window !== "undefined") {
      const event = new CustomEvent("reservation-dates-changed", {
        detail: { start: start || startDate, end: end || endDate },
      })
      window.dispatchEvent(event)
    }
  }

  const numberOfDays =
    startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
  const totalPrice = numberOfDays * (vehicle.dailyRate || 0)

  // Fonction pour vérifier si une date est désactivée (pour le calendrier)
  const isDateDisabled = (date: Date) => {
    // Désactiver les dates passées
    if (date < new Date()) return true

    // Désactiver les dates déjà réservées
    return disabledDates.some(
      (disabledDate) =>
        disabledDate.getFullYear() === date.getFullYear() &&
        disabledDate.getMonth() === date.getMonth() &&
        disabledDate.getDate() === date.getDate(),
    )
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setDebugInfo(null)

    if (!startDate || !endDate) {
      setFormError("Veuillez sélectionner les dates de réservation")
      setIsLoading(false)
      return
    }

    // Vérifier que les dates sont valides
    if (startDate > endDate) {
      setFormError("La date de début doit être antérieure à la date de fin")
      setIsLoading(false)
      return
    }

    // Vérifier que la date de début est dans le futur
    if (startDate < new Date()) {
      setFormError("La date de début doit être dans le futur")
      setIsLoading(false)
      return
    }

    const formData = new FormData(event.currentTarget)

    // Ajouter les données manquantes
    formData.append("vehicleId", vehicle.id)
    formData.append("startDate", startDate.toISOString())
    formData.append("endDate", endDate.toISOString())
    formData.append("totalPrice", totalPrice.toString())

    console.log("Soumission du formulaire avec les données:", {
      vehicleId: vehicle.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    })

    try {
      const result = await createReservation(formData)

      if (result.error) {
        console.error("Erreur retournée par createReservation:", result.error)
        setFormError(result.error)
        setDebugInfo(result.conflictDetails || null)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error,
        })
        setIsLoading(false)
        return
      }

      if (result.success && result.reservationId) {
        console.log("Réservation créée avec succès:", result.reservationId)
        toast({
          title: "Réservation créée",
          description: "Votre réservation a été créée avec succès.",
        })

        // Redirection avec un délai pour permettre à l'utilisateur de voir le toast
        setTimeout(() => {
          window.location.href = `/reservations/${result.reservationId}`
        }, 1000)
      } else {
        console.error("Réponse inattendue de createReservation:", result)
        setFormError("Une erreur inattendue est survenue")
        setDebugInfo(result)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la réservation",
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Exception lors de la soumission:", error)
      setFormError("Une erreur est survenue lors de la soumission du formulaire")
      setDebugInfo(error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la réservation",
      })
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Réserver {vehicle.brand} {vehicle.model}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" name="name" placeholder="John Doe" required defaultValue={user?.name || ""} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                defaultValue={user?.email || ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+225 XX XX XX XX XX" required />
            </div>

            <div className="grid gap-2">
              <Label>Dates de location</Label>
              {isLoadingDates ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Chargement des disponibilités...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: fr }) : "Date de début"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => updateDates(date, endDate)}
                        disabled={(date) => isDateDisabled(date) || (endDate ? date > endDate : false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: fr }) : "Date de fin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => updateDates(startDate, date)}
                        disabled={(date) => isDateDisabled(date) || date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {startDate && endDate && (
              <div className="rounded-lg bg-muted p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Nombre de jours:</span>
                    <span>{numberOfDays} jours</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>
                      {new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {debugInfo && (
              <div className="rounded-lg bg-muted p-4 text-xs overflow-auto max-h-40">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4">
          <Button className="w-full" disabled={!startDate || !endDate || isLoading || isLoadingDates}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Confirmation en cours..." : "Confirmer la réservation"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

