interface AdminClient {
  controller: ReadableStreamDefaultController
  keepAliveInterval: NodeJS.Timeout
  lastActivity: number
}

const adminClients = new Set<AdminClient>()
const INACTIVE_TIMEOUT = 60000 // 60 secondes

export function addAdminClient(controller: ReadableStreamDefaultController) {
  console.log("👥 Nouveau client admin connecté")

  const keepAliveInterval = setInterval(() => {
    try {
      controller.enqueue(": keepalive\n\n")
      console.log("💓 Keepalive envoyé")

      // Mettre à jour le timestamp d'activité
      for (const client of adminClients) {
        if (client.controller === controller) {
          client.lastActivity = Date.now()
          break
        }
      }
    } catch (error) {
      console.error("❌ Erreur keepalive:", error)
      removeAdminClient(controller)
    }
  }, 30000)

  const client = {
    controller,
    keepAliveInterval,
    lastActivity: Date.now(),
  }

  adminClients.add(client)
  console.log("📊 Nombre de clients connectés:", adminClients.size)
}

export function removeAdminClient(controller: ReadableStreamDefaultController) {
  console.log("🔌 Déconnexion d'un client admin")

  for (const client of adminClients) {
    if (client.controller === controller) {
      clearInterval(client.keepAliveInterval)
      adminClients.delete(client)
      break
    }
  }

  console.log("📊 Nombre de clients restants:", adminClients.size)
}

export async function notifyAdmins(message: any) {
  console.log("📨 Envoi d'une notification aux admins")

  // Nettoyer les clients inactifs
  const now = Date.now()
  for (const client of adminClients) {
    if (now - client.lastActivity > INACTIVE_TIMEOUT) {
      console.log("🧹 Suppression d'un client inactif")
      removeAdminClient(client.controller)
    }
  }

  console.log("📊 Nombre de clients actifs:", adminClients.size)

  // Envoyer via SSE
  const data = `data: ${JSON.stringify(message)}\n\n`
  const clientsToRemove = new Set<AdminClient>()

  for (const client of adminClients) {
    try {
      client.controller.enqueue(data)
      client.lastActivity = Date.now()
      console.log("✅ Notification SSE envoyée à un client")
    } catch (error) {
      console.error("❌ Erreur d'envoi SSE:", error)
      clientsToRemove.add(client)
    }
  }

  // Nettoyer les clients déconnectés
  for (const client of clientsToRemove) {
    removeAdminClient(client.controller)
  }
}