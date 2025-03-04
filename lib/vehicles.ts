import { VehicleType, type Vehicle } from "@/lib/types"

const now = new Date()

const vehicles: Record<string, Vehicle> = {
  "1": {
    id: "1",
    brand: "Mercedes",
    model: "Classe S",
    price: 150000,
    type: VehicleType.VENTE,
    available: true,
    images: ["/placeholder.svg?height=600&width=800"],
    description:
      "Mercedes-Benz Classe S en excellent état. Intérieur cuir, toit ouvrant, système de navigation premium.",
    dailyRate: undefined,
    createdAt: now,
    updatedAt: now,
  },
  "2": {
    id: "2",
    brand: "BMW",
    model: "Série 7",
    price: 120000,
    type: VehicleType.LOCATION,
    available: true,
    images: ["/placeholder.svg?height=600&width=800"],
    description: "BMW Série 7 avec finition luxe. Parfait état, faible kilométrage.",
    dailyRate: 200,
    createdAt: now,
    updatedAt: now,
  },
  "3": {
    id: "3",
    brand: "Audi",
    model: "A8",
    price: 110000,
    type: VehicleType.LOCATION,
    available: true,
    images: ["/placeholder.svg?height=600&width=800"],
    description: "Audi A8 dernière génération. Technologies de pointe, confort exceptionnel.",
    dailyRate: 180,
    createdAt: now,
    updatedAt: now,
  },
}

export function getVehicle(id: string): Vehicle | null {
  return vehicles[id] || null
}

export function getFeaturedVehicles(): Vehicle[] {
  return Object.values(vehicles)
}

