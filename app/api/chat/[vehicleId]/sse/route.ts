import { getSession } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request, { params }: { params: { vehicleId: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const headersList = headers()
    const acceptHeader = headersList.get("accept")

    // Assouplir la vérification du header Accept pour les tests
    if (acceptHeader !== "text/event-stream" && !acceptHeader?.includes("text/event-stream")) {
      console.warn("Unsupported Accept header:", acceptHeader)
      // Continuer quand même pour le débogage
    }

    const encoder = new TextEncoder()
    const abortController = new AbortController()
    const { signal } = abortController

    const lastEventId = request.headers.get("Last-Event-ID")
    let lastMessageTimestamp = lastEventId ? new Date(lastEventId) : new Date(0) // Utiliser 0 pour obtenir tous les messages

    const stream = new ReadableStream({
      async start(controller) {
        // Envoyer un message de connexion
        controller.enqueue(encoder.encode("event: connected\ndata: true\n\n"))

        console.log(`SSE connection established for vehicle ${params.vehicleId}, user ${session.user.id}`)

        const checkMessages = async () => {
          if (signal.aborted) return

          try {
            const messages = await prisma.message.findMany({
              where: {
                vehicleId: params.vehicleId,
                createdAt: {
                  gt: lastMessageTimestamp,
                },
              },
              orderBy: {
                createdAt: "asc",
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            })

            if (messages.length > 0) {
              console.log(`Sending ${messages.length} new messages to client`)
            }

            for (const message of messages) {
              if (signal.aborted) break

              const eventData = `event: message\nid: ${message.createdAt.toISOString()}\ndata: ${JSON.stringify(message)}\n\n`
              controller.enqueue(encoder.encode(eventData))
              lastMessageTimestamp = message.createdAt
            }

            // Envoyer un heartbeat
            if (!signal.aborted) {
              controller.enqueue(encoder.encode(`event: ping\ndata: ${Date.now()}\n\n`))
            }
          } catch (error) {
            console.error("Error fetching messages:", error)
            if (!signal.aborted) {
              controller.enqueue(
                encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Error fetching messages" })}\n\n`),
              )
            }
          }

          // Planifier la prochaine vérification si le signal n'est pas aborté
          if (!signal.aborted) {
            setTimeout(checkMessages, 2000)
          }
        }

        // Démarrer la vérification des messages
        checkMessages()

        // Gestionnaire de nettoyage
        signal.addEventListener("abort", () => {
          console.log(`SSE connection closed for vehicle ${params.vehicleId}`)
          try {
            controller.close()
          } catch (e) {
            // Ignorer les erreurs de fermeture
          }
        })
      },

      cancel() {
        console.log(`SSE connection cancelled for vehicle ${params.vehicleId}`)
        abortController.abort()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (error) {
    console.error("SSE Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

