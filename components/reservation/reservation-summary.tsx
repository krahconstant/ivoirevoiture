"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import type { Vehicle } from "@/lib/types"
import Image from "next/image"

interface ReservationSummaryProps {
  vehicle: Vehicle
}

export function ReservationSummary({ vehicle }: ReservationSummaryProps) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [numberOfDays, setNumberOfDays] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Écouter les événements de mise à jour des dates depuis le formulaire
  useEffect(() => {
    const handleDateChange = (event: CustomEvent) => {
      const { start, end } = event.detail
      setStartDate(start)
      setEndDate(end)
    }

    window.addEventListener("reservation-dates-changed", handleDateChange as EventListener)
    return () => {
      window.removeEventListener("reservation-dates-changed", handleDateChange as EventListener)
    }
  }, [])

  // Calculer le nombre de jours et le prix total
  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      setNumberOfDays(days)
      setTotalPrice(days * (vehicle.dailyRate || 0))
    } else {
      setNumberOfDays(0)
      setTotalPrice(0)
    }
  }, [startDate, endDate, vehicle.dailyRate])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé de la réservation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-video overflow-hidden rounded-md">
          <Image
            src={vehicle.images[0] || "/placeholder.svg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-sm text-muted-foreground">{vehicle.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Prix par jour</span>
            <span>{formatPrice(vehicle.dailyRate || 0)}</span>
          </div>

          {numberOfDays > 0 && (
            <>
              <div className="flex justify-between">
                <span>Nombre de jours</span>
                <span>{numberOfDays} jours</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Prix total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </>
          )}

          {!numberOfDays && (
            <p className="text-sm text-muted-foreground italic">
              Sélectionnez les dates de réservation pour voir le prix total
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

