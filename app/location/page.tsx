import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Car, Check, Shield } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default async function LocationPage() {
  // Fetch all vehicles with type LOCATION from the database
  const rentalVehicles = await prisma.vehicle.findMany({
    where: {
      type: "LOCATION",
      available: true,
    },
    orderBy: {
      price: "asc",
    },
  })

  // Group vehicles by category (we'll use price ranges as categories)
  const economicVehicles = rentalVehicles.filter((v) => v.dailyRate && v.dailyRate < 30000)
  const standardVehicles = rentalVehicles.filter((v) => v.dailyRate && v.dailyRate >= 30000 && v.dailyRate < 60000)
  const luxuryVehicles = rentalVehicles.filter((v) => v.dailyRate && v.dailyRate >= 60000)

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        {/* Hero Section */}
        <section className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Location de Véhicules</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Découvrez notre flotte de véhicules de qualité disponibles à la location pour tous vos besoins de
            déplacement en Côte d'Ivoire.
          </p>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 text-center">
              <Car className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-medium">Large Sélection</h3>
              <p className="text-muted-foreground">
                Des véhicules économiques aux modèles de luxe pour tous vos besoins.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 text-center">
              <CalendarDays className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-medium">Flexibilité</h3>
              <p className="text-muted-foreground">
                Locations à court ou long terme avec des tarifs adaptés à votre budget.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 text-center">
              <Shield className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-medium">Sécurité</h3>
              <p className="text-muted-foreground">Tous nos véhicules sont régulièrement entretenus et assurés.</p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Nos Véhicules à Louer</h2>
          <Tabs defaultValue="economique" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="economique">Économique</TabsTrigger>
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="luxe">Luxe</TabsTrigger>
            </TabsList>

            <TabsContent value="economique">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {economicVehicles.length > 0 ? (
                  economicVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      id={vehicle.id}
                      name={`${vehicle.brand} ${vehicle.model}`}
                      image={vehicle.images[0] || "/placeholder.svg?height=300&width=400"}
                      price={vehicle.dailyRate || 0}
                      features={[
                        "Climatisation",
                        vehicle.description?.includes("places")
                          ? vehicle.description.match(/(\d+)\s+places/)?.[0] || "5 places"
                          : "5 places",
                      ]}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">Aucun véhicule économique disponible actuellement.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="standard">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {standardVehicles.length > 0 ? (
                  standardVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      id={vehicle.id}
                      name={`${vehicle.brand} ${vehicle.model}`}
                      image={vehicle.images[0] || "/placeholder.svg?height=300&width=400"}
                      price={vehicle.dailyRate || 0}
                      features={[
                        "Climatisation",
                        vehicle.description?.includes("places")
                          ? vehicle.description.match(/(\d+)\s+places/)?.[0] || "5 places"
                          : "5 places",
                      ]}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">Aucun véhicule standard disponible actuellement.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="luxe">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {luxuryVehicles.length > 0 ? (
                  luxuryVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      id={vehicle.id}
                      name={`${vehicle.brand} ${vehicle.model}`}
                      image={vehicle.images[0] || "/placeholder.svg?height=300&width=400"}
                      price={vehicle.dailyRate || 0}
                      features={[
                        "Climatisation",
                        "Cuir",
                        vehicle.description?.includes("places")
                          ? vehicle.description.match(/(\d+)\s+places/)?.[0] || "5 places"
                          : "5 places",
                      ]}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">Aucun véhicule de luxe disponible actuellement.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="rounded-lg bg-muted py-12 text-center">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold">Prêt à réserver votre véhicule?</h2>
            <p className="text-muted-foreground">
              Consultez notre catalogue complet et trouvez le véhicule parfait pour vos besoins.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/vehicules">Voir tous les véhicules</Link>
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
  features,
}: { id: string; name: string; image: string; price: number; features: string[] }) {
  return (
    <Card>
      <div className="relative aspect-video overflow-hidden">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatPrice(price)}/jour</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/reserver?vehicleId=${id}`}>Réserver</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

