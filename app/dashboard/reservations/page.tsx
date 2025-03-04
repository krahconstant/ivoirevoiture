import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

export default async function ReservationsPage() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes réservations</h2>
        <p className="text-muted-foreground">Consultez l'historique de vos réservations</p>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Vous n'avez pas encore de réservations.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {reservation.vehicle.brand} {reservation.vehicle.model}
                  </CardTitle>
                  <Badge
                    variant={
                      reservation.status === "CONFIRMED"
                        ? "success"
                        : reservation.status === "CANCELLED"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {reservation.status === "PENDING"
                      ? "En attente"
                      : reservation.status === "CONFIRMED"
                        ? "Confirmée"
                        : "Annulée"}
                  </Badge>
                </div>
                <CardDescription>Réservation #{reservation.id.substring(0, 8)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Dates de location</p>
                    <p className="text-sm text-muted-foreground">
                      Du {format(new Date(reservation.startDate), "PPP", { locale: fr })} au{" "}
                      {format(new Date(reservation.endDate), "PPP", { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Prix total</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(reservation.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date de réservation</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(reservation.createdAt), "PPP", { locale: fr })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

