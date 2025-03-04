"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface AdminMessageFormProps {
  vehicleId: string
}

export function AdminMessageForm({ vehicleId }: AdminMessageFormProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!message.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/chat/${vehicleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message")
      }

      setMessage("")
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès.",
      })

      // Rafraîchir la page pour afficher le nouveau message
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Répondre</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Écrivez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !message.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Envoyer
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

