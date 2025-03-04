import { VehiclesDataTable } from "@/components/admin/vehicles-data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { convertPrismaVehicleType } from "@/lib/types"

export default async function AdminVehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  // Convertir les types Prisma en types personnalisés
  const formattedVehicles = vehicles.map((vehicle) => ({
    ...vehicle,
    type: convertPrismaVehicleType(vehicle.type),
  }))

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des véhicules</h1>
        <Button asChild>
          <Link href="/admin/vehicules/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Link>
        </Button>
      </div>

      <VehiclesDataTable data={formattedVehicles} />
    </div>
  )
}

