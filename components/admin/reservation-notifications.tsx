"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { formatPrice } from "@/lib/utils"
import { Bell, AlertTriangle } from "lucide-react"

interface ReservationNotification {
  id: string
  vehicle: {
    brand: string
    model: string
  }
  customer: {
    name: string
    email: string
    phone: string
  }
  dates: {
    start: string
    end: string
  }
  totalPrice: number
}

export function ReservationNotifications() {
  const { toast } = useToast()
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<ReservationNotification | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error">("disconnected")

  // Utiliser useRef pour stocker l'eventSource et éviter les fuites de mémoire
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY = 5000 // 5 secondes

  // Fonction pour se connecter au SSE
  const connectSSE = useCallback(() => {
    // Nettoyer toute connexion existante
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    // Incrémenter le compteur de tentatives
    reconnectAttemptsRef.current += 1

    console.log(`Tentative de connexion SSE #${reconnectAttemptsRef.current}...`)
    setConnectionStatus("disconnected")

    // Si nous avons dépassé le nombre maximum de tentatives, arrêter
    if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
      console.log(`Nombre maximum de tentatives atteint (${MAX_RECONNECT_ATTEMPTS}), arrêt des reconnexions`)
      setConnectionStatus("error")
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur de notifications après plusieurs tentatives.",
      })
      return
    }

    try {
      // Utiliser un chemin alternatif pour le SSE
      const sseUrl = "/api/sse/admin-notifications"

      // Créer une nouvelle connexion
      const eventSource = new EventSource(sseUrl)
      eventSourceRef.current = eventSource

      // Gestionnaire d'ouverture
      eventSource.addEventListener("open", () => {
        console.log("Connexion SSE établie")
        setConnectionStatus("connected")
        reconnectAttemptsRef.current = 0 // Réinitialiser le compteur après une connexion réussie

        // Afficher une notification de connexion
        toast({
          title: "Connecté aux notifications",
          description: "Vous recevrez les nouvelles réservations en temps réel",
        })
      })

      // Gestionnaire d'événement "connected"
      eventSource.addEventListener("connected", (event) => {
        console.log("Événement 'connected' reçu:", event)
        setConnectionStatus("connected")
        reconnectAttemptsRef.current = 0 // Réinitialiser le compteur après une connexion réussie
      })

      // Gestionnaire de messages
      eventSource.addEventListener("message", (event) => {
        if (event.data === "ping") return

        console.log("Message SSE reçu:", event.data)

        try {
          const data = JSON.parse(event.data)

          if (data.type === "NEW_RESERVATION") {
            console.log("Nouvelle réservation détectée:", data.data)

            // Afficher une notification toast
            toast({
              title: "Nouvelle réservation",
              description: `${data.data.vehicle.brand} ${data.data.vehicle.model}`,
              action: (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentNotification(data.data)
                    setShowDialog(true)
                  }}
                >
                  Voir les détails
                </Button>
              ),
            })
          }
        } catch (error) {
          console.error("Erreur lors du traitement de la notification:", error)
        }
      })

      // Gestionnaire d'erreurs
      eventSource.addEventListener("error", (event) => {
        console.error("Erreur SSE:", event)
        setConnectionStatus("error")

        // Fermer la connexion en cas d'erreur
        eventSource.close()
        eventSourceRef.current = null

        // Tenter de se reconnecter après un délai
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current)
        }

        reconnectTimerRef.current = setTimeout(() => {
          console.log(`Tentative de reconnexion après erreur...`)
          connectSSE()
        }, RECONNECT_DELAY)

        // Afficher une notification d'erreur seulement si c'est la première tentative
        if (reconnectAttemptsRef.current === 1) {
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "La connexion aux notifications a été perdue. Tentative de reconnexion...",
          })
        }
      })

      // Ajouter un gestionnaire pour les pings pour garder la connexion active
      eventSource.addEventListener("ping", () => {
        console.log("Ping reçu du serveur")
      })
    } catch (error) {
      console.error("Erreur lors de la création de la connexion SSE:", error)
      setConnectionStatus("error")

      // Tenter de se reconnecter après un délai
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }

      reconnectTimerRef.current = setTimeout(() => {
        console.log(`Tentative de reconnexion après erreur de création...`)
        connectSSE()
      }, RECONNECT_DELAY)
    }
  }, [toast])

  // Établir la connexion initiale
  useEffect(() => {
    connectSSE()

    // Nettoyage à la fermeture du composant
    return () => {
      if (eventSourceRef.current) {
        console.log("Fermeture de la connexion SSE")
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
    }
  }, [connectSSE])

  const handleConfirm = async () => {
    if (!currentNotification) return

    try {
      const response = await fetch(`/api/admin/reservations/${currentNotification.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CONFIRMED" }),
      })

      if (!response.ok) throw new Error("Erreur lors de la confirmation")

      toast({
        title: "Réservation confirmée",
        description: "La réservation a été confirmée avec succès.",
      })
      setShowDialog(false)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la confirmation.",
      })
    }
  }

  const handleCancel = async () => {
    if (!currentNotification) return

    try {
      const response = await fetch(`/api/admin/reservations/${currentNotification.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      })

      if (!response.ok) throw new Error("Erreur lors de l'annulation")

      toast({
        title: "Réservation annulée",
        description: "La réservation a été annulée avec succès.",
      })
      setShowDialog(false)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation.",
      })
    }
  }

  // Fonction pour reconnecter manuellement
  const handleReconnect = () => {
    reconnectAttemptsRef.current = 0 // Réinitialiser le compteur
    connectSSE()
  }

  return (
    <>
      {/* Indicateur de statut de connexion */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {connectionStatus === "connected" ? (
          <Bell className="h-5 w-5 text-green-500" />
        ) : (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {connectionStatus === "error" && (
              <Button variant="ghost" size="sm" onClick={handleReconnect} className="h-6 text-xs">
                Reconnecter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialogue de notification */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouvelle réservation</DialogTitle>
            <DialogDescription>Veuillez confirmer ou annuler cette réservation</DialogDescription>
          </DialogHeader>

          {currentNotification && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Véhicule</h3>
                  <p>
                    {currentNotification.vehicle.brand} {currentNotification.vehicle.model}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Prix total</h3>
                  <p>{formatPrice(currentNotification.totalPrice)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Date de début</h3>
                  <p>
                    {format(new Date(currentNotification.dates.start), "PPP", {
                      locale: fr,
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Date de fin</h3>
                  <p>
                    {format(new Date(currentNotification.dates.end), "PPP", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Client</h3>
                <p>{currentNotification.customer.name}</p>
                <p className="text-sm text-muted-foreground">{currentNotification.customer.email}</p>
                <p className="text-sm text-muted-foreground">{currentNotification.customer.phone}</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="destructive" onClick={handleCancel}>
              Annuler la réservation
            </Button>
            <Button onClick={handleConfirm}>Confirmer la réservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

