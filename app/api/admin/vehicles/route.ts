import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: data.brand,
        model: data.model,
        price: data.price,
        type: data.type,
        dailyRate: data.dailyRate,
        description: data.description,
        available: data.available,
        images: data.images,
      },
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error creating vehicle:", error)
    return NextResponse.json({ error: "Error creating vehicle" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Error fetching vehicles" }, { status: 500 })
  }
}

