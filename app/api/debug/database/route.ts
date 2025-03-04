import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Vérifier la connexion à la base de données
    const vehicleCount = await prisma.vehicle.count()

    // Récupérer quelques véhicules pour vérification
    const vehicles = await prisma.vehicle.findMany({
      take: 5,
      select: {
        id: true,
        brand: true,
        model: true,
      },
    })

    // Vérifier spécifiquement le véhicule problématique
    // Remplacez cet ID par celui qui pose problème
    const vehicleId = "cm7tsikmy0002mun7t96vmwra"
    const specificVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    return NextResponse.json({
      status: "connected",
      vehicleCount,
      sampleVehicles: vehicles,
      specificVehicle: specificVehicle
        ? {
            found: true,
            details: specificVehicle,
          }
        : {
            found: false,
            id: vehicleId,
          },
    })
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Erreur de connexion à la base de données",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

