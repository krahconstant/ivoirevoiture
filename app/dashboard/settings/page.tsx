import { getSession } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default async function SettingsPage() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configurez vos préférences de notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  )
}

