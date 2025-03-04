"use client"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export function AdminNotifications() {
  const { toast } = useToast()

  useEffect(() => {
    // Utiliser le même chemin que ReservationNotifications
    const eventSource = new EventSource("/api/sse/admin-notifications")

    eventSource.addEventListener("connected", () => {
      console.log("Connected to admin notifications")
    })

    eventSource.addEventListener("message", (event) => {
      if (event.data === "ping") return

      try {
        const data = JSON.parse(event.data)

        switch (data.type) {
          case "NEW_RESERVATION":
            toast({
              title: "Nouvelle réservation",
              description: `${data.data.vehicle.brand} ${data.data.vehicle.model}`,
            })
            break

          case "NEW_MESSAGE":
            toast({
              title: "Nouveau message",
              description: `De ${data.data.user.name} pour ${data.data.vehicle.brand} ${data.data.vehicle.model}`,
            })
            break

          default:
            console.log("Unknown notification type:", data.type)
        }
      } catch (error) {
        console.error("Error parsing notification:", error)
      }
    })

    eventSource.addEventListener("error", (error) => {
      console.error("SSE Error:", error)
      eventSource.close()
    })

    return () => {
      eventSource.close()
    }
  }, [toast])

  // Ce composant ne rend rien visuellement
  return null
}

