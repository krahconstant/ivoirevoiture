"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { getFeaturedVehicles } from "@/lib/data"

export function VehiclesTable() {
  const [vehicles] = useState(getFeaturedVehicles())

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Véhicule</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">
                {vehicle.brand} {vehicle.model}
              </TableCell>
              <TableCell>
                <Badge variant={vehicle.type === "location" ? "default" : "secondary"}>
                  {vehicle.type === "location" ? "Location" : "Vente"}
                </Badge>
              </TableCell>
              <TableCell>{vehicle.type === "location" ? `${vehicle.daily_rate}€/jour` : `${vehicle.price}€`}</TableCell>
              <TableCell>
                <Badge
                  variant={vehicle.available ? "outline" : "destructive"}
                  className={vehicle.available ? "border-green-500 text-green-500" : ""}
                >
                  {vehicle.available ? "Disponible" : "Indisponible"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

