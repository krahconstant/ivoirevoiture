"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { updateSettings } from "@/app/admin/parametres/actions"

const settingsSchema = z.object({
  siteName: z.string().min(1, "Le nom du site est requis"),
  description: z.string(),
  contactEmail: z.string().email("Email invalide"),
  maintenanceMode: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

interface GeneralSettingsProps {
  settings: {
    id: string
    siteName: string
    description: string
    contactEmail: string
    maintenanceMode: boolean
    updatedAt: Date
  }
}

export function GeneralSettings({ settings }: GeneralSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: settings.siteName,
      description: settings.description,
      contactEmail: settings.contactEmail,
      maintenanceMode: settings.maintenanceMode,
    },
  })

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true)
    try {
      const result = await updateSettings({
        id: settings.id,
        ...data,
      })

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error,
        })
        return
      }

      toast({
        title: "Paramètres mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations du site</CardTitle>
            <CardDescription>Ces informations seront affichées sur votre site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du site</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contact</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer les modifications
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
            <CardDescription>Gérez le mode maintenance de votre site.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="maintenanceMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mode maintenance</FormLabel>
                    <FormDescription>
                      Activez ce mode pour afficher une page de maintenance aux visiteurs.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

