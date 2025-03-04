import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

    if (!phone) {
      return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: { phone },
    })

    return NextResponse.json({ exists: !!existingUser })
  } catch (error) {
    console.error("Erreur lors de la vérification du téléphone:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

