import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { VehicleType, type Vehicle } from "@/lib/types"

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const mainImage = vehicle.images[0] || "/placeholder.svg"

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Badge className="absolute left-2 top-2 z-10">
            {vehicle.type === VehicleType.LOCATION ? "Location" : "Vente"}
          </Badge>
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{`${vehicle.brand} ${vehicle.model}`}</h3>
          {vehicle.type === VehicleType.LOCATION ? (
            <p className="text-xl font-bold text-primary">{formatPrice(vehicle.dailyRate || 0)}/jour</p>
          ) : (
            <p className="text-xl font-bold text-primary">{formatPrice(vehicle.price)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-4">
        <Link href={`/vehicules/${vehicle.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Plus de détails
          </Button>
        </Link>
        {vehicle.type === VehicleType.LOCATION ? (
          <Link href={`/reserver?vehicleId=${vehicle.id}`} className="w-full">
            <Button className="w-full">Réserver</Button>
          </Link>
        ) : (
          <Link href={`/vehicules/${vehicle.id}`} className="w-full">
            <Button className="w-full">Acheter</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

