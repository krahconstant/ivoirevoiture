import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { VehicleForm } from "@/components/admin/vehicle-form"
import { convertPrismaVehicleType } from "@/lib/types"

interface VehiclePageProps {
  params: {
    id: string
  }
}

export default async function AdminVehiclePage({ params }: VehiclePageProps) {
  // Si l'ID est "nouveau", on crée un nouveau véhicule
  if (params.id === "nouveau") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Ajouter un véhicule</h1>
        <VehicleForm />
      </div>
    )
  }

  // Sinon, on récupère le véhicule existant
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
  })

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Modifier un véhicule</h1>
      <VehicleForm
        vehicle={{
          ...vehicle,
          type: convertPrismaVehicleType(vehicle.type),
        }}
      />
    </div>
  )
}

