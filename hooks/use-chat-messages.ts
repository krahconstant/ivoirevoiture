"use client"

import { useState, useEffect } from "react"
import type { Message } from "@/lib/types"

export function useChatMessages(vehicleId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const connect = () => {
      setIsLoading(true)

      // Charger les messages initiaux
      fetch(`/api/chat/${vehicleId}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error loading messages:", error)
          setIsLoading(false)
        })

      // Configurer SSE
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

  const sendMessage = async (content: string) => {
    try {
      const response = await fetch(`/api/chat/${vehicleId}`, {
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
      return newMessage
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  return {
    messages,
    isLoading,
    isConnected, // Now we're returning the isConnected state
    sendMessage,
  }
}

