"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VehicleType } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import type { Vehicle } from "@/lib/types"

export function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    async function fetchVehicles() {
      const response = await fetch('/api/vehicles?featured=true', {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setVehicles(data.vehicles)
      }
    }

    fetchVehicles()
  }, [])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Véhicules en vedette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              {/* Votre JSX existant pour l'affichage des véhicules */}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}