"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Home, MessageSquare, Settings, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Profil",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Réservations",
    href: "/dashboard/reservations",
    icon: CalendarDays,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

