"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { User } from "@/lib/types"
import { UserRole } from "@/lib/types"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Simulation d'authentification
  if (email === "test@example.com" && password === "password") {
    const user: User = {
      id: "1",
      email: "test@example.com",
      phone: "0102030406",
      name: "Test User",
      role: UserRole.ADMIN,
    }

    cookies().set("auth-token", "fake-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
    })

    return { success: true, user }
  }

  return { success: false, error: "Email ou mot de passe incorrect" }
}

export async function logout() {
  cookies().delete("auth-token")
  redirect("/")
}

export async function getUserAction(): Promise<User | null> {
  const token = cookies().get("auth-token")

  if (!token) {
    return null
  }

  // Simulation de récupération des données utilisateur
  return {
    id: "1",
    email: "test@example.com",
    phone: "0102030405",

    name: "Test User",
    role: UserRole.ADMIN,
  }
}

