import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function MaintenancePage() {
  // Récupérer les paramètres du site
  const settings = (await prisma.siteSettings.findFirst()) || {
    siteName: "Vente Ivoire",
    contactEmail: "contact@venteivoire.com",
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex max-w-md flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{settings.siteName}</h1>
          <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Notre site est actuellement en maintenance. Nous serons bientôt de retour.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button asChild variant="outline">
            <Link href={`mailto:${settings.contactEmail}`}>Nous contacter</Link>
          </Button>
          <Button asChild>
            <Link href="/admin">Connexion administrateur</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

