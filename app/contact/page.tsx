"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    })

    setIsSubmitting(false)
    // Reset form
    event.currentTarget.reset()
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Contactez-nous</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Nous sommes à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets.
          </p>
        </section>

        {/* Contact Info & Form */}
        <section className="grid gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Nos Coordonnées</h2>

            <Card>
              <CardContent className="flex items-start space-x-4 p-6">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Adresse</h3>
                  <p className="text-muted-foreground">Yopoiugon camp militaire</p>
                  <p className="text-muted-foreground">Abidjan, Côte d'Ivoire</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start space-x-4 p-6">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Téléphone</h3>
                  <p className="text-muted-foreground">+225 XX XX XX XX XX</p>
                  <p className="text-muted-foreground">Lun-Sam: 8h-18h</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start space-x-4 p-6">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">info@ivoirevoiture.ci</p>
                  <p className="text-muted-foreground">support@ivoirevoiture.ci</p>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video w-full bg-muted">
                  {/* Placeholder for map - in a real app, you'd use a map component here */}
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Carte interactive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" name="subject" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" rows={5} required />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Questions Fréquentes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quels documents sont nécessaires pour louer un véhicule?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pour louer un véhicule, vous devez présenter une pièce d'identité valide, un permis de conduire valide
                  depuis au moins 2 ans, et une caution (carte bancaire ou espèces).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quelle est la durée minimale de location?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  La durée minimale de location est de 24 heures. Nous proposons également des tarifs spéciaux pour les
                  locations de longue durée.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Les véhicules sont-ils assurés?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, tous nos véhicules sont couverts par une assurance tous risques. Une franchise reste toutefois à
                  la charge du locataire en cas de sinistre responsable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposez-vous un service de livraison?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, nous pouvons livrer le véhicule à l'adresse de votre choix à Abidjan et dans les principales
                  villes de Côte d'Ivoire, moyennant des frais supplémentaires.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

