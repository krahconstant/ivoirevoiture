import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import type { User } from "@/lib/types"
import type { UserRole } from "@/lib/types"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change")

export async function createSession(user: User) {
  // Créer un token JWT avec toutes les informations nécessaires
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  // Définir le cookie avec les bonnes options
  const cookieStore = cookies()
  cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 jours
    path: "/",
  })

  return token
}

export async function getSession() {
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

export async function comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword)
}

export async function logout(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("session")
}

