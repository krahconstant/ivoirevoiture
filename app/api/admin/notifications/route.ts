import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { UserRole } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Vérifier que c'est un nouveau message d'un utilisateur
    if (data.type === "NEW_MESSAGE" && data.message?.user.role === UserRole.USER) {
      // Ici on ne fait rien de spécial, le son sera joué par le client
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
  } catch (error) {
    console.error("Error in notifications route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

