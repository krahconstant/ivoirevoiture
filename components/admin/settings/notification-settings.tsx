"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [newReservationAlerts, setNewReservationAlerts] = useState(true)
  const [newMessageAlerts, setNewMessageAlerts] = useState(true)

  const handleSave = () => {
    setIsLoading(true)

    // Simuler une sauvegarde
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Paramètres de notification mis à jour",
        description: "Vos préférences de notification ont été enregistrées.",
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de notification</CardTitle>
        <CardDescription>Gérez vos préférences de notification.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Canaux de notification</h3>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">
                Notifications par email
              </Label>
              <p className="text-sm text-muted-foreground">Recevez des notifications par email</p>
            </div>
            <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor="sms-notifications" className="font-medium">
                Notifications par SMS
              </Label>
              <p className="text-sm text-muted-foreground">Recevez des notifications par SMS</p>
            </div>
            <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Types de notification</h3>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor="new-reservation" className="font-medium">
                Nouvelles réservations
              </Label>
              <p className="text-sm text-muted-foreground">Soyez notifié lors d'une nouvelle réservation</p>
            </div>
            <Switch id="new-reservation" checked={newReservationAlerts} onCheckedChange={setNewReservationAlerts} />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor="new-message" className="font-medium">
                Nouveaux messages
              </Label>
              <p className="text-sm text-muted-foreground">Soyez notifié lors d'un nouveau message</p>
            </div>
            <Switch id="new-message" checked={newMessageAlerts} onCheckedChange={setNewMessageAlerts} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les préférences
        </Button>
      </CardFooter>
    </Card>
  )
}

