"use client"

import { useEffect, useState } from "react"
import { VehicleCard } from "./vehicle-card"
import type { Vehicle } from "@/lib/types"

export function VehicleCatalog() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    async function loadVehicles() {
      const response = await fetch('/api/vehicles', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setVehicles(data.vehicles)
      }
    }

    loadVehicles()
  }, [])

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun véhicule disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}