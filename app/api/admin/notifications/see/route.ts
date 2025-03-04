import { getSession } from "@/lib/auth"
import { UserRole } from "@/lib/types"
import { addClient, removeClient } from "@/lib/sse"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  console.log("Nouvelle connexion SSE reçue")

  const session = await getSession()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    console.log("Connexion SSE refusée: utilisateur non autorisé")
    return new Response("Unauthorized", { status: 401 })
  }

  console.log("Connexion SSE autorisée pour l'admin:", session.user.id)

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      console.log("Initialisation du stream SSE")

      // Envoyer un message initial de connexion
      controller.enqueue(encoder.encode("event: connected\ndata: true\n\n"))

      // Ajouter le client à la liste
      addClient(controller)

      // Garder la connexion active
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode("event: ping\ndata: ping\n\n"))
          console.log("Ping SSE envoyé")
        } catch (error) {
          console.error("Erreur de keepalive SSE:", error)
          clearInterval(keepAlive)
          removeClient(controller)
        }
      }, 30000)

      // Nettoyer à la fermeture
      return () => {
        console.log("Fermeture de la connexion SSE")
        clearInterval(keepAlive)
        removeClient(controller)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}

