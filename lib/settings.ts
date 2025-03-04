import { prisma } from "@/lib/prisma"
import { PrismaClient } from '@prisma/client'
export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst()

    return (
      settings || {
        id: "",
        siteName: "Vente Ivoire",
        description: "Location et vente de véhicules",
        contactEmail: "contact@venteivoire.com",
        maintenanceMode: false,
        updatedAt: new Date(),
      }
    )
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error)

    // Retourner des valeurs par défaut en cas d'erreur
    return {
      id: "",
      siteName: "Vente Ivoire",
      description: "Location et vente de véhicules",
      contactEmail: "contact@venteivoire.com",
      maintenanceMode: false,
      updatedAt: new Date(),
    }
  }
}

