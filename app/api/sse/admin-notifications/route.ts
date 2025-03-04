import { getSession } from "@/lib/auth"
import { UserRole } from "@/lib/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Stocker les contrôleurs actifs avec leur état et les intervalles associés
const activeControllers = new Map<
  ReadableStreamDefaultController,
  {
    isActive: boolean
    keepAliveInterval: NodeJS.Timeout | null
  }
>()

export async function GET(request: Request) {
  console.log("Nouvelle connexion SSE reçue sur le chemin alternatif")

  const session = await getSession()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    console.log("Connexion SSE refusée: utilisateur non autorisé")
    return new Response("Unauthorized", { status: 401 })
  }

  console.log("Connexion SSE autorisée pour l'admin:", session.user.id)

  const encoder = new TextEncoder()
  let controller: ReadableStreamDefaultController
  let keepAliveInterval: NodeJS.Timeout | null = null

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl
      console.log("Initialisation du stream SSE")

      // Envoyer un message initial de connexion
      controller.enqueue(encoder.encode("event: connected\ndata: true\n\n"))

      // Configurer l'intervalle de keepalive
      keepAliveInterval = setInterval(() => {
        // Vérifier si le contrôleur est toujours actif
        const controllerState = activeControllers.get(controller)
        if (controllerState && controllerState.isActive) {
          try {
            controller.enqueue(encoder.encode("event: ping\ndata: ping\n\n"))
            console.log("Ping SSE envoyé")
          } catch (error) {
            console.error("Erreur de keepalive SSE:", error)

            // Nettoyer l'intervalle
            if (keepAliveInterval) {
              clearInterval(keepAliveInterval)
              keepAliveInterval = null
            }

            // Marquer le contrôleur comme inactif
            if (activeControllers.has(controller)) {
              const state = activeControllers.get(controller)
              if (state) {
                state.isActive = false
                if (state.keepAliveInterval) {
                  clearInterval(state.keepAliveInterval)
                  state.keepAliveInterval = null
                }
              }
            }

            // Supprimer le contrôleur de la liste
            activeControllers.delete(controller)
            console.log(`Client SSE supprimé, total: ${activeControllers.size}`)
          }
        } else {
          // Le contrôleur n'est plus actif, nettoyer
          if (keepAliveInterval) {
            clearInterval(keepAliveInterval)
            keepAliveInterval = null
          }

          activeControllers.delete(controller)
          console.log(`Client SSE inactif supprimé, total: ${activeControllers.size}`)
        }
      }, 30000)

      // Ajouter le contrôleur à la liste avec son état et son intervalle
      activeControllers.set(controller, {
        isActive: true,
        keepAliveInterval,
      })

      console.log(`Client SSE ajouté, total: ${activeControllers.size}`)
    },

    cancel() {
      console.log("Stream SSE annulé par le client")

      // Nettoyer l'intervalle
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval)
        keepAliveInterval = null
      }

      // Supprimer le contrôleur de la liste
      const state = activeControllers.get(controller)
      if (state && state.keepAliveInterval) {
        clearInterval(state.keepAliveInterval)
        state.keepAliveInterval = null
      }

      activeControllers.delete(controller)
      console.log(`Client SSE supprimé (annulation), total: ${activeControllers.size}`)
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

// Fonction pour envoyer une notification à tous les clients actifs
export function sendNotificationToAll(type: string, data: any) {
  const encoder = new TextEncoder()
  const message = `event: message\ndata: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`

  console.log(`Envoi de notification à ${activeControllers.size} clients:`, { type })

  // Liste des contrôleurs à supprimer
  const controllersToRemove: ReadableStreamDefaultController[] = []

  // Envoyer à tous les contrôleurs actifs
  activeControllers.forEach((state, controller) => {
    if (state.isActive) {
      try {
        controller.enqueue(encoder.encode(message))
      } catch (error) {
        console.error("Erreur lors de l'envoi de notification:", error)

        // Marquer pour suppression
        controllersToRemove.push(controller)

        // Nettoyer l'intervalle
        if (state.keepAliveInterval) {
          clearInterval(state.keepAliveInterval)
          state.keepAliveInterval = null
        }
      }
    } else {
      // Contrôleur inactif, marquer pour suppression
      controllersToRemove.push(controller)

      // Nettoyer l'intervalle
      if (state.keepAliveInterval) {
        clearInterval(state.keepAliveInterval)
        state.keepAliveInterval = null
      }
    }
  })

  // Supprimer les contrôleurs marqués
  controllersToRemove.forEach((controller) => {
    activeControllers.delete(controller)
  })

  if (controllersToRemove.length > 0) {
    console.log(`${controllersToRemove.length} clients SSE supprimés, total restant: ${activeControllers.size}`)
  }

  return {
    success: true,
    sentTo: activeControllers.size,
    removed: controllersToRemove.length,
  }
}

// Exporter la liste des contrôleurs actifs pour le débogage
export { activeControllers }

