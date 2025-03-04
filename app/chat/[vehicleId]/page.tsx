import { notFound, redirect } from "next/navigation"
import { ChatWindow } from "@/components/chat/chat-window"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { convertPrismaVehicleType } from "@/lib/types"

export default async function ChatPage({ params }: { params: { vehicleId: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=" + encodeURIComponent(`/chat/${params.vehicleId}`))
  }

  try {
    const prismaVehicle = await prisma.vehicle.findUnique({
      where: { id: params.vehicleId },
      select: {
        id: true,
        brand: true,
        model: true,
        type: true,
        price: true,
        dailyRate: true,
        images: true,
      },
    })

    if (!prismaVehicle) {
      notFound()
    }

    // Convertir le véhicule Prisma en SimplifiedVehicle
    const vehicle = {
      ...prismaVehicle,
      type: convertPrismaVehicleType(prismaVehicle.type),
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                Discussion à propos de {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-muted-foreground mt-1">
                {vehicle.type === "LOCATION" ? `${vehicle.dailyRate}€/jour` : `${vehicle.price}€`}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/vehicules/${vehicle.id}`}>Retour au véhicule</Link>
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden bg-background">
            <ChatWindow vehicleId={vehicle.id} vehicle={vehicle} currentUserId={session.user.id} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading chat page:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
          <p className="text-muted-foreground mb-6">
            Impossible de charger la conversation. Veuillez réessayer plus tard.
          </p>
          <Button asChild>
            <Link href="/vehicules">Retour aux véhicules</Link>
          </Button>
        </div>
      </div>
    )
  }
}

