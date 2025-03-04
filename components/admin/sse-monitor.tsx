"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"

export function SSEMonitor() {
  const [status, setStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchStatus = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/sse-monitor")
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Charger le statut initial
    fetchStatus()

    // Configurer l'auto-refresh si activé
    let interval: NodeJS.Timeout | null = null

    if (autoRefresh) {
      interval = setInterval(() => {
        fetchStatus()
      }, 5000) // Rafraîchir toutes les 5 secondes
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [autoRefresh, fetchStatus])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Moniteur SSE</CardTitle>
            <CardDescription>État des connexions Server-Sent Events</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
              {autoRefresh ? "Désactiver auto" : "Activer auto"}
            </Button>
            <Button variant="outline" size="icon" onClick={fetchStatus} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-2 bg-destructive/10 text-destructive rounded-md">{error}</div>
        ) : status ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Dernière mise à jour:</span>
              <span>{new Date(status.timestamp).toLocaleTimeString()}</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Bibliothèque SSE</h3>
              <div className="flex items-center gap-2">
                <span>Clients actifs:</span>
                <Badge variant="outline">{status.connections.sseLib.clientCount}</Badge>
              </div>
              {status.connections.sseLib.clients.length > 0 && (
                <div className="border rounded-md p-2 bg-muted/50">
                  <ul className="space-y-1">
                    {status.connections.sseLib.clients.map((client: any, index: number) => (
                      <li key={index} className="text-sm flex items-center justify-between">
                        <span>Client {client.id}</span>
                        <Badge variant={client.isActive ? "success" : "destructive"}>
                          {client.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Notifications Admin</h3>
              <div className="flex items-center gap-2">
                <span>Contrôleurs actifs:</span>
                <Badge variant="outline">{status.connections.adminNotifications.controllerCount}</Badge>
              </div>
              {status.connections.adminNotifications.controllers.length > 0 && (
                <div className="border rounded-md p-2 bg-muted/50">
                  <ul className="space-y-1">
                    {status.connections.adminNotifications.controllers.map((controller: any, index: number) => (
                      <li key={index} className="text-sm flex items-center justify-between">
                        <span>Contrôleur #{index + 1}</span>
                        <Badge variant={controller.isActive ? "success" : "destructive"}>
                          {controller.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-24">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

