"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useAdminChat, type Message } from "@/hooks/use-admin-chat"
import { useState } from "react"

interface AdminChatInterfaceProps {
  vehicleId: string
  vehicle: {
    brand: string
    model: string
  }
}

export function AdminChatInterface({ vehicleId, vehicle }: AdminChatInterfaceProps) {
  const { messages, isLoading, sendMessage } = useAdminChat(vehicleId)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Faire défiler jusqu'au dernier message quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!newMessage.trim()) return

    setIsSending(true)

    try {
      await sendMessage(newMessage)
      setNewMessage("")

      // Focus sur le textarea après l'envoi
      setTimeout(() => {
        textareaRef.current?.focus()
        // Faire défiler jusqu'au dernier message
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Gérer l'envoi avec Ctrl+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isSending && newMessage.trim()) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle>
            {vehicle.brand} {vehicle.model}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto h-[calc(100%-70px)] pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Aucun message dans cette conversation
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user.role === "ADMIN" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.user.role === "ADMIN" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="mb-1 text-xs">
                      <span className="font-medium">{message.user.name}</span> •{" "}
                      <span className="text-xs opacity-75">
                        {format(new Date(message.createdAt), "PPP à HH:mm", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Textarea
                ref={textareaRef}
                placeholder="Écrivez votre message... (Ctrl+Enter pour envoyer)"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                rows={2}
                disabled={isSending}
              />
              <Button type="submit" disabled={isSending || !newMessage.trim()} className="self-end">
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

