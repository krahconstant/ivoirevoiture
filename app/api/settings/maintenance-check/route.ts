import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Vérifier si la requête vient du middleware
    const isMiddlewareRequest = request.headers.get("x-middleware-request") === "true"

    if (!isMiddlewareRequest) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const settings = await prisma.siteSettings.findFirst()

    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode || false,
    })
  } catch (error) {
    console.error("Erreur lors de la vérification du mode maintenance:", error)
    return NextResponse.json({ maintenanceMode: false })
  }
}

