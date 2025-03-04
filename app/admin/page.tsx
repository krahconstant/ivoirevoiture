import { prisma } from "@/lib/prisma"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { TestNotificationButton } from "@/components/admin/test-notification-button"

export default async function AdminPage() {
  // Récupérer les statistiques
  const [usersCount, vehiclesCount, reservationsCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.vehicle.count(),
    prisma.reservation.count(),
    prisma.reservation
      .aggregate({
        where: {
          status: "CONFIRMED",
        },
        _sum: {
          totalPrice: true,
        },
      })
      .then((result) => result._sum.totalPrice || 0),
  ])

  // Récupérer les réservations récentes
  const recentReservations = await prisma.reservation.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      vehicle: {
        select: {
          brand: true,
          model: true,
        },
      },
    },
  })

  // Récupérer les nouveaux utilisateurs
  const newUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord administrateur</h2>
        <TestNotificationButton />
      </div>

      <AdminDashboard
        stats={{
          usersCount,
          vehiclesCount,
          reservationsCount,
          totalRevenue,
        }}
        recentReservations={recentReservations}
        newUsers={newUsers}
      />
    </div>
  )
}

