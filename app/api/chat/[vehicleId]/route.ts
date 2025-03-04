import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendNotification } from "@/lib/sse"
import { Prisma } from "@prisma/client"

export async function POST(request: Request, { params }: { params: { vehicleId: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Le contenu du message est requis" }, { status: 400 })
    }

    // Nettoyer l'ID du véhicule
    const vehicleId = params.vehicleId.trim()
    console.log("Recherche du véhicule avec ID:", vehicleId)

    // Utiliser findFirst au lieu de findUnique
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
      },
    })

    if (!vehicle) {
      console.log("Véhicule non trouvé, recherche avec like...")

      // Essayer de trouver des véhicules avec un ID similaire
      const similarVehicles = await prisma.vehicle.findMany({
        where: {
          id: {
            contains: vehicleId.substring(0, 10), // Utiliser les 10 premiers caractères
          },
        },
        take: 5,
      })

      if (similarVehicles.length > 0) {
        console.log(
          "Véhicules similaires trouvés:",
          similarVehicles.map((v) => v.id),
        )
      }

      return NextResponse.json(
        {
          error: "Le véhicule spécifié n'existe pas",
          vehicleId,
          similarVehicles: similarVehicles.map((v) => ({ id: v.id, brand: v.brand, model: v.model })),
        },
        { status: 404 },
      )
    }

    console.log("Véhicule trouvé:", vehicle)

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Créer le message en utilisant l'ID du véhicule trouvé
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

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error creating message:", error)

    // Vérifier si l'erreur est une erreur Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            error: "Erreur de référence: L'utilisateur ou le véhicule n'existe pas",
            details: error.meta,
          },
          { status: 400 },
        )
      }
    }

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

    // Nettoyer l'ID du véhicule
    const vehicleId = params.vehicleId.trim()
    console.log("Recherche du véhicule avec ID:", vehicleId)

    // Utiliser findFirst au lieu de findUnique
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
      },
    })

    if (!vehicle) {
      console.log("Véhicule non trouvé, recherche avec like...")

      // Essayer de trouver des véhicules avec un ID similaire
      const similarVehicles = await prisma.vehicle.findMany({
        where: {
          id: {
            contains: vehicleId.substring(0, 10), // Utiliser les 10 premiers caractères
          },
        },
        take: 5,
      })

      if (similarVehicles.length > 0) {
        console.log(
          "Véhicules similaires trouvés:",
          similarVehicles.map((v) => v.id),
        )
      }

      return NextResponse.json(
        {
          error: "Le véhicule spécifié n'existe pas",
          vehicleId,
          similarVehicles: similarVehicles.map((v) => ({ id: v.id, brand: v.brand, model: v.model })),
        },
        { status: 404 },
      )
    }

    console.log("Véhicule trouvé:", vehicle)

    const messages = await prisma.message.findMany({
      where: {
        vehicleId: vehicle.id, // Utiliser l'ID du véhicule trouvé
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

    return NextResponse.json({ messages })
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

