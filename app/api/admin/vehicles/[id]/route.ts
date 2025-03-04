import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    // Vérifier que l'utilisateur est un admin
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Récupérer les données du body
    const data = await request.json()

    // Vérifier que le véhicule existe
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!existingVehicle) {
      return NextResponse.json(
        { error: "Véhicule non trouvé" },
        { status: 404 }
      )
    }

    // Mettre à jour le véhicule
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        brand: data.brand,
        model: data.model,
        type: data.type,
        price: data.price,
        dailyRate: data.dailyRate,
        description: data.description,
        available: data.available,
        images: data.images,
      },
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du véhicule" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const vehicle = await prisma.vehicle.delete({
      where: { id: params.id },
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du véhicule" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: "Véhicule non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du véhicule" },
      { status: 500 }
    )
  }
}