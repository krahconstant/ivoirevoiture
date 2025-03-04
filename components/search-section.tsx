"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Keep the static options for types and price ranges
const types = [
  { label: "Tous les types", value: "all" },
  { label: "Location", value: "LOCATION" },
  { label: "Vente", value: "VENTE" },
]

const priceRanges = [
  { label: "Tous les prix", value: "all" },
  { label: "Moins de 50 000 000 FCFA", value: "50000000" },
  { label: "Moins de 100 000 000 FCFA", value: "100000000" },
  { label: "Moins de 150 000 000 FCFA", value: "150000000" },
  { label: "Plus de 150 000 000 FCFA", value: "150000001" },
]

interface BrandOption {
  label: string
  value: string
}

export function SearchSection() {
  const router = useRouter()
  const [brand, setBrand] = useState("all")
  const [type, setType] = useState("all")
  const [priceMax, setPriceMax] = useState("all")

  const [brands, setBrands] = useState<BrandOption[]>([])
  const [isLoadingBrands, setIsLoadingBrands] = useState(true)

  // Fetch brands from the API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoadingBrands(true)
        const response = await fetch("/api/vehicles/brands")

        if (!response.ok) {
          throw new Error("Failed to fetch brands")
        }

        const data = await response.json()
        setBrands(data.brands || [])
      } catch (error) {
        console.error("Error fetching brands:", error)
        // Fallback to a default "All brands" option if fetch fails
        setBrands([{ label: "Toutes les marques", value: "all" }])
      } finally {
        setIsLoadingBrands(false)
      }
    }

    fetchBrands()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (brand && brand !== "all") params.append("brand", brand)
    if (type && type !== "all") params.append("type", type)
    if (priceMax && priceMax !== "all") params.append("priceMax", priceMax)

    router.push(`/vehicules${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Trouvez votre véhicule idéal</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={brand} onValueChange={setBrand} disabled={isLoadingBrands}>
              <SelectTrigger>
                {isLoadingBrands ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </div>
                ) : (
                  <SelectValue placeholder="Marque" />
                )}
              </SelectTrigger>
              <SelectContent>
                {brands.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceMax} onValueChange={setPriceMax}>
              <SelectTrigger>
                <SelectValue placeholder="Prix max" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

