import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Car, MessageSquare } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { ReservationStatus } from "@/lib/types"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  // Récupérer les statistiques de l'utilisateur
  const [reservationsCount, totalSpent, messagesCount] = await Promise.all([
    prisma.reservation.count({
      where: {
        userId: session.user.id,
        status: {
          in: [ReservationStatus.CONFIRMED, ReservationStatus.PENDING],
        },
      },
    }),
    prisma.reservation
      .aggregate({
        where: {
          userId: session.user.id,
          status: ReservationStatus.CONFIRMED,
        },
        _sum: {
          totalPrice: true,
        },
      })
      .then((result) => result._sum.totalPrice || 0),
    prisma.message.count({
      where: {
        userId: session.user.id,
      },
    }),
  ])

  // Récupérer les réservations récentes
  const recentReservations = await prisma.reservation.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-muted-foreground">Bienvenue sur votre espace personnel VenteIvoire</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservationsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messagesCount}</div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Réservations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentReservations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Vous n'avez pas encore de réservations.</p>
            ) : (
              <div className="space-y-8">
                {recentReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {reservation.vehicle.brand} {reservation.vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reservation.startDate).toLocaleDateString("fr-FR")} au{" "}
                        {new Date(reservation.endDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{formatPrice(reservation.totalPrice)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

