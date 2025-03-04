import { HeroSection } from "@/components/hero-section"
import { FeaturedVehicles } from "@/components/featured-vehicles"
import { SearchSection } from "@/components/search-section"
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <SearchSection />
      <FeaturedVehicles />
    </main>
  )
}

