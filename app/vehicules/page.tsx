import { prisma } from "@/lib/prisma"
import { convertPrismaVehicleType, type Vehicle } from "@/lib/types"
import { VehicleCard } from "@/components/vehicles/vehicle-card"
import { SearchSection } from "@/components/search-section"

interface SearchParams {
  brand?: string
  type?: string
  priceMax?: string
}

export default async function VehiculesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Build the where clause based on search params
  const where: any = {
    available: true,
  }

  // Add filters if they exist
  if (searchParams.brand) {
    where.brand = searchParams.brand
  }

  if (searchParams.type) {
    where.type = searchParams.type
  }

  if (searchParams.priceMax) {
    where.price = {
      lte: Number.parseInt(searchParams.priceMax),
    }
  }

  // Fetch filtered vehicles
  const prismaVehicles = await prisma.vehicle.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  })

  // Convert Prisma vehicles to our Vehicle type
  const vehicles: Vehicle[] = prismaVehicles.map((vehicle) => ({
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    price: vehicle.price,
    type: convertPrismaVehicleType(vehicle.type),
    dailyRate: vehicle.dailyRate ?? undefined,
    description: vehicle.description ?? undefined,
    images: vehicle.images,
    available: vehicle.available,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  }))

  return (
    <main className="container mx-auto px-4 py-8">
      <SearchSection />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">
          {vehicles.length} véhicule{vehicles.length !== 1 ? "s" : ""} trouvé{vehicles.length !== 1 ? "s" : ""}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {vehicles.length === 0 && (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Aucun véhicule ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </main>
  )
}

