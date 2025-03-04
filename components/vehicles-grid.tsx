import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Vehicle } from "@/lib/types"

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/9]">
        <Image
          src={vehicle.images[0] || "/placeholder.svg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="mb-4 text-sm text-gray-600">{vehicle.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-red-600">
            {vehicle.type === "LOCATION" ? `${formatPrice(vehicle.dailyRate || 0)}/jour` : formatPrice(vehicle.price)}
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href={`/vehicules/${vehicle.id}`}>Voir détails</Link>
            </Button>
            {vehicle.type === "LOCATION" && (
              <Button variant="outline" asChild>
                <Link href={`/location/${vehicle.id}`}>Réserver</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

