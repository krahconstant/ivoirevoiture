"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { VehicleType, type Vehicle } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ContactDialog } from "./contact-dialog"

interface VehicleReservationProps {
  vehicle: Vehicle
}

export function VehicleReservation({ vehicle }: VehicleReservationProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const router = useRouter()

  if (vehicle.type === VehicleType.VENTE) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acheter ce véhicule</CardTitle>
          <CardDescription>Contactez-nous pour plus d'informations sur ce véhicule</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary mb-4">{vehicle.price}€</p>
        </CardContent>
        <CardFooter>
          <ContactDialog vehicleId={vehicle.id}>
            <Button className="w-full">Contacter le vendeur</Button>
          </ContactDialog>
        </CardFooter>
      </Card>
    )
  }

  const handleReservation = () => {
    if (startDate && endDate) {
      const searchParams = new URLSearchParams({
        vehicleId: vehicle.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
      router.push(`/reserver?${searchParams.toString()}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Réserver ce véhicule</CardTitle>
        <CardDescription>Sélectionnez vos dates de location</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Date de début</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < new Date() || (endDate ? date > endDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Date de fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < (startDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {startDate && endDate && (
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between mb-2">
              <span>Prix par jour</span>
              <span>{vehicle.dailyRate}€</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-primary">
                {(
                  ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) *
                  (vehicle.dailyRate || 0)
                ).toFixed(2)}
                €
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!startDate || !endDate} onClick={handleReservation}>
          Réserver maintenant
        </Button>
      </CardFooter>
    </Card>
  )
}

