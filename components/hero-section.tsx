import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://i.ytimg.com/vi/tPjAMly05dI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBpuwFtNcF8L2tQ-oZ50M8l3fzYYA')",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Location et Vente de Voitures Premium</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Découvrez notre sélection de véhicules haut de gamme pour la location ou l'achat
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="default" asChild>
            <Link href="/vehicules">Voir le catalogue</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10" asChild>
            <Link href="/location">Réserver maintenant</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

