import type { ReactNode } from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNotifications } from "@/components/admin/admin-notifications"
import { ReservationNotifications } from "@/components/admin/reservation-notifications"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNotifications />
        <ReservationNotifications />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

