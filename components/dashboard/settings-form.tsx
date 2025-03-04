"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

const settingsFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
    },
  })

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true)

    try {
      // Simuler une mise à jour des paramètres
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences ont été mises à jour avec succès.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de vos paramètres.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notifications par email</FormLabel>
                <FormDescription>Recevez des notifications par email concernant vos réservations.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smsNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notifications par SMS</FormLabel>
                <FormDescription>Recevez des notifications par SMS concernant vos réservations.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marketingEmails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Emails marketing</FormLabel>
                <FormDescription>Recevez des emails concernant nos offres spéciales et nouveautés.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les préférences
        </Button>
      </form>
    </Form>
  )
}

