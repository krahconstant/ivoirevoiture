import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendNotification } from "@/lib/sse"

export async function POST(request: Request, { params }: { params: { vehicleId: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { content } = await request.json()
    const requestedVehicleId = params.vehicleId

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Le contenu du message est requis" }, { status: 400 })
    }

    console.log(`Tentative d'envoi de message pour le véhicule ID: ${requestedVehicleId}`)

    // Stratégie 1: Recherche directe
    let vehicle = await prisma.vehicle.findUnique({
      where: { id: requestedVehicleId },
    })

    // Stratégie 2: Si non trouvé, essayer avec findFirst
    if (!vehicle) {
      vehicle = await prisma.vehicle.findFirst({
        where: { id: requestedVehicleId },
      })
      if (vehicle) {
        console.log(`Véhicule trouvé avec findFirst: ${vehicle.id}`)
      }
    }

    // Stratégie 3: Si toujours non trouvé, rechercher par préfixe
    if (!vehicle && requestedVehicleId.length > 10) {
      const prefix = requestedVehicleId.substring(0, 10)
      const similarVehicles = await prisma.vehicle.findMany({
        where: {
          id: {
            startsWith: prefix,
          },
        },
        take: 1,
      })

      if (similarVehicles.length > 0) {
        vehicle = similarVehicles[0]
        console.log(`Véhicule trouvé par préfixe: ${vehicle.id}`)
      }
    }

    // Si aucune stratégie n'a fonctionné, retourner une erreur
    if (!vehicle) {
      console.log(`Aucun véhicule trouvé pour l'ID: ${requestedVehicleId}`)
      return NextResponse.json(
        {
          error: "Véhicule non trouvé",
          requestedId: requestedVehicleId,
        },
        { status: 404 },
      )
    }

    // Créer le message avec l'ID du véhicule trouvé
    const message = await prisma.message.create({
      data: {
        content,
        userId: session.user.id,
        vehicleId: vehicle.id, // Utiliser l'ID du véhicule trouvé
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
    })

    console.log(`Message créé avec succès pour le véhicule ${vehicle.id}`)

    // Si l'utilisateur est un admin, notifier les autres admins
    if (session.user.role === "ADMIN") {
      await sendNotification("NEW_ADMIN_MESSAGE", {
        id: message.id,
        content: message.content,
        user: {
          id: message.user.id,
          name: message.user.name,
        },
        vehicle: message.vehicle,
      })
    }

    return NextResponse.json({
      ...message,
      _debug: {
        requestedId: requestedVehicleId,
        actualId: vehicle.id,
        idMatch: requestedVehicleId === vehicle.id,
      },
    })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la création du message",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request, { params }: { params: { vehicleId: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const requestedVehicleId = params.vehicleId
    console.log(`Tentative de récupération des messages pour le véhicule ID: ${requestedVehicleId}`)

    // Stratégie 1: Recherche directe
    let vehicle = await prisma.vehicle.findUnique({
      where: { id: requestedVehicleId },
    })

    // Stratégie 2: Si non trouvé, essayer avec findFirst
    if (!vehicle) {
      vehicle = await prisma.vehicle.findFirst({
        where: { id: requestedVehicleId },
      })
      if (vehicle) {
        console.log(`Véhicule trouvé avec findFirst: ${vehicle.id}`)
      }
    }

    // Stratégie 3: Si toujours non trouvé, rechercher par préfixe
    if (!vehicle && requestedVehicleId.length > 10) {
      const prefix = requestedVehicleId.substring(0, 10)
      const similarVehicles = await prisma.vehicle.findMany({
        where: {
          id: {
            startsWith: prefix,
          },
        },
        take: 1,
      })

      if (similarVehicles.length > 0) {
        vehicle = similarVehicles[0]
        console.log(`Véhicule trouvé par préfixe: ${vehicle.id}`)
      }
    }

    // Si aucune stratégie n'a fonctionné, retourner une erreur
    if (!vehicle) {
      console.log(`Aucun véhicule trouvé pour l'ID: ${requestedVehicleId}`)
      return NextResponse.json(
        {
          error: "Véhicule non trouvé",
          requestedId: requestedVehicleId,
        },
        { status: 404 },
      )
    }

    // Récupérer les messages avec l'ID du véhicule trouvé
    const messages = await prisma.message.findMany({
      where: {
        vehicleId: vehicle.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({
      messages,
      _debug: {
        requestedId: requestedVehicleId,
        actualId: vehicle.id,
        idMatch: requestedVehicleId === vehicle.id,
        messageCount: messages.length,
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des messages",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

