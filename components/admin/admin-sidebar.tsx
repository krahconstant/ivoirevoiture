"use client"

import Link from "next/link"
import { Home, Car, Users, Settings, MessageSquare } from "lucide-react"

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-4">
        <div>
          <Link href="/admin" className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline">
            <Home className="h-4 w-4" />
            <span>Tableau de bord</span>
          </Link>
        </div>
        <div>
          <Link
            href="/admin/vehicules"
            className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline"
          >
            <Car className="h-4 w-4" />
            <span>Véhicules</span>
          </Link>
        </div>
        <div>
          <Link
            href="/admin/utilisateurs"
            className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline"
          >
            <Users className="h-4 w-4" />
            <span>Utilisateurs</span>
          </Link>
        </div>
        <div>
          <Link href="/admin/messages" className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </Link>
        </div>
        <div>
          <Link href="/admin/reservations" className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline">
            <MessageSquare className="h-4 w-4" />
            <span>Reservations</span>
          </Link>
          </div>
        <div>
          <Link href="/admin/parametres" className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}

