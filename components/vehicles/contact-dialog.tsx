"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface ContactDialogProps {
  vehicleId: string
  children: React.ReactNode
}

export function ContactDialog({ vehicleId, children }: ContactDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          vehicleId,
          content: formData.get("message"),
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message")
      }

      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      })
      setOpen(false)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Contacter le vendeur</DialogTitle>
            <DialogDescription>
              Envoyez un message au vendeur pour plus d'informations sur ce véhicule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" placeholder="Votre nom" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="votre@email.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Votre message..." required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

