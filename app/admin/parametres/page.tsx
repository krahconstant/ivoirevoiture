import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "@/components/admin/settings/general-settings"
import { NotificationSettings } from "@/components/admin/settings/notification-settings"
import { SecuritySettings } from "@/components/admin/settings/security-settings"

export default async function SettingsPage() {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/settings")
  }

  // Récupérer les paramètres actuels
  let settings
  try {
    settings = await prisma.siteSettings.findFirst()
  } catch (error) {
    // Si la table n'existe pas encore (avant la migration), utiliser des valeurs par défaut
    console.error("Erreur lors de la récupération des paramètres:", error)
    settings = null
  }

  // Valeurs par défaut si aucun paramètre n'est trouvé
  const defaultSettings = {
    id: "",
    siteName: "Vente Ivoire",
    description: "Location et vente de véhicules",
    contactEmail: "contact@venteivoire.com",
    maintenanceMode: false,
    updatedAt: new Date(),
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">Gérez les paramètres de votre site</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <GeneralSettings settings={settings || defaultSettings} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

