"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Car, Calendar } from "lucide-react"

interface AdminDashboardProps {
  stats: {
    usersCount: number
    vehiclesCount: number
    reservationsCount: number
    totalRevenue: number
  }
  recentReservations: Array<{
    id: string
    totalPrice: number
    createdAt: Date
    user: {
      name: string
    }
    vehicle: {
      brand: string
      model: string
    }
  }>
  newUsers: Array<{
    id: string
    name: string
    email: string
    createdAt: Date
  }>
}

export function AdminDashboard({ stats, recentReservations, newUsers }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vehiclesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservationsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("fr-CI", {
                style: "currency",
                currency: "XOF",
              }).format(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Réservations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {reservation.vehicle.brand} {reservation.vehicle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">Réservé par {reservation.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat("fr-CI", {
                        style: "currency",
                        currency: "XOF",
                      }).format(reservation.totalPrice)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reservation.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Nouveaux utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

