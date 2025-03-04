import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function AdminMessagesPage() {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/messages")
  }

  // Récupérer tous les messages groupés par véhicule
  const messages = await prisma.message.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
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
    orderBy: {
      createdAt: "desc",
    },
  })

  // Grouper les messages par véhicule
  const groupedMessages = messages.reduce(
    (acc, message) => {
      const vehicleId = message.vehicleId
      if (!acc[vehicleId]) {
        acc[vehicleId] = {
          vehicle: message.vehicle,
          messages: [],
          unreadCount: 0,
          lastMessage: message,
        }
      }
      acc[vehicleId].messages.push(message)
      if (new Date(message.createdAt) > new Date(acc[vehicleId].lastMessage.createdAt)) {
        acc[vehicleId].lastMessage = message
      }
      return acc
    },
    {} as Record<string, { vehicle: any; messages: any[]; unreadCount: number; lastMessage: any }>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">Gérez les messages des clients</p>
      </div>

      {Object.keys(groupedMessages).length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Aucun message trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.values(groupedMessages).map((conversation) => (
            <Card key={conversation.vehicle.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {conversation.vehicle.brand} {conversation.vehicle.model}
                  </CardTitle>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default">{conversation.unreadCount} non lu(s)</Badge>
                  )}
                </div>
                <CardDescription>
                  Dernier message: {format(new Date(conversation.lastMessage.createdAt), "PPP à HH:mm", { locale: fr })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{conversation.lastMessage.user.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{conversation.lastMessage.content}</p>
                  </div>
                  <div className="flex justify-between">
                    <Button asChild variant="outline">
                      <Link href={`/admin/messages/${conversation.vehicle.id}`}>Voir la conversation</Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/vehicules/${conversation.vehicle.id}`}>Voir le véhicule</Link>
                    </Button>
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

