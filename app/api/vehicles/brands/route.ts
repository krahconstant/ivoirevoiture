import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get distinct brands from the database
    const brands = await prisma.vehicle.findMany({
      select: {
        brand: true,
      },
      distinct: ["brand"],
      where: {
        available: true,
      },
      orderBy: {
        brand: "asc",
      },
    })

    // Format the response
    const formattedBrands = brands.map((item) => ({
      label: item.brand,
      value: item.brand,
    }))

    // Add the "All brands" option at the beginning
    formattedBrands.unshift({ label: "Toutes les marques", value: "all" })

    return NextResponse.json({ brands: formattedBrands })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
  }
}

