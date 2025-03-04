import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { VehicleReservation } from "@/components/vehicles/vehicle-reservation"
import { formatPrice } from "@/lib/utils"
import { VehicleType, convertPrismaVehicleType, type Vehicle } from "@/lib/types"

interface VehiclePageProps {
  params: {
    id: string
  }
}

export default async function VehiculePage({ params }: VehiclePageProps) {
  const prismaVehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
  })

  if (!prismaVehicle) {
    notFound()
  }

  // Convertir le type Prisma en type personnalisé
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={vehicle.images[0] || "/placeholder.svg"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {vehicle.images.slice(1).map((image, index) => (
              <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${vehicle.brand} ${vehicle.model} - Vue ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="space-y-6">
          <div>
            <Badge variant={vehicle.type === VehicleType.LOCATION ? "default" : "secondary"} className="mb-2">
              {vehicle.type === VehicleType.LOCATION ? "Location" : "Vente"}
            </Badge>
            <h1 className="text-3xl font-bold">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="mt-2 text-2xl font-bold text-primary">
              {vehicle.type === VehicleType.LOCATION
                ? `${formatPrice(vehicle.dailyRate || 0)}/jour`
                : formatPrice(vehicle.price)}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">{vehicle.description}</p>
            </CardContent>
          </Card>

          {/* Composant de réservation ou bouton de contact */}
          {vehicle.type === VehicleType.LOCATION ? (
            <VehicleReservation vehicle={vehicle} />
          ) : (
            <div className="flex gap-4">
              <Button size="lg" className="flex-1" asChild>
                <Link href={`/chat/${vehicle.id}`}>Contacter le vendeur</Link>
              </Button>
              <Button size="lg" variant="outline" className="flex-1" asChild>
                <Link href={`/chat/${vehicle.id}`}>Demander plus d'informations</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

