"use client"

import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="container flex flex-col items-center justify-center min-h-screen gap-4">
          <Alert variant="destructive" className="max-w-md">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Une erreur critique est survenue</AlertTitle>
            <AlertDescription>{error.message || "Une erreur inattendue s'est produite."}</AlertDescription>
          </Alert>
          <Button onClick={() => reset()}>Réessayer</Button>
        </div>
      </body>
    </html>
  )
}

