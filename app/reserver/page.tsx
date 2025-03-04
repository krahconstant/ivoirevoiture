import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReservationForm } from "@/components/reservation/reservation-form"
import { convertPrismaVehicleType, type Vehicle } from "@/lib/types"

interface SearchParams {
  vehicleId?: string
  startDate?: string
  endDate?: string
}

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/reserver")
  }

  if (!searchParams.vehicleId) {
    redirect("/vehicules")
  }

  const prismaVehicle = await prisma.vehicle.findUnique({
    where: { id: searchParams.vehicleId },
  })

  if (!prismaVehicle) {
    redirect("/vehicules")
  }

  // Convert Prisma vehicle to our Vehicle type
  const vehicle: Vehicle = {
    id: prismaVehicle.id,
    brand: prismaVehicle.brand,
    model: prismaVehicle.model,
    price: prismaVehicle.price,
    type: convertPrismaVehicleType(prismaVehicle.type),
    dailyRate: prismaVehicle.dailyRate ?? undefined,
    description: prismaVehicle.description ?? undefined,
    images: prismaVehicle.images,
    available: prismaVehicle.available,
    createdAt: prismaVehicle.createdAt,
    updatedAt: prismaVehicle.updatedAt,
  }

  // Parse dates if provided
  const startDate = searchParams.startDate ? new Date(searchParams.startDate) : undefined
  const endDate = searchParams.endDate ? new Date(searchParams.endDate) : undefined

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Réserver un véhicule</h1>

        <div className="grid gap-8">
          <ReservationForm
            vehicle={vehicle}
            user={{
              name: session.user.name,
              email: session.user.email,
            }}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
        </div>
      </div>
    </div>
  )
}

