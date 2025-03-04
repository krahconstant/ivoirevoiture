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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ReservationStatus } from "@/lib/types"

interface UpdateReservationFormProps {
  reservation: {
    id: string
    status: string
  }
}

export function UpdateReservationForm({ reservation }: UpdateReservationFormProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(reservation.status)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de la mise à jour du statut")
      }

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la réservation a été mis à jour avec succès.",
      })

      // Fermer le dialogue et rafraîchir la page
      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du statut",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Modifier le statut
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier le statut de la réservation</DialogTitle>
            <DialogDescription>Choisissez le nouveau statut pour cette réservation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReservationStatus.PENDING}>En attente</SelectItem>
                  <SelectItem value={ReservationStatus.CONFIRMED}>Confirmée</SelectItem>
                  <SelectItem value={ReservationStatus.CANCELLED}>Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

