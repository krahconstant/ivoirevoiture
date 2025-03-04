import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isValidReservationStatus } from "@/lib/types"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = params
    const { status } = await request.json()

    // Vérifier si le statut est valide
    if (!isValidReservationStatus(status)) {
      return NextResponse.json({ error: "Statut de réservation invalide" }, { status: 400 })
    }

    // Mettre à jour le statut de la réservation
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        vehicle: {
          select: {
            brand: true,
            model: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la réservation" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = params

    // Vérifier si l'utilisateur est admin ou le propriétaire de la réservation
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!reservation) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    // Vérifier si l'utilisateur est autorisé à voir cette réservation
    if (session.user.role !== "ADMIN" && reservation.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la réservation" }, { status: 500 })
  }
}

