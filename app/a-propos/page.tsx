import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, MapPin, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">À Propos de IvoireVoiture</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Votre partenaire de confiance pour la location et la vente de véhicules en Côte d'Ivoire depuis 2010.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Notre Histoire</h2>
            <p className="text-muted-foreground">
              Fondée en 2010, IvoireVoiture est née de la passion pour l'automobile et d'une vision claire : offrir aux
              Ivoiriens un accès facile à des véhicules de qualité, que ce soit pour la location ou l'achat.
            </p>
            <p className="text-muted-foreground">
              Au fil des années, nous avons développé une expertise solide dans le domaine automobile et avons constitué
              une flotte diversifiée pour répondre aux besoins variés de notre clientèle.
            </p>
            <p className="text-muted-foreground">
              Aujourd'hui, IvoireVoiture est fière de compter parmi les leaders du marché automobile en Côte d'Ivoire,
              avec une présence dans les principales villes du pays.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image src="/placeholder.svg?height=400&width=600" alt="Notre équipe" fill className="object-cover" />
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Nos Valeurs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                <Award className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-medium">Qualité</h3>
                <p className="text-muted-foreground">
                  Nous sélectionnons rigoureusement nos véhicules et assurons leur entretien régulier.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-medium">Service Client</h3>
                <p className="text-muted-foreground">
                  Nous plaçons la satisfaction de nos clients au cœur de nos préoccupations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                <Clock className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-medium">Fiabilité</h3>
                <p className="text-muted-foreground">
                  Nous respectons nos engagements et sommes disponibles 24/7 pour nos clients.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                <MapPin className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-medium">Proximité</h3>
                <p className="text-muted-foreground">
                  Nous sommes présents dans les principales villes de Côte d'Ivoire.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Notre Équipe</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TeamMember name="Kouamé Konan" role="Directeur Général" image="/placeholder.svg?height=300&width=300" />
            <TeamMember
              name="Aminata Diallo"
              role="Responsable Commercial"
              image="/placeholder.svg?height=300&width=300"
            />
            <TeamMember name="Jean-Marc Yao" role="Chef Mécanicien" image="/placeholder.svg?height=300&width=300" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-lg bg-muted py-12 text-center">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold">Envie d'en savoir plus?</h2>
            <p className="text-muted-foreground">
              N'hésitez pas à nous contacter pour toute question ou pour discuter de vos besoins spécifiques.
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

function TeamMember({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="relative h-40 w-40 overflow-hidden rounded-full">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div>
        <h3 className="text-xl font-medium">{name}</h3>
        <p className="text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}

