import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminChatInterface } from "@/components/admin/admin-chat-interface"

export default async function AdminMessageDetailPage({
  params,
}: {
  params: { vehicleId: string }
}) {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/messages")
  }

  const { vehicleId } = params

  // Récupérer le véhicule
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  })

  if (!vehicle) {
    redirect("/admin/messages")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Conversation: {vehicle.brand} {vehicle.model}
          </h2>
          <p className="text-muted-foreground">Messages en temps réel</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/messages">Retour</Link>
        </Button>
      </div>

      <AdminChatInterface vehicleId={vehicleId} vehicle={vehicle} />
    </div>
  )
}

