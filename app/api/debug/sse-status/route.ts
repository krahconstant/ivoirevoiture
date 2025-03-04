import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

// Accéder à la variable clients depuis lib/sse.ts
// @ts-ignore - Accès à une variable privée pour le débogage
import { clients } from "@/lib/sse"

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // @ts-ignore - Accès à une variable privée pour le débogage
    const clientCount = clients ? clients.size : "Non disponible"

    return NextResponse.json({
      status: "ok",
      clientCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la vérification du statut SSE:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la vérification du statut SSE",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

