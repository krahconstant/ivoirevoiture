"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// Simuler une base de données de messages
const messages = new Map<
  string,
  Array<{
    id: string
    content: string
    role: "user" | "agent"
    timestamp: string
  }>
>()

// Simuler une base de données de réservations
const reservations = new Map<
  string,
  {
    id: string
    vehicleId: string
    userId: string
    startDate: Date
    endDate: Date
    status: "pending" | "confirmed" | "cancelled"
    createdAt: Date
  }
>()

export async function sendMessage(data: { content: string; vehicleId: string }) {
  const message = {
    id: crypto.randomUUID(),
    content: data.content,
    role: "user" as const,
    timestamp: new Date().toISOString(),
  }

  const vehicleMessages = messages.get(data.vehicleId) || []
  messages.set(data.vehicleId, [...vehicleMessages, message])

  revalidatePath(`/api/chat/${data.vehicleId}`)

  setTimeout(() => {
    const agentMessage = {
      id: crypto.randomUUID(),
      content: "Merci pour votre message. Un agent vous répondra bientôt.",
      role: "agent" as const,
      timestamp: new Date().toISOString(),
    }
    const updatedMessages = messages.get(data.vehicleId) || []
    messages.set(data.vehicleId, [...updatedMessages, agentMessage])
    revalidatePath(`/api/chat/${data.vehicleId}`)
  }, 1000)

  return { success: true }
}

export async function createReservation(data: {
  vehicleId: string
  startDate: Date
  endDate: Date
}) {
  // Vérifier si l'utilisateur est connecté
  const session = cookies().get("session")
  if (!session) {
    throw new Error("Vous devez être connecté pour effectuer une réservation")
  }

  // Simuler la création d'une réservation
  const reservationId = crypto.randomUUID()

  const reservation = {
    id: reservationId,
    vehicleId: data.vehicleId,
    userId: session.value,
    startDate: data.startDate,
    endDate: data.endDate,
    status: "pending" as const,
    createdAt: new Date(),
  }

  // Sauvegarder la réservation
  reservations.set(reservationId, reservation)

  // Revalider les pages concernées
  revalidatePath(`/vehicules/${data.vehicleId}`)
  revalidatePath("/reservations")

  return reservation
}

export { default }

