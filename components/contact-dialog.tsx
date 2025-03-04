"use client"

import type React from "react"

import { useState } from "react"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { ChatMessages } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
})

interface ContactDialogProps {
  children: React.ReactNode
  vehicleId: string
}

export function ContactDialog({ children, vehicleId }: ContactDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     phone: "",
  //     message: "",
  //   },
  // })

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  //     await sendContactForm({ ...values, vehicleId })
  //     setOpen(false)
  //     form.reset()
  //     toast({
  //       title: "Message envoyé",
  //       description: "Nous vous contacterons dans les plus brefs délais.",
  //     })
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Erreur",
  //       description: "Une erreur est survenue lors de l'envoi du message.",
  //     })
  //   }
  // }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat avec le vendeur</DialogTitle>
          <DialogDescription>Discutez en direct avec notre équipe commerciale</DialogDescription>
        </DialogHeader>
        <ChatMessages vehicleId={vehicleId} className="flex-1" />
        <ChatInput vehicleId={vehicleId} />
      </DialogContent>
    </Dialog>
  )
}

