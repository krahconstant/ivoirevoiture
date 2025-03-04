import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* À propos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">À propos de VenteIvoire</h3>
          <p className="text-sm text-muted-foreground">
            Leader dans la vente et la location de véhicules de luxe en Côte d'Ivoire. Nous proposons une large gamme de
            véhicules pour répondre à tous vos besoins.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Navigation rapide */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Navigation rapide</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/vehicules" className="text-muted-foreground hover:text-primary">
                Nos véhicules
              </Link>
            </li>
            <li>
              <Link href="/location" className="text-muted-foreground hover:text-primary">
                Location
              </Link>
            </li>
            <li>
              <Link href="/vente" className="text-muted-foreground hover:text-primary">
                Vente
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="text-muted-foreground hover:text-primary">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nos services</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Location courte durée
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Location longue durée
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Vente de véhicules
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Service après-vente
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Financement
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Yopougon champ militaire, Abidjan, Côte d'Ivoire</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">+225 01 02 03 04 05</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">contact@ivoirevoiture.ci</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t">
        <div className="container flex flex-col items-center gap-2 py-6 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IvoireVoiture. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/mentions-legales" className="hover:text-primary">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-primary">
              Politique de confidentialité
            </Link>
            <Link href="/cgv" className="hover:text-primary">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

