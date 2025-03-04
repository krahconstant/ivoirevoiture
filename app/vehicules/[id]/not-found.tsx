import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Véhicule non trouvé</h2>
      <p className="text-gray-600 mb-8">
        Désolé, le véhicule que vous recherchez n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <Button asChild>
        <Link href="/vehicules">Voir tous les véhicules</Link>
      </Button>
    </div>
  )
}

