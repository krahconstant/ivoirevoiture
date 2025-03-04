import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Filter, Search } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default async function VentePage() {
  // Fetch all vehicles with type VENTE from the database
  const saleVehicles = await prisma.vehicle.findMany({
    where: {
      type: "VENTE",
      available: true,
    },
    orderBy: {
      price: "asc",
    },
  })

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        {/* Hero Section */}
        <section className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Véhicules à Vendre</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Découvrez notre sélection de véhicules de qualité disponibles à l'achat en Côte d'Ivoire.
          </p>
        </section>

        {/* Filters Section - This could be enhanced with client components for actual filtering */}
        <section className="py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filtres:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Tous
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Berline
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                SUV
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                4x4
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Citadine
              </Badge>
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un véhicule..."
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </section>

        {/* Vehicles Grid */}
        <section className="py-6">
          <h2 className="mb-8 text-2xl font-bold">Nos Véhicules à Vendre ({saleVehicles.length})</h2>

          {saleVehicles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {saleVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id}
                  name={`${vehicle.brand} ${vehicle.model}`}
                  image={vehicle.images[0] || "/placeholder.svg?height=300&width=400"}
                  price={vehicle.price}
                  description={vehicle.description || ""}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">Aucun véhicule à vendre disponible actuellement.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="rounded-lg bg-muted py-12 text-center">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold">Vous ne trouvez pas ce que vous cherchez?</h2>
            <p className="text-muted-foreground">
              Contactez-nous pour discuter de vos besoins spécifiques ou pour organiser une visite de notre showroom.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/contact">Contactez-nous</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}

function VehicleCard({
  id,
  name,
  image,
  price,
  description,
}: { id: string; name: string; image: string; price: number; description: string }) {
  // Extract some features from the description
  const features = [
    description.includes("climatisation") || description.includes("clim") ? "Climatisation" : null,
    description.includes("automatique")
      ? "Boîte automatique"
      : description.includes("manuelle")
        ? "Boîte manuelle"
        : null,
    description.includes("cuir") ? "Intérieur cuir" : null,
    description.includes("GPS") || description.includes("navigation") ? "Système de navigation" : null,
  ].filter(Boolean)

  // If we couldn't extract enough features, add some generic ones
  if (features.length < 2) {
    if (!features.includes("Climatisation")) features.push("Climatisation")
    if (!features.includes("Boîte automatique") && !features.includes("Boîte manuelle")) {
      features.push("Boîte automatique")
    }
  }

  return (
    <Card>
      <div className="relative aspect-video overflow-hidden">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatPrice(price)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/vehicules/${id}`}>Détails</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/chat/${id}`}>Contacter le vendeur</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

