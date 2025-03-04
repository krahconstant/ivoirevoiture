import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // ID spécifique qui pose problème
    const vehicleId = "cm7tvf6hv002e136u6q9gq8zg"

    // Vérifier avec différentes méthodes
    const results = {
      findUnique: null,
      findFirst: null,
      findMany: null,
      exactMatch: null,
      similarIds: null,
    }

    try {
      results.findUnique = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      })
    } catch (e) {
      results.findUnique = { error: String(e) }
    }

    try {
      results.findFirst = await prisma.vehicle.findFirst({
        where: { id: vehicleId },
      })
    } catch (e) {
      results.findFirst = { error: String(e) }
    }

    try {
      results.findMany = await prisma.vehicle.findMany({
        where: { id: vehicleId },
      })
    } catch (e) {
      results.findMany = { error: String(e) }
    }

    try {
      // Recherche exacte avec SQL brut
      results.exactMatch = await prisma.$queryRaw`SELECT id, brand, model FROM "Vehicle" WHERE id = ${vehicleId}`
    } catch (e) {
      results.exactMatch = { error: String(e) }
    }

    try {
      // Recherche d'IDs similaires
      results.similarIds = await prisma.vehicle.findMany({
        where: {
          id: {
            startsWith: vehicleId.substring(0, 10),
          },
        },
        select: {
          id: true,
          brand: true,
          model: true,
        },
      })
    } catch (e) {
      results.similarIds = { error: String(e) }
    }

    // Vérifier tous les véhicules
    const allVehicles = await prisma.vehicle.findMany({
      select: {
        id: true,
        brand: true,
        model: true,
      },
    })

    return NextResponse.json({
      targetId: vehicleId,
      results,
      allVehicles,
      vehicleCount: allVehicles.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la vérification du véhicule spécifique:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la vérification du véhicule spécifique",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

