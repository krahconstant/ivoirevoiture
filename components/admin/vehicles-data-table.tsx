"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { type Vehicle, VehicleType } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface DataTableProps {
  data: Vehicle[]
}

export function VehiclesDataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrer les véhicules en fonction du terme de recherche
  const filteredVehicles = data.filter(
    (vehicle) =>
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher par marque ou modèle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marque</TableHead>
              <TableHead>Modèle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Prix/jour</TableHead>
              <TableHead>Disponible</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.type === VehicleType.LOCATION ? "default" : "secondary"}>
                      {vehicle.type === VehicleType.LOCATION ? "Location" : "Vente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(vehicle.price)}</TableCell>
                  <TableCell>{vehicle.dailyRate ? formatPrice(vehicle.dailyRate) : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.available ? "default" : "secondary"}>
                      {vehicle.available ? "Oui" : "Non"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" asChild>
                      <Link href={`/admin/vehicules/${vehicle.id}`}>Modifier</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

