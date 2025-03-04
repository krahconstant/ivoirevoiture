"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function TestNotificationButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleClick = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/debug/send-test-notification", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la notification de test")
      }

      const data = await response.json()

      toast({
        title: "Notification de test envoyée",
        description: "Vérifiez que vous recevez la notification",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la notification de test",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} variant="outline" size="sm">
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Tester les notifications
    </Button>
  )
}

