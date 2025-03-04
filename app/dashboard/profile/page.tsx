import { getSession } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profil</h2>
        <p className="text-muted-foreground">Gérez vos informations personnelles</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={session.user} />
        </CardContent>
      </Card>
    </div>
  )
}

