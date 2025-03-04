"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Send, Loader2, ImageIcon, Paperclip, Smile } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useChatMessages } from "@/hooks/use-chat-messages"
import type { VehicleType, Message } from "@/lib/types"

interface SimplifiedVehicle {
  id: string
  type: VehicleType
  brand: string
  model: string
  price: number
  dailyRate: number | null
  images: string[]
}

interface ChatWindowProps {
  vehicleId: string
  vehicle: SimplifiedVehicle
  currentUserId: string
}

export function ChatWindow({ vehicleId, vehicle, currentUserId }: ChatWindowProps) {
  const { messages, isLoading, isConnected, sendMessage } = useChatMessages(vehicleId)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Scroll automatique vers le bas lors de nouveaux messages
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Ajuster automatiquement la hauteur du textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + "px"
    }
  }, [newMessage])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(newMessage)
      setNewMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px"
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTyping = () => {
    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  // Grouper les messages par date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, Message[]>,
  )

  if (isLoading) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center rounded-lg border bg-background p-8 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement de la conversation...</p>
      </div>
    )
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg border bg-background shadow-sm">
      {/* En-tête du chat */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={vehicle.images[0]} alt={`${vehicle.brand} ${vehicle.model}`} />
            <AvatarFallback>{vehicle.brand[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehicle.type === "LOCATION" ? `${vehicle.dailyRate}€/jour` : `${vehicle.price}€`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-green-500" : "bg-amber-500"}`}></div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isConnected ? "Connecté" : "Connexion en cours..."}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Zone des messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {format(new Date(date), "d MMMM yyyy", { locale: fr })}
                  </span>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {dateMessages.map((message, index) => {
                  const isCurrentUser = message.user.id === currentUserId
                  const isLastMessage = index === dateMessages.length - 1
                  const showAvatar = index === 0 || dateMessages[index - 1].user.id !== message.user.id

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      ref={isLastMessage ? lastMessageRef : null}
                      className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""} ${
                        !showAvatar && !isCurrentUser ? "ml-10" : ""
                      } ${!showAvatar && isCurrentUser ? "mr-10" : ""}`}
                    >
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" alt={message.user.name} />
                          <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8" />
                      )}

                      <div
                        className={`group relative max-w-[80%] rounded-2xl px-4 py-2 ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {showAvatar && !isCurrentUser && (
                          <p className="mb-1 text-xs font-medium">{message.user.name}</p>
                        )}
                        <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                        <span
                          className={`absolute bottom-1 right-2 text-[10px] opacity-0 transition-opacity group-hover:opacity-70 ${
                            isCurrentUser ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {format(new Date(message.createdAt), "HH:mm")}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1 text-lg font-medium">Commencez la conversation</h3>
              <p className="text-sm text-muted-foreground">
                Envoyez un message pour démarrer la discussion à propos de ce véhicule.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Zone de saisie */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez votre message..."
                className="max-h-32 min-h-[40px] w-full resize-none rounded-lg border bg-background px-4 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ height: "40px" }}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                  <Smile className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full"
              disabled={isSending || !newMessage.trim()}
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            <p>Vos messages sont privés et sécurisés</p>
          </div>
        </form>
      </div>
    </div>
  )
}

