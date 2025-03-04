import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { ReservationStatus } from "@/lib/types"

export async function POST(request: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { vehicleId, startDate, endDate, totalPrice } = await request.json()

    // Vérifier si le véhicule est disponible pour ces dates
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        vehicleId,
        status: {
          in: ["PENDING", "CONFIRMED"], // Using string literals instead of enum
        },
        OR: [
          {
            AND: [{ startDate: { lte: new Date(startDate) } }, { endDate: { gte: new Date(startDate) } }],
          },
          {
            AND: [{ startDate: { lte: new Date(endDate) } }, { endDate: { gte: new Date(endDate) } }],
          },
        ],
      },
    })

    if (existingReservation) {
      return NextResponse.json({ error: "Le véhicule n'est pas disponible pour ces dates" }, { status: 400 })
    }

    // Créer la réservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.id,
        vehicleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        status: ReservationStatus.PENDING, // This will be converted to string
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      },
      include: {
        vehicle: {
          select: {
            brand: true,
            model: true,
          },
        },
      },
    })

    // Notifier l'administrateur
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "NEW_RESERVATION",
          reservation: {
            id: reservation.id,
            vehicle: reservation.vehicle,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
          },
        }),
      })
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error)
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la réservation" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get("vehicleId")

    const reservations = await prisma.reservation.findMany({
      where: vehicleId
        ? {
            vehicleId,
            status: {
              in: ["PENDING", "CONFIRMED"], // Using string literals instead of enum
            },
          }
        : {
            userId: session.user.id,
          },
      include: {
        vehicle: {
          select: {
            brand: true,
            model: true,
            dailyRate: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des réservations" }, { status: 500 })
  }
}

