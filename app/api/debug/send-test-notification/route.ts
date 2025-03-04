import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sendNotification } from "@/lib/sse"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Créer une notification de test
    const testData = {
      id: "test-reservation-" + Date.now(),
      vehicle: {
        brand: "Test",
        model: "Notification",
      },
      customer: {
        name: "Client Test",
        email: "test@example.com",
        phone: "+225 XX XX XX XX XX",
      },
      dates: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      totalPrice: 150000,
    }

    // Envoyer la notification
    await sendNotification("NEW_RESERVATION", testData)

    return NextResponse.json({
      success: true,
      message: "Notification de test envoyée",
      data: testData,
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification de test:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi de la notification de test",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

