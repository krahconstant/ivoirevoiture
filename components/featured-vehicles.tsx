"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Vehicle } from "@prisma/client"

export function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/vehicles?available=true")
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data.vehicles || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Véhicules en vedette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Véhicules en vedette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48">
                  <Image
                    src={vehicle.images[0] || "/placeholder.svg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <Badge variant={vehicle.type === "LOCATION" ? "default" : "secondary"}>
                    {vehicle.type === "LOCATION" ? "Location" : "Vente"}
                  </Badge>
                  <h3 className="text-xl font-semibold mt-2">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-lg font-bold text-primary mt-1">
                    {vehicle.type === "LOCATION" ? `${vehicle.dailyRate} F CFA /jour` : `${vehicle.price} F CFA `}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/vehicules/${vehicle.id}`}>Plus de détails</Link>
                </Button>
                {vehicle.type === "LOCATION" ? (
                  <Button asChild>
                    <Link href={`/reserver?vehicleId=${vehicle.id}`}>Réserver</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href={`/vehicules/${vehicle.id}`}>Acheter</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

