import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function MessagesPage() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  // Récupérer les conversations groupées par véhicule
  const conversations = await prisma.message.findMany({
    where: {
      userId: session.user.id,
    },
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
  })

  // Grouper les messages par véhicule
  const groupedConversations = conversations.reduce(
    (acc, message) => {
      const vehicleId = message.vehicleId
      if (!acc[vehicleId]) {
        acc[vehicleId] = {
          vehicle: message.vehicle,
          messages: [],
          lastMessage: message,
        }
      }
      acc[vehicleId].messages.push(message)
      if (new Date(message.createdAt) > new Date(acc[vehicleId].lastMessage.createdAt)) {
        acc[vehicleId].lastMessage = message
      }
      return acc
    },
    {} as Record<string, { vehicle: any; messages: any[]; lastMessage: any }>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes messages</h2>
        <p className="text-muted-foreground">Consultez vos conversations avec les vendeurs</p>
      </div>

      {Object.keys(groupedConversations).length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Vous n'avez pas encore de messages.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.values(groupedConversations).map((conversation) => (
            <Card key={conversation.vehicle.id}>
              <CardHeader>
                <CardTitle>
                  {conversation.vehicle.brand} {conversation.vehicle.model}
                </CardTitle>
                <CardDescription>
                  Dernier message: {format(new Date(conversation.lastMessage.createdAt), "PPP", { locale: fr })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{conversation.lastMessage.content}</p>
                  <Button asChild>
                    <Link href={`/chat/${conversation.vehicle.id}`}>Voir la conversation</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

