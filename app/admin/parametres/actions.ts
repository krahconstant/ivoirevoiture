"use server"

import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface UpdateSettingsData {
  id: string
  siteName: string
  description: string
  contactEmail: string
  maintenanceMode: boolean
}

export async function updateSettings(data: UpdateSettingsData) {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Non autorisé" }
    }

    // Mettre à jour ou créer les paramètres
    const settings = await prisma.siteSettings.upsert({
      where: {
        id: data.id || "default",
      },
      update: {
        siteName: data.siteName,
        description: data.description,
        contactEmail: data.contactEmail,
        maintenanceMode: data.maintenanceMode,
      },
      create: {
        siteName: data.siteName,
        description: data.description,
        contactEmail: data.contactEmail,
        maintenanceMode: data.maintenanceMode,
      },
    })

    revalidatePath("/admin/settings")
    return { success: true, settings }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error)
    return { error: "Une erreur est survenue lors de la mise à jour des paramètres" }
  }
}

