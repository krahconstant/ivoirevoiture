import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eJxZECxnCKaQyWcc0EIOrXA7JRtVwJ.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 pt-20 text-center">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Location et Vente de Voitures Premium
          </h1>
          <p className="mb-8 text-xl text-white/90">
            Découvrez notre sélection de véhicules haut de gamme pour la location ou l&apos;achat
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button className="min-w-[200px] bg-red-600 hover:bg-red-700">Voir le catalogue</Button>
            <Button variant="outline" className="min-w-[200px] border-white text-white hover:bg-white/10">
              Réserver maintenant
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

