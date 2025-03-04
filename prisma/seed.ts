import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Créer l'utilisateur admin
  const adminPassword = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: "admin2@example.com" },
    update: {},
    create: {
      email: "admin2@example.com",
      name: "Admin",
      phone: "+225 0123456789",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Créer un utilisateur normal
  const userPassword = await bcrypt.hash("user123", 10)
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "User",
      phone: "+225 9876543210",
      password: userPassword,
      role: "USER",
    },
  })

  // Ajouter quelques véhicules
  await prisma.vehicle.createMany({
    skipDuplicates: true,
    data: [
      {
        brand: "Mercedes",
        model: "Classe S",
        price: 150000,
        type: "VENTE",
        dailyRate: 250,
        description: "Mercedes-Benz Classe S en excellent état",
        images: ["/placeholder.svg?height=600&width=800"],
        available: true,
      },
      {
        brand: "BMW",
        model: "Série 7",
        price: 120000,
        type: "LOCATION",
        dailyRate: 200,
        description: "BMW Série 7 avec finition luxe",
        images: ["/placeholder.svg?height=600&width=800"],
        available: true,
      },
    ],
  })

  console.log("Base de données initialisée avec succès")
}

main()
  .catch((e) => {
    console.error("Erreur lors de l'initialisation de la base de données:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })