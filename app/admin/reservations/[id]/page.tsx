import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ReservationStatus } from "@/lib/types"
import { UpdateReservationStatus } from "@/components/admin/update-reservation-status"
import { ArrowLeft, Calendar, Car, Clock, CreditCard, Mail, Phone, User } from "lucide-react"

export default async function AdminReservationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/reservations/" + params.id)
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: {
      vehicle: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  })

  if (!reservation) {
    redirect("/admin/reservations")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Détails de la réservation</h2>
          <p className="text-muted-foreground">Réservation #{reservation.id.substring(0, 8)}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/reservations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Reservation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de réservation</CardTitle>
            <CardDescription>Détails de la réservation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Statut</span>
              </div>
              <Badge
                variant={
                  reservation.status === ReservationStatus.CONFIRMED
                    ? "success"
                    : reservation.status === ReservationStatus.CANCELLED
                      ? "destructive"
                      : "default"
                }
              >
                {reservation.status === ReservationStatus.PENDING
                  ? "En attente"
                  : reservation.status === ReservationStatus.CONFIRMED
                    ? "Confirmée"
                    : "Annulée"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Période de location</span>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="grid gap-1">
                  <div className="flex justify-between text-sm">
                    <span>Début:</span>
                    <span>{format(new Date(reservation.startDate), "PPP", { locale: fr })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fin:</span>
                    <span>{format(new Date(reservation.endDate), "PPP", { locale: fr })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Paiement</span>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex justify-between">
                  <span>Montant total</span>
                  <span className="font-bold">{formatPrice(reservation.totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dates importantes</span>
              </div>
              <div className="rounded-lg bg-muted p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Créée le:</span>
                  <span>{format(new Date(reservation.createdAt), "PPP à HH:mm", { locale: fr })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mise à jour le:</span>
                  <span>{format(new Date(reservation.updatedAt), "PPP à HH:mm", { locale: fr })}</span>
                </div>
              </div>
            </div>

            <UpdateReservationStatus reservation={reservation} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Véhicule</CardTitle>
              </div>
              <CardDescription>Informations sur le véhicule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Marque</span>
                  <span>{reservation.vehicle.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Modèle</span>
                  <span>{reservation.vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tarif journalier</span>
                  <span>{formatPrice(reservation.vehicle.dailyRate || 0)}</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/vehicles/${reservation.vehicle.id}`}>Voir le véhicule</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Client</CardTitle>
              </div>
              <CardDescription>Informations sur le client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{reservation.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{reservation.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{reservation.phone}</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/users/${reservation.user.id}`}>Voir le profil</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

