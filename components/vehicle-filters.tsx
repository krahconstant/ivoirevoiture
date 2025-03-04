"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { VehicleType } from "@/lib/types"

const vehicleTypes = [
  { id: VehicleType.LOCATION, label: "Location" },
  { id: VehicleType.VENTE, label: "Vente" },
]

const brands = [
  { id: "rolls-royce", label: "Rolls-Royce" },
  { id: "mercedes", label: "Mercedes-Benz" },
  { id: "bmw", label: "BMW" },
  { id: "range-rover", label: "Range Rover" },
]

export function VehicleFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Type de véhicule</h3>
        <div className="space-y-3">
          {vehicleTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox id={type.id} />
              <label
                htmlFor={type.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Marques</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox id={brand.id} />
              <label
                htmlFor={brand.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {brand.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

