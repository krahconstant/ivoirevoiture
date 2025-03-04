"use client"

import { useEffect, useRef, useState } from "react"

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Créer l'élément audio une seule fois au chargement
    audioRef.current = new Audio("/sounds/notification.mp3")

    // Précharger le son
    audioRef.current.load()

    // Marquer comme prêt
    setIsReady(true)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playNotification = async () => {
    if (!isReady || !audioRef.current) return

    try {
      audioRef.current.currentTime = 0
      await audioRef.current.play()
    } catch (error) {
      console.error("Erreur lors de la lecture du son:", error)
    }
  }

  return playNotification
}

