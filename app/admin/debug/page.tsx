import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SSEMonitor } from "@/components/admin/sse-monitor"
import { DebugPanel } from "@/components/admin/debug-panel"
import { DatabaseTest } from "@/components/admin/db-test"
import { VehicleAvailabilityChecker } from "@/components/admin/vehicle-availability-checker"

export default async function AdminDebugPage() {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/debug")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Outils de débogage</h2>
        <p className="text-muted-foreground">Surveillez et dépannez votre application</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SSEMonitor />
        <DatabaseTest />
      </div>

      <div className="grid gap-6">
        <VehicleAvailabilityChecker />
        <DebugPanel />
      </div>
    </div>
  )
}

