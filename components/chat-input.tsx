"use client"

import type React from "react"

import { useState } from "react"
import { SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import sendMessage from "@/app/actions"

interface ChatInputProps {
  vehicleId: string
}

export function ChatInput({ vehicleId }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    try {
      await sendMessage({
        content: message,
        vehicleId,
      })
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Écrivez votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[50px] max-h-[200px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <SendHorizonal className="h-4 w-4" />
          <span className="sr-only">Envoyer</span>
        </Button>
      </div>
    </form>
  )
}

