"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { Bell, Volume2, VolumeX, MessageCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useNotificationSound } from "@/lib/useNotificationSound"
import { UserRole } from "@/lib/types"

interface Message {
  id: string
  content: string
  createdAt: Date
  userId: string
  vehicleId: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  vehicle: {
    id: string
    brand: string
    model: string
  }
}

interface ConversationGroup {
  userId: string
  userName: string
  userEmail: string
  vehicleId: string
  vehicleBrand: string
  vehicleModel: string
  lastMessage: Message
  messageCount: number
}

interface MessagesDataTableProps {
  data: Message[]
}

export function MessagesDataTable({ data: initialData }: MessagesDataTableProps) {
  const [messages, setMessages] = useState<Message[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { toast } = useToast()
  const playNotification = useNotificationSound()

  // Configurer SSE pour les notifications admin
  useEffect(() => {
    let eventSource: EventSource | null = null

    try {
      eventSource = new EventSource("/api/admin/notifications")

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === "NEW_MESSAGE" && data.message.user.role === UserRole.USER) {
          const newMessage = data.message
          setMessages((prev) => [newMessage, ...prev])

          if (soundEnabled) {
            playNotification()
          }

          toast({
            title: "Nouveau message",
            description: `De ${newMessage.user.name} pour ${newMessage.vehicle.brand} ${newMessage.vehicle.model}`,
          })
        }
      }

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error)
        if (eventSource) {
          eventSource.close()
        }
      }
    } catch (error) {
      console.error("Error setting up SSE:", error)
    }

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [toast, playNotification, soundEnabled])

  // Créer un Map pour regrouper les conversations par véhicule
  const conversationMap = new Map<string, Message[]>()

  // Regrouper tous les messages par véhicule
  messages.forEach((message) => {
    if (message.user.role === UserRole.ADMIN) return // Ignorer les messages des admins

    const key = `${message.vehicle.id}`
    if (!conversationMap.has(key)) {
      conversationMap.set(key, [])
    }
    conversationMap.get(key)?.push(message)
  })

  // Convertir la Map en tableau de conversations
  const conversations: ConversationGroup[] = Array.from(conversationMap.entries())
    .map(([vehicleId, msgs]) => {
      // Trouver le dernier message d'un utilisateur non-admin
      const lastMessage = msgs.reduce((latest, current) => {
        if (
          current.user.role === UserRole.USER &&
          (!latest || new Date(current.createdAt) > new Date(latest.createdAt))
        ) {
          return current
        }
        return latest
      }, msgs[0])

      return {
        userId: lastMessage.user.id,
        userName: lastMessage.user.name,
        userEmail: lastMessage.user.email,
        vehicleId: lastMessage.vehicle.id,
        vehicleBrand: lastMessage.vehicle.brand,
        vehicleModel: lastMessage.vehicle.model,
        lastMessage,
        messageCount: msgs.length,
      }
    })
    .filter((conv) => conv.lastMessage.user.role === UserRole.USER) // S'assurer que seules les conversations avec des utilisateurs sont incluses

  // Trier les conversations par date du dernier message
  const sortedConversations = conversations.sort(
    (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime(),
  )

  // Filtrer les conversations
  const filteredConversations = sortedConversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${conv.vehicleBrand} ${conv.vehicleModel}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) {
      playNotification()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Rechercher dans les messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          title={soundEnabled ? "Désactiver le son" : "Activer le son"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => soundEnabled && playNotification()}
          title="Tester le son"
          disabled={!soundEnabled}
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Badge variant="outline" className="ml-auto">
          {filteredConversations.length} conversations
        </Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Dernier message</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucune conversation trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredConversations.map((conv) => (
                <TableRow key={`${conv.userId}-${conv.vehicleId}`}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(conv.lastMessage.createdAt), "Pp", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{conv.userName}</p>
                      <p className="text-sm text-muted-foreground">{conv.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {conv.vehicleBrand} {conv.vehicleModel}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate">{conv.lastMessage.content}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {conv.messageCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" asChild>
                      <Link href={`/chat/${conv.vehicleId}`}>Voir la conversation</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

