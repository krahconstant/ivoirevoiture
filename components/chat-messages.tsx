"use client"

import { useEffect, useRef } from "react"
import { useChat } from "@/hooks/use-chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ChatMessagesProps {
  vehicleId: string
  className?: string
}

export function ChatMessages({ vehicleId, className }: ChatMessagesProps) {
  const { messages } = useChat(vehicleId)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  return (
    <ScrollArea className={cn("px-4", className)} ref={scrollRef}>
      <div className="space-y-4 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("flex items-end gap-2", message.role === "user" ? "justify-end" : "justify-start")}
          >
            {message.role !== "user" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Agent" />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[80%]",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">{format(new Date(message.timestamp), "HH:mm", { locale: fr })}</p>
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="You" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

