import { PrismaClient } from "@prisma/client"

// Créer une instance globale de PrismaClient pour éviter trop de connexions en développement
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Fonction utilitaire pour tester la connexion à la base de données
export async function testDatabaseConnection() {
  try {
    // Exécuter une requête simple pour vérifier la connexion
    await prisma.$queryRaw`SELECT 1`
    return { connected: true }
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error)
    return { connected: false, error: String(error) }
  }
}

