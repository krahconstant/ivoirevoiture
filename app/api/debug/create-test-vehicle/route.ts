import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Créer un véhicule de test
    const testVehicle = await prisma.vehicle.create({
      data: {
        brand: "Test",
        model: `Test Vehicle ${new Date().toISOString()}`,
        price: 1000,
        type: "LOCATION",
        dailyRate: 100,
        description: "Véhicule de test créé pour le débogage",
        images: ["/placeholder.svg"],
        available: true,
      },
    })

    // Vérifier immédiatement si le véhicule peut être retrouvé
    const foundVehicle = await prisma.vehicle.findUnique({
      where: { id: testVehicle.id },
    })

    return NextResponse.json({
      created: testVehicle,
      found: foundVehicle,
      success: !!foundVehicle,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la création du véhicule de test:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la création du véhicule de test",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

