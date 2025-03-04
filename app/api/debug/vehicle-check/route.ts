import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get("id")

    if (!vehicleId) {
      return NextResponse.json({ error: "ID de véhicule requis" }, { status: 400 })
    }

    // Vérifier si le véhicule existe avec findUnique
    const vehicleUnique = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    // Vérifier également avec findFirst pour comparer
    const vehicleFirst = await prisma.vehicle.findFirst({
      where: { id: vehicleId },
    })

    // Vérifier avec une requête brute SQL (si possible avec votre configuration)
    let rawResult = null
    try {
      // Cette partie peut nécessiter des ajustements selon votre configuration
      rawResult = await prisma.$queryRaw`SELECT id, brand, model FROM "Vehicle" WHERE id = ${vehicleId}`
    } catch (e) {
      console.error("Erreur de requête brute:", e)
      rawResult = { error: String(e) }
    }

    // Vérifier les messages liés à ce véhicule
    const messageCount = await prisma.message.count({
      where: { vehicleId },
    })

    return NextResponse.json({
      vehicleId,
      findUnique: vehicleUnique ? { found: true, data: vehicleUnique } : { found: false },
      findFirst: vehicleFirst ? { found: true, data: vehicleFirst } : { found: false },
      rawQuery: rawResult,
      messageCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la vérification du véhicule:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la vérification du véhicule",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

