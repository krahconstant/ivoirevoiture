"use client"

import { forwardRef } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Check, CheckCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Message } from "@/lib/types"

interface ChatMessageProps {
  message: Message
  isCurrentUser: boolean
  isRead?: boolean
  showAvatar?: boolean
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, isCurrentUser, isRead = false, showAvatar = true }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
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
          className={`group relative max-w-[80%] space-y-1 rounded-2xl px-4 py-2 ${
            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {!isCurrentUser && showAvatar && <p className="text-xs font-medium">{message.user.name}</p>}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <div
            className={`flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-70 ${
              isCurrentUser ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <span className="text-[10px]">{format(new Date(message.createdAt), "HH:mm")}</span>
            {isCurrentUser && (
              <div className="flex">{isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}</div>
            )}
          </div>
        </div>
      </motion.div>
    )
  },
)
ChatMessage.displayName = "ChatMessage"

