import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    return NextResponse.json({ exists: !!existingUser })
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

