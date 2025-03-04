"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface Message {
  id: string
  content: string
  createdAt: Date
  userId: string
  vehicleId: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function useAdminChat(vehicleId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  // Charger les messages initiaux et configurer SSE
  useEffect(() => {
    let eventSource: EventSource | null = null

    const connect = () => {
      setIsLoading(true)

      // Charger les messages initiaux
      fetch(`/api/chat-fix/${vehicleId}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages || [])
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error loading messages:", error)
          setIsLoading(false)
        })

      // Configurer SSE pour les messages en temps réel
      eventSource = new EventSource(`/api/chat/${vehicleId}/sse`)

      eventSource.addEventListener("connected", () => {
        setIsConnected(true)
      })

      eventSource.addEventListener("message", (event) => {
        try {
          const message = JSON.parse(event.data)
          setMessages((prev) => {
            // Éviter les doublons
            if (prev.some((m) => m.id === message.id)) {
              return prev
            }
            return [...prev, message]
          })
        } catch (error) {
          console.error("Error parsing message:", error)
        }
      })

      eventSource.addEventListener("error", (error) => {
        console.error("SSE Error:", error)
        setIsConnected(false)
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
  }, [vehicleId])

  // Fonction pour envoyer un message
  const sendMessage = async (content: string) => {
    try {
      const response = await fetch(`/api/chat-fix/${vehicleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const newMessage = await response.json()

      // Ajouter immédiatement le message à l'état local
      setMessages((prev) => [...prev, newMessage])

      return newMessage
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  return {
    messages,
    isLoading,
    isConnected,
    sendMessage,
  }
}

