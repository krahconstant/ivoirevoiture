import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ReservationStatus } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get("vehicleId")

    if (!vehicleId) {
      return NextResponse.json({ error: "ID de véhicule requis" }, { status: 400 })
    }

    // Vérifier si le véhicule existe
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: {
        id: true,
        brand: true,
        model: true,
        available: true,
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: "Véhicule non trouvé" }, { status: 404 })
    }

    // Récupérer toutes les réservations pour ce véhicule
    const reservations = await prisma.reservation.findMany({
      where: {
        vehicleId,
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
        },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        startDate: "asc",
      },
    })

    // Créer un calendrier de disponibilité pour les 30 prochains jours
    const today = new Date()
    const availability = []

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Vérifier si cette date est réservée
      const isReserved = reservations.some((reservation) => {
        const reservationStart = new Date(reservation.startDate)
        const reservationEnd = new Date(reservation.endDate)

        // Réinitialiser les heures pour comparer uniquement les dates
        const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const resStart = new Date(
          reservationStart.getFullYear(),
          reservationStart.getMonth(),
          reservationStart.getDate(),
        )
        const resEnd = new Date(reservationEnd.getFullYear(), reservationEnd.getMonth(), reservationEnd.getDate())

        return dateToCheck >= resStart && dateToCheck <= resEnd
      })

      availability.push({
        date: date.toISOString().split("T")[0],
        available: !isReserved,
      })
    }

    return NextResponse.json({
      vehicle: {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        available: vehicle.available,
      },
      reservations: reservations.map((r) => ({
        id: r.id,
        startDate: r.startDate,
        endDate: r.endDate,
        status: r.status,
        name: r.name,
        createdAt: r.createdAt,
      })),
      availability,
    })
  } catch (error) {
    console.error("Erreur lors de la vérification de la disponibilité:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la vérification de la disponibilité",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

