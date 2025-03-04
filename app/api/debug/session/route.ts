import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    // Utiliser une assertion de type pour éviter l'erreur TypeScript
    const sessionData = session as any

    // Ne pas exposer de données sensibles
    const safeSession = session
      ? {
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
          },
          // Inclure d'autres propriétés si nécessaire
          // expires: sessionData.expires, // Utiliser seulement si cette propriété existe réellement
        }
      : null

    return NextResponse.json({
      session: safeSession,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la session" }, { status: 500 })
  }
}

