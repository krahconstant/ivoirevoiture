import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reservationId = searchParams.get("id")

    if (reservationId) {
      // Vérifier une réservation spécifique
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: {
          vehicle: {
            select: {
              id: true,
              brand: true,
              model: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (!reservation) {
        return NextResponse.json({
          found: false,
          id: reservationId,
          message: "Réservation non trouvée",
        })
      }

      return NextResponse.json({
        found: true,
        reservation: {
          id: reservation.id,
          status: reservation.status,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          totalPrice: reservation.totalPrice,
          vehicle: reservation.vehicle,
          user: reservation.user,
        },
      })
    } else {
      // Récupérer les dernières réservations
      const recentReservations = await prisma.reservation.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
          totalPrice: true,
          createdAt: true,
          vehicleId: true,
          userId: true,
        },
      })

      return NextResponse.json({
        recentReservations,
        count: recentReservations.length,
      })
    }
  } catch (error) {
    console.error("Erreur lors de la vérification des réservations:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la vérification des réservations",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

