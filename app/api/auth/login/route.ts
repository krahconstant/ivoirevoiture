import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePasswords, createSession } from "@/lib/auth"
import { convertPrismaRole } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 })
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        phone: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isValidPassword = await comparePasswords(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Convertir le rôle Prisma en UserRole
    const userWithConvertedRole = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: convertPrismaRole(user.role),
      phone: user.phone,
    }

    // Créer la session avec le rôle converti
    await createSession(userWithConvertedRole)

    return NextResponse.json({ user: userWithConvertedRole })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Une erreur est survenue" }, { status: 500 })
  }
}

