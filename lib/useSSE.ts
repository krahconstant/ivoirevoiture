"use client"

import { useEffect, useRef } from "react"

interface UseSSEOptions {
  endpoint: string
  onMessage: (data: any) => void
  onError?: (error: any) => void
  onConnected?: () => void
}

export function useSSE({ endpoint, onMessage, onError, onConnected }: UseSSEOptions) {
  const eventSourceRef = useRef<EventSource | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const retryCountRef = useRef(0)
  const MAX_RETRIES = 5
  const RETRY_DELAY = 5000

  useEffect(() => {
    function setupEventSource() {
      console.log(`🔄 Connexion SSE à ${endpoint}...`)

      if (eventSourceRef.current) {
        console.log("🔌 Fermeture de la connexion existante")
        eventSourceRef.current.close()
      }

      try {
        eventSourceRef.current = new EventSource(endpoint, {
          withCredentials: true,
        })

        eventSourceRef.current.onopen = () => {
          console.log("✅ Connexion SSE établie")
          retryCountRef.current = 0
          onConnected?.()
        }

        eventSourceRef.current.onmessage = (event) => {
          console.log("📨 Message reçu:", event.data)
          try {
            const data = JSON.parse(event.data)
            onMessage(data)
          } catch (error) {
            console.error("❌ Erreur parsing message:", error)
          }
        }

        eventSourceRef.current.onerror = (error) => {
          console.error("❌ Erreur SSE:", error)
          if (eventSourceRef.current) {
            eventSourceRef.current.close()
          }

          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++
            console.log(`🔄 Tentative ${retryCountRef.current}/${MAX_RETRIES}...`)

            retryTimeoutRef.current = setTimeout(() => {
              setupEventSource()
            }, RETRY_DELAY)
          } else {
            console.error("❌ Nombre maximum de tentatives atteint")
            onError?.(error)
          }
        }
      } catch (error) {
        console.error("❌ Erreur création EventSource:", error)
        onError?.(error)
      }
    }

    setupEventSource()

    return () => {
      console.log("🧹 Nettoyage SSE")
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [endpoint, onMessage, onError, onConnected])
}