import { UsersDataTable } from "@/components/admin/users-data-table"
import { prisma } from "@/lib/prisma"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          reservations: true,
        },
      },
    },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
      <UsersDataTable data={users} />
    </div>
  )
}

