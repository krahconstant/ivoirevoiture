import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Vente Ivoire</h3>
            <p className="mb-4 text-sm text-gray-400">Location et vente de véhicules de luxe en Côte d&apos;Ivoire</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/vehicules" className="text-gray-400 hover:text-white">
                  Nos véhicules
                </a>
              </li>
              <li>
                <a href="/location" className="text-gray-400 hover:text-white">
                  Location
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/location" className="text-gray-400 hover:text-white">
                  Location courte durée
                </a>
              </li>
              <li>
                <a href="/location" className="text-gray-400 hover:text-white">
                  Location longue durée
                </a>
              </li>
              <li>
                <a href="/vehicules" className="text-gray-400 hover:text-white">
                  Vente de véhicules
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-white">
                  Services VIP
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>+225 00 00 00 00</li>
              <li>contact@venteivoire.ci</li>
              <li>Abidjan, Côte d&apos;Ivoire</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Vente Ivoire. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

