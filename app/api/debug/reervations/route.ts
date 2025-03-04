import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Récupérer toutes les réservations
    const reservations = await prisma.reservation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      count: reservations.length,
      reservations: reservations.map((r) => ({
        id: r.id,
        status: r.status,
        totalPrice: r.totalPrice,
        startDate: r.startDate,
        endDate: r.endDate,
        user: r.user ? { id: r.user.id, name: r.user.name } : null,
        vehicle: r.vehicle ? { id: r.vehicle.id, brand: r.vehicle.brand, model: r.vehicle.model } : null,
      })),
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des réservations",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

