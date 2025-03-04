import type { ReactNode } from "react"

export default function ReserverLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-gray-50">{children}</main>
}

