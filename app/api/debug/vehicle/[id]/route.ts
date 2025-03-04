import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Récupérer tous les véhicules
    const vehicles = await prisma.vehicle.findMany({
      take: limit,
      select: {
        id: true,
        brand: true,
        model: true,
        type: true,
        price: true,
        available: true,
        _count: {
          select: {
            messages: true,
            reservations: true,
          },
        },
      },
    })

    // Analyser les IDs pour détecter d'éventuels problèmes
    const vehicleAnalysis = vehicles.map((vehicle) => ({
      ...vehicle,
      id_analysis: {
        length: vehicle.id.length,
        containsSpecialChars: /[^a-zA-Z0-9]/.test(vehicle.id),
        containsSpaces: /\s/.test(vehicle.id),
        charCodes: [...vehicle.id].slice(0, 5).map((c) => c.charCodeAt(0)), // Afficher les codes des 5 premiers caractères
      },
    }))

    return NextResponse.json({
      count: vehicles.length,
      vehicles: vehicleAnalysis,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des véhicules",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

