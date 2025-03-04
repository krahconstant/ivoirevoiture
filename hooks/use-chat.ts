"use client"

import { useEffect, useState } from "react"

interface Message {
  id: string
  content: string
  role: "user" | "agent"
  timestamp: string
}

export function useChat(vehicleId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const initializeChat = async () => {
      try {
        // Charger les messages existants
        const res = await fetch(`/api/chat/${vehicleId}`)
        if (!res.ok) throw new Error("Failed to fetch messages")
        const data = await res.json()
        setMessages(data)

        // Configurer SSE pour les nouveaux messages
        eventSource = new EventSource(`/api/chat/${vehicleId}/stream`)

        eventSource.onmessage = (event) => {
          try {
            if (event.data !== "keepalive") {
              const message = JSON.parse(event.data)
              setMessages((prev) => [...prev, message])
            }
          } catch (error) {
            console.error("Error parsing message:", error)
          }
        }

        eventSource.onerror = () => {
          // Tentative de reconnexion après 3 secondes
          setTimeout(() => {
            eventSource?.close()
            initializeChat()
          }, 3000)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        console.error("Chat error:", error)
      }
    }

    initializeChat()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [vehicleId])

  return { messages, error }
}

