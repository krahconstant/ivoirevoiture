import { ReservationForm } from "@/components/reservation/reservation-form"
import { ReservationSummary } from "@/components/reservation/reservation-summary"
import { getVehicle } from "@/lib/vehicles"

export default function Page({ params }: { params: { id: string } }) {
  const vehicle = getVehicle(params.id)

  if (!vehicle) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Véhicule non trouvé</h1>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        Réserver {vehicle.brand} {vehicle.model}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <ReservationForm vehicle={vehicle} />
        </div>
        <div className="lg:pl-6">
          <ReservationSummary vehicle={vehicle} />
        </div>
      </div>
    </div>
  )
}