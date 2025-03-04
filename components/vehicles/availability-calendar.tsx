"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isWithinInterval } from "date-fns"

interface Reservation {
  startDate: Date
  endDate: Date
}

interface AvailabilityCalendarProps {
  vehicleId: string
}

export function AvailabilityCalendar({ vehicleId }: AvailabilityCalendarProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`/api/reservations?vehicleId=${vehicleId}`)
        if (!response.ok) throw new Error("Failed to fetch reservations")
        const data = await response.json()
        setReservations(
          data.map((r: any) => ({
            ...r,
            startDate: new Date(r.startDate),
            endDate: new Date(r.endDate),
          })),
        )
      } catch (error) {
        console.error("Error fetching reservations:", error)
      }
    }

    fetchReservations()
  }, [vehicleId])

  const isDateUnavailable = (date: Date) => {
    return reservations.some((reservation) =>
      isWithinInterval(date, {
        start: reservation.startDate,
        end: reservation.endDate,
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilités</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => {
            return date < new Date() || isDateUnavailable(date)
          }}
          modifiers={{
            booked: (date) => isDateUnavailable(date),
          }}
          modifiersStyles={{
            booked: { backgroundColor: "var(--destructive)", color: "white" },
          }}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  )
}

