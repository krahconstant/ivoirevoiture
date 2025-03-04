import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Récupérer tous les messages groupés par véhicule
    const messages = await prisma.message.findMany({
      where: {
        // Ajouter une condition pour les messages non lus si vous implémentez cette fonctionnalité
        // read: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
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

    // Grouper les messages par véhicule
    const groupedMessages = messages.reduce(
      (acc, message) => {
        const vehicleId = message.vehicleId
        if (!acc[vehicleId]) {
          acc[vehicleId] = {
            vehicle: message.vehicle,
            messages: [],
            unreadCount: 0,
            lastMessage: message,
          }
        }
        acc[vehicleId].messages.push(message)
        // Incrémenter le compteur de messages non lus si nécessaire
        if (message.user.role !== "ADMIN") {
          acc[vehicleId].unreadCount++
        }
        if (new Date(message.createdAt) > new Date(acc[vehicleId].lastMessage.createdAt)) {
          acc[vehicleId].lastMessage = message
        }
        return acc
      },
      {} as Record<string, { vehicle: any; messages: any[]; unreadCount: number; lastMessage: any }>,
    )

    return NextResponse.json({ conversations: Object.values(groupedMessages) })
  } catch (error) {
    console.error("Error fetching unread messages:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des messages" }, { status: 500 })
  }
}

