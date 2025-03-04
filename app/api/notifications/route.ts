import { getSession } from "@/lib/auth"
import { UserRole } from "@/lib/types"
import { addAdminClient, removeAdminClient } from "@/lib/notifications"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  console.log("📡 Route des notifications appelée")

  try {
    const session = await getSession()
    console.log("🔑 Session utilisateur:", session?.user?.email)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      console.log("🚫 Accès refusé : utilisateur non administrateur")
      return new Response("Non autorisé", { status: 401 })
    }

    console.log("✅ Administrateur authentifié:", session.user.email)

    let controllerRef: ReadableStreamDefaultController | null = null

    const stream = new ReadableStream({
      start(controller) {
        console.log("🔄 Initialisation du flux de notifications")
        controllerRef = controller
        addAdminClient(controller)

        // Message de confirmation de connexion
        try {
          controller.enqueue('data: {"type":"CONNECTED"}\n\n')
          console.log("✅ Message de connexion envoyé avec succès")
        } catch (error) {
          console.error("❌ Erreur lors de l'envoi du message de connexion:", error)
          throw error
        }
      },
      cancel() {
        console.log("❌ Flux de notifications interrompu")
        if (controllerRef) {
          removeAdminClient(controllerRef)
        }
      },
    })

    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    })

    console.log("📤 Démarrage de l'envoi des notifications")
    return new Response(stream, { headers })
  } catch (error) {
    console.error("❌ Erreur système:", error)
    return new Response("Erreur interne du serveur", { status: 500 })
  }
}

