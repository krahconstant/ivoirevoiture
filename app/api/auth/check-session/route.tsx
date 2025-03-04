"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        throw new Error("Failed to check authentication")
      }
      const data = await response.json()
      console.log("Auth check response:", data) // Debug log
      setUser(data.user)
    } catch (error) {
      console.error("Auth check error:", error)
      setError("Erreur lors de la vérification de l'authentification")
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string): Promise<User> {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion")
      }

      console.log("Login response:", data) // Debug log
      setUser(data.user)

      // Recharger immédiatement l'état de l'authentification
      await checkAuth()

      return data.user
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de la connexion")
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      setLoading(true)
      setError(null)

      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch (error) {
      setError("Erreur lors de la déconnexion")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

