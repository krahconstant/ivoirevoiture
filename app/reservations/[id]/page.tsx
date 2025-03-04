import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"
import { ReservationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

export default async function ReservationConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/reservations/" + params.id)
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: {
      vehicle: true,
    },
  })

  // Assurons-nous que la page gère correctement le cas où la réservation n'est pas trouvée
  if (!reservation) {
    console.error(`Réservation non trouvée: ${params.id}`)
    redirect("/reservations")
  }

  // Ajoutons des logs pour le débogage
  console.log(`Affichage de la réservation: ${params.id}`, {
    status: reservation.status,
    vehicle: `${reservation.vehicle.brand} ${reservation.vehicle.model}`,
  })

  // Vérifier si l'utilisateur est autorisé à voir cette réservation
  if (session.user.role !== "ADMIN" && reservation.userId !== session.user.id) {
    redirect("/reservations")
  }

  const isConfirmed = reservation.status === ReservationStatus.CONFIRMED
  const isCancelled = reservation.status === ReservationStatus.CANCELLED

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isConfirmed ? (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              ) : isCancelled ? (
                <XCircle className="h-16 w-16 text-red-500" />
              ) : (
                <CheckCircle2 className="h-16 w-16 text-yellow-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isConfirmed ? "Réservation confirmée" : isCancelled ? "Réservation annulée" : "Réservation en attente"}
            </CardTitle>
            <CardDescription>
              {isConfirmed
                ? "Votre réservation a été confirmée avec succès"
                : isCancelled
                  ? "Cette réservation a été annulée"
                  : "Votre réservation est en cours de traitement"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Véhicule</h3>
                  <p className="text-lg font-semibold">
                    {reservation.vehicle.brand} {reservation.vehicle.model}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      isConfirmed && "text-green-500",
                      isCancelled && "text-red-500",
                      !isConfirmed && !isCancelled && "text-yellow-500",
                    )}
                  >
                    {isConfirmed ? "Confirmée" : isCancelled ? "Annulée" : "En attente"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date de début</h3>
                  <p className="text-lg font-semibold">
                    {format(new Date(reservation.startDate), "PPP", { locale: fr })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date de fin</h3>
                  <p className="text-lg font-semibold">
                    {format(new Date(reservation.endDate), "PPP", { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                  <p className="text-lg font-semibold">{reservation.name}</p>
                  <p className="text-sm text-muted-foreground">{reservation.email}</p>
                  <p className="text-sm text-muted-foreground">{reservation.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Prix total</h3>
                  <p className="text-lg font-semibold">{formatPrice(reservation.totalPrice)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button asChild variant="outline">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
              <Button asChild>
                <Link href="/vehicules">Voir d'autres véhicules</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

