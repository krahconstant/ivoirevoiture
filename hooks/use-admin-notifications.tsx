"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface AdminNotification {
  type: string
  reservation?: {
    id: string
    vehicle: {
      brand: string
      model: string
    }
    startDate: string
    endDate: string
  }
  message?: {
    id: string
    content: string
    user: {
      name: string
    }
    vehicle: {
      brand: string
      model: string
    }
  }
}

export function useAdminNotifications() {
  const { toast } = useToast()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const connect = () => {
      eventSource = new EventSource("/api/admin/notifications/sse")

      eventSource.addEventListener("connected", () => {
        setConnected(true)
      })

      eventSource.addEventListener("message", (event) => {
        if (event.data === "ping") return

        try {
          const data: AdminNotification = JSON.parse(event.data)

          switch (data.type) {
            case "NEW_RESERVATION":
              if (data.reservation) {
                toast({
                  title: "Nouvelle réservation",
                  description: `${data.reservation.vehicle.brand} ${data.reservation.vehicle.model}`,
                })
              }
              break

            case "NEW_MESSAGE":
              if (data.message) {
                toast({
                  title: "Nouveau message",
                  description: `De ${data.message.user.name} pour ${data.message.vehicle.brand} ${data.message.vehicle.model}`,
                })
              }
              break

            default:
              console.log("Unknown notification type:", data.type)
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error)
        }
      })

      eventSource.addEventListener("error", (error) => {
        console.error("SSE Error:", error)
        setConnected(false)
        eventSource?.close()
        // Tentative de reconnexion après 5 secondes
        setTimeout(connect, 5000)
      })
    }

    connect()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [toast])

  return { connected }
}

