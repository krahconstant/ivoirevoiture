import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { VehicleType as CustomVehicleType } from "@/lib/types"
import type { Vehicle } from "@/lib/types"
import { Prisma, VehicleType } from "@prisma/client"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const brand = searchParams.get("brand")
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const available = searchParams.get("available")
    const featured = searchParams.get("featured")

    const where: Prisma.VehicleWhereInput = {}

    if (type && (type === "LOCATION" || type === "VENTE")) {
      where.type = type as VehicleType
    }
    
    if (brand) {
      where.brand = brand
    }
    
    if (priceMin || priceMax) {
      where.price = {
        ...(priceMin && { gte: Number.parseInt(priceMin) }),
        ...(priceMax && { lte: Number.parseInt(priceMax) })
      }
    }
    
    if (available) {
      where.available = available === "true"
    }

    const prismaVehicles = await prisma.vehicle.findMany({
      where,
      orderBy: {
        createdAt: Prisma.SortOrder.desc
      },
      take: featured === "true" ? 6 : undefined,
    })

    // Convertir manuellement les véhicules Prisma en type Vehicle
    const vehicles: Vehicle[] = prismaVehicles.map(vehicle => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      price: vehicle.price,
      type: vehicle.type === VehicleType.LOCATION ? CustomVehicleType.LOCATION : CustomVehicleType.VENTE,
      dailyRate: vehicle.dailyRate || 0,
      description: vehicle.description || "",
      images: vehicle.images,
      available: vehicle.available,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    }))

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Error fetching vehicles" }, { status: 500 })
  }
}