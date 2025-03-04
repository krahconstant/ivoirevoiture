import { getSession } from "@/lib/auth"
import { UserRole } from "@/lib/types"
import { addClient, removeClient } from "@/lib/sse"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const session = await getSession()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return new Response("Unauthorized", { status: 401 })
  }

  const stream = new ReadableStream({
    start(controller) {
      addClient(controller)

      // Garder la connexion active
      const keepAlive = setInterval(() => {
        controller.enqueue(": keepalive\n\n")
      }, 30000)

      // Nettoyer à la fermeture
      return () => {
        clearInterval(keepAlive)
        removeClient(controller)
      }
    },
  })

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  return new Response(stream, { headers })
}

