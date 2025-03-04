import { MessagesDataTable } from "@/components/admin/messages-table"
import { prisma } from "@/lib/prisma"
import { convertPrismaRole, type Message } from "@/lib/types"

export default async function AdminMessagesPage() {
  const prismaMessages = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
        },
      },
    },
  })

  // Convertir les messages Prisma en type Message de l'application
  const messages: Message[] = prismaMessages.map((message) => ({
    ...message,
    user: {
      ...message.user,
      role: convertPrismaRole(message.user.role),
    },
  }))

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gestion des messages</h1>
      <MessagesDataTable data={messages} />
    </div>
  )
}

