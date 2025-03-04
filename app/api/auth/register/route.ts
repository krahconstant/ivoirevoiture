import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { type User, convertPrismaRole } from "@/lib/types"

function isValidIvorianPhone(phone: string): boolean {
  const phoneRegex = /^\+225[2-9]\d{8}$/
  const cleanPhone = phone.replace(/\s+/g, "")
  return phoneRegex.test(cleanPhone)
}

function formatIvorianPhone(phone: string): string {
  const cleanPhone = phone.replace(/\s+/g, "")

  if (cleanPhone.startsWith("0")) {
    return "+225" + cleanPhone.slice(1)
  }

  if (!cleanPhone.startsWith("+225")) {
    return "+225" + cleanPhone
  }

  return cleanPhone
}

export async function POST(request: Request) {
  try {
    console.log("📝 Début de l'inscription...")

    const body = await request.json()
    console.log("📦 Données reçues:", {
      ...body,
      password: body.password ? "[HIDDEN]" : undefined,
    })

    const { email, password, name, phone } = body

    // Validation des champs requis
    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        {
          error: "Tous les champs sont requis",
          details: {
            email: !email ? "L'email est requis" : null,
            password: !password ? "Le mot de passe est requis" : null,
            name: !name ? "Le nom est requis" : null,
            phone: !phone ? "Le numéro de téléphone est requis" : null,
          },
        },
        { status: 400 },
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Format d'email invalide",
          field: "email",
        },
        { status: 400 },
      )
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Le mot de passe doit contenir au moins 6 caractères",
          field: "password",
        },
        { status: 400 },
      )
    }

    // Validation et formatage du numéro de téléphone
    console.log("📱 Formatage du numéro de téléphone:", phone)
    const formattedPhone = formatIvorianPhone(phone)
    console.log("📱 Numéro formaté:", formattedPhone)

    if (!isValidIvorianPhone(formattedPhone)) {
      return NextResponse.json(
        {
          error: "Format de numéro de téléphone invalide",
          field: "phone",
        },
        { status: 400 },
      )
    }

    // Vérification si le numéro de téléphone existe déjà
    const existingPhone = await prisma.user.findFirst({
      where: { phone: formattedPhone },
    })

    if (existingPhone) {
      return NextResponse.json(
        {
          error: "Ce numéro de téléphone est déjà utilisé",
          field: "phone",
        },
        { status: 400 },
      )
    }

    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Cet email est déjà utilisé",
          field: "email",
        },
        { status: 400 },
      )
    }

    console.log("🔒 Hachage du mot de passe...")
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log("👤 Création de l'utilisateur...")
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        phone: formattedPhone,
        role: Role.USER,
      },
    })

    console.log("✅ Utilisateur créé avec succès:", user.id)

    const safeUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: convertPrismaRole(user.role),
    }

    return NextResponse.json({
      user: safeUser,
      message: "Inscription réussie",
    })
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error)
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de l'inscription",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

