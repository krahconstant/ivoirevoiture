import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard")
  }

  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] py-10">
      <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
        <DashboardNav />
      </aside>
      <main className="flex w-full flex-col overflow-hidden">{children}</main>
    </div>
  )
}

