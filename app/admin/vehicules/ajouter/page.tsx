import { VehicleForm } from "@/components/admin/vehicle-form"

export default function AddVehiclePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ajouter un véhicule</h1>
        <p className="text-muted-foreground">Créez une nouvelle fiche véhicule.</p>
      </div>
      <VehicleForm />
    </div>
  )
}

