import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Page non trouvée</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button asChild>
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  )
}

