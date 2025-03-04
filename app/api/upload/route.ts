import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    // Vérifier l'authentification
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    // Vérifier que des fichiers ont été envoyés
    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier n'a été envoyé" }, { status: 400 })
    }

    const urls = []

    // En production, utiliser Vercel Blob
    if (process.env.NODE_ENV === "production") {
      for (const file of files) {
        const blob = await put(file.name, file, {
          access: "public",
        })
        urls.push(blob.url)
      }
    } 
    // En développement, sauvegarder localement
    else {
      const publicDir = join(process.cwd(), "public", "uploads")
      
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Générer un nom de fichier unique
        const uniqueName = `${Date.now()}-${file.name}`
        const filePath = join(publicDir, uniqueName)
        
        await writeFile(filePath, buffer)
        urls.push(`/uploads/${uniqueName}`)
      }
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}