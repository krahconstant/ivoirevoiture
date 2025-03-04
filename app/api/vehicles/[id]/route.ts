import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { convertPrismaVehicleType } from "@/lib/types"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    // Convertir le type Prisma en type personnalisé
    const formattedVehicle = {
      ...vehicle,
      type: convertPrismaVehicleType(vehicle.type),
    }

    return NextResponse.json({ vehicle: formattedVehicle })
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json({ error: "Error fetching vehicle" }, { status: 500 })
  }
}