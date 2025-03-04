import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/utils"
import { ReservationStatus } from "@/lib/types"
import { ArrowLeft, Calendar, Clock, CreditCard, Mail, MapPin, Phone, User } from "lucide-react"

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/users/" + params.id)
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) {
    redirect("/admin/users")
  }

  // Fetch user's reservations
  const reservations = await prisma.reservation.findMany({
    where: { userId: params.id },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          dailyRate: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Fetch user's messages
  const messages = await prisma.message.findMany({
    where: { userId: params.id },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Limit to the 10 most recent messages
  })

  // Calculate some statistics
  const totalReservations = reservations.length
  const confirmedReservations = reservations.filter((r) => r.status === ReservationStatus.CONFIRMED).length
  const pendingReservations = reservations.filter((r) => r.status === ReservationStatus.PENDING).length
  const cancelledReservations = reservations.filter((r) => r.status === ReservationStatus.CANCELLED).length
  const totalSpent = reservations
    .filter((r) => r.status === ReservationStatus.CONFIRMED)
    .reduce((sum, r) => sum + r.totalPrice, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profil utilisateur</h2>
          <p className="text-muted-foreground">Détails et activité de l'utilisateur</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Détails du profil utilisateur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{user.name}</span>
              </div>
              <Badge variant={user.role === "ADMIN" ? "destructive" : "default"} className="w-fit">
                {user.role === "ADMIN" ? "Administrateur" : "Client"}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || "Non renseigné"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{"Adresse non renseignée"}</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Inscrit le {format(new Date(user.createdAt), "PPP", { locale: fr })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Statistics Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>Activité et historique de l'utilisateur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="text-xs font-medium text-muted-foreground">Réservations</div>
                <div className="mt-1 text-2xl font-bold">{totalReservations}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs font-medium text-muted-foreground">Confirmées</div>
                <div className="mt-1 text-2xl font-bold text-green-600">{confirmedReservations}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs font-medium text-muted-foreground">En attente</div>
                <div className="mt-1 text-2xl font-bold text-yellow-600">{pendingReservations}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs font-medium text-muted-foreground">Annulées</div>
                <div className="mt-1 text-2xl font-bold text-red-600">{cancelledReservations}</div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Total dépensé</div>
                <div className="text-xl font-bold">{formatPrice(totalSpent)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Reservations and Messages */}
      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des réservations</CardTitle>
              <CardDescription>Liste des réservations passées par l'utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              {reservations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Aucune réservation trouvée pour cet utilisateur.
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex flex-col sm:flex-row justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {format(new Date(reservation.startDate), "dd/MM/yyyy", { locale: fr })} -{" "}
                            {format(new Date(reservation.endDate), "dd/MM/yyyy", { locale: fr })}
                          </span>
                        </div>
                        <div className="text-sm">
                          {reservation.vehicle.brand} {reservation.vehicle.model}
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{formatPrice(reservation.totalPrice)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
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
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/reservations/${reservation.id}`}>Détails</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages récents</CardTitle>
              <CardDescription>Derniers messages envoyés par l'utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Aucun message trouvé pour cet utilisateur.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {message.vehicle.brand} {message.vehicle.model}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(message.createdAt), "PPP à HH:mm", { locale: fr })}
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/messages/${message.vehicleId}`}>Voir la conversation</Link>
                        </Button>
                      </div>
                      <p className="mt-2 text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

