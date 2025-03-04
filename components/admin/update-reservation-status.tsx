"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { ReservationStatus } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface UpdateReservationStatusProps {
  reservation: {
    id: string
    status: string
  }
}

export function UpdateReservationStatus({ reservation }: UpdateReservationStatusProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleStatusUpdate = async (newStatus: ReservationStatus) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update reservation status")
      }

      toast({
        title: "Statut mis à jour",
        description: `La réservation a été ${
          newStatus === ReservationStatus.CONFIRMED ? "confirmée" : "annulée"
        } avec succès.`,
      })

      // Close dialogs
      setIsConfirmDialogOpen(false)
      setIsCancelDialogOpen(false)

      // Refresh the page
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (reservation.status !== ReservationStatus.PENDING) {
    return null
  }

  return (
    <div className="flex gap-2">
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <div className="flex gap-2">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => setIsConfirmDialogOpen(true)}
              disabled={isLoading}
            >
              Confirmer
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setIsCancelDialogOpen(true)}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>

          {/* Confirm Dialog */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la réservation</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir confirmer cette réservation ? Le client sera notifié par email.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button onClick={() => handleStatusUpdate(ReservationStatus.CONFIRMED)} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmation...
                  </>
                ) : (
                  "Confirmer"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>

          {/* Cancel Dialog */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Annuler la réservation</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isLoading}>
                Retour
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate(ReservationStatus.CANCELLED)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Annulation...
                  </>
                ) : (
                  "Annuler la réservation"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Dialog>
    </div>
  )
}

