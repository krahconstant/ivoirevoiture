"use client"

import { Button } from "@/components/ui/button"
import { useNotificationSound } from "@/lib/useNotificationSound"

export function SoundTest() {
  const playNotification = useNotificationSound()

  return (
    <Button onClick={playNotification} variant="outline">
      Tester le son de notification
    </Button>
  )
}

