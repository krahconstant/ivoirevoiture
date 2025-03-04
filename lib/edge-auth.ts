import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import type { User } from "@/lib/types"
import type { UserRole } from "@/lib/types"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change")

export async function getSessionEdge() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("session")?.value

    if (!token) {
      console.log("No token found in cookies")
      return null
    }

    const verified = await jwtVerify(token, JWT_SECRET)
    const payload = verified.payload

    // Vérifier que toutes les informations nécessaires sont présentes
    if (!payload.id || !payload.role) {
      console.log("Invalid token payload:", payload)
      return null
    }

    // Retourner directement les informations du token sans requête à la base de données
    return {
      user: {
        id: payload.id as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as UserRole,
        phone: payload.phone as string,
      },
    }
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

export async function logoutEdge(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("session")
}