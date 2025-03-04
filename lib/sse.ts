import type { ReadableStreamDefaultController } from "stream/web"

type SSEClient = {
  id: string
  controller: ReadableStreamDefaultController
  isActive: boolean
  keepAliveInterval: NodeJS.Timeout | null
}

// Utiliser une variable globale pour stocker les clients
const clients = new Set<SSEClient>()

export function addClient(controller: ReadableStreamDefaultController) {
  // Créer un intervalle de keepalive
  const keepAliveInterval = setInterval(() => {
    try {
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode("event: ping\ndata: ping\n\n"))
    } catch (error) {
      // Si une erreur se produit, nettoyer le client
      console.error("Erreur de keepalive:", error)

      // Trouver et supprimer le client
      for (const client of clients) {
        if (client.controller === controller) {
          if (client.keepAliveInterval) {
            clearInterval(client.keepAliveInterval)
            client.keepAliveInterval = null
          }
          client.isActive = false
          clients.delete(client)
          console.log(`Client SSE supprimé après erreur de keepalive, total: ${clients.size}`)
          break
        }
      }
    }
  }, 30000)

  const client: SSEClient = {
    id: Math.random().toString(36).slice(2),
    controller,
    isActive: true,
    keepAliveInterval,
  }

  clients.add(client)
  console.log(`Client SSE ajouté, total: ${clients.size}`)
  return client.id
}

export function removeClient(controller: ReadableStreamDefaultController) {
  for (const client of clients) {
    if (client.controller === controller) {
      // Nettoyer l'intervalle
      if (client.keepAliveInterval) {
        clearInterval(client.keepAliveInterval)
        client.keepAliveInterval = null
      }

      // Marquer comme inactif avant de supprimer
      client.isActive = false
      clients.delete(client)
      console.log(`Client SSE supprimé, total: ${clients.size}`)
      break
    }
  }
}

export function broadcastMessage(message: unknown) {
  const data = `data: ${JSON.stringify(message)}\n\n`
  const encoder = new TextEncoder()

  console.log(`Diffusion d'un message à ${clients.size} clients:`, message)

  let successCount = 0
  let errorCount = 0
  const inactiveClients: SSEClient[] = []

  clients.forEach((client) => {
    // Ne pas essayer d'envoyer aux clients inactifs
    if (!client.isActive) {
      inactiveClients.push(client)
      return
    }

    try {
      client.controller.enqueue(encoder.encode(data))
      successCount++
    } catch (error) {
      console.error("Erreur lors de la diffusion au client:", error)

      // Nettoyer l'intervalle
      if (client.keepAliveInterval) {
        clearInterval(client.keepAliveInterval)
        client.keepAliveInterval = null
      }

      client.isActive = false
      inactiveClients.push(client)
      errorCount++
    }
  })

  // Nettoyer les clients inactifs après la diffusion
  inactiveClients.forEach((client) => {
    clients.delete(client)
  })

  console.log(
    `Message diffusé: ${successCount} succès, ${errorCount} erreurs, ${inactiveClients.length} clients supprimés`,
  )
}

// Fonction utilitaire pour envoyer une notification
export async function sendNotification(type: string, data: unknown) {
  const notification = {
    type,
    timestamp: new Date().toISOString(),
    data,
  }

  console.log(`Envoi d'une notification de type ${type}:`, data)

  // Utiliser la fonction sendNotificationToAll de la route SSE si disponible
  try {
    // Importer dynamiquement la fonction
    const { sendNotificationToAll } = await import("@/app/api/sse/admin-notifications/route")
    if (typeof sendNotificationToAll === "function") {
      return sendNotificationToAll(type, data)
    }
  } catch (error) {
    console.log("Utilisation de la méthode de diffusion standard")
    // Continuer avec la méthode standard si l'import échoue
  }

  // Méthode standard
  broadcastMessage(notification)

  return { success: true, type, timestamp: new Date().toISOString() }
}

// Exporter clients pour le débogage
export { clients }

