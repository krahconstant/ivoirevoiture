import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Map pour stocker les redirections d'ID de véhicule
const vehicleIdRedirects = new Map<string, string>()

export async function POST(request: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { vehicleId, content } = await request.json()

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Le contenu du message est requis" }, { status: 400 })
    }

    // Vérifier si nous avons une redirection pour cet ID
    const targetVehicleId = vehicleIdRedirects.get(vehicleId) || vehicleId

    // Rechercher le véhicule
    let vehicle = await prisma.vehicle.findUnique({
      where: { id: targetVehicleId },
    })

    // Si le véhicule n'est pas trouvé, créer un véhicule de remplacement
    if (!vehicle) {
      console.log(`Véhicule non trouvé, création d'un véhicule de remplacement pour ${targetVehicleId}`)

      try {
        // Créer un nouveau véhicule
        vehicle = await prisma.vehicle.create({
          data: {
            brand: "Véhicule de remplacement",
            model: `Remplace ${targetVehicleId.substring(0, 8)}...`,
            price: 1000,
            type: "LOCATION",
            dailyRate: 100,
            description: "Ce véhicule a été créé automatiquement pour remplacer un véhicule manquant",
            images: ["/placeholder.svg"],
            available: true,
          },
        })

        // Stocker la redirection
        vehicleIdRedirects.set(vehicleId, vehicle.id)
        console.log(`Redirection créée: ${vehicleId} -> ${vehicle.id}`)
      } catch (error) {
        console.error("Erreur lors de la création du véhicule de remplacement:", error)
        return NextResponse.json(
          {
            error: "Impossible de créer un véhicule de remplacement",
            details: String(error),
          },
          { status: 500 },
        )
      }
    }

    // Créer le message avec l'ID du véhicule trouvé ou créé
    const message = await prisma.message.create({
      data: {
        content,
        userId: session.user.id,
        vehicleId: vehicle.id,
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

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Erreur lors de la création du message" }, { status: 500 })
  }
}

