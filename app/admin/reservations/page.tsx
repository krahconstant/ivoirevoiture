import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ReservationsDataTable } from "@/components/admin/reservations-table"
import { convertPrismaReservation } from "@/lib/types"

export default async function AdminReservationsPage() {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/reservations")
  }

  // Récupérer toutes les réservations
  const prismaReservations = await prisma.reservation.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          dailyRate: true,
          type: true,
          price: true,
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Convertir les réservations Prisma en type Reservation
  const reservations = prismaReservations.map(convertPrismaReservation)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestion des réservations</h2>
        <p className="text-muted-foreground">Consultez et gérez toutes les réservations</p>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-muted p-4 rounded-md">
          <p className="text-center text-muted-foreground">Aucune réservation trouvée</p>
        </div>
      ) : (
        <ReservationsDataTable data={reservations} />
      )}
    </div>
  )
}

