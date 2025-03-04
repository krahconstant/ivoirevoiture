"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

export function VehicleSearch() {
  const router = useRouter()
  const [brand, setBrand] = useState("all")
  const [type, setType] = useState("all")
  const [priceMax, setPriceMax] = useState("all")

  const [openBrand, setOpenBrand] = useState(false)
  const [openType, setOpenType] = useState(false)
  const [openPrice, setOpenPrice] = useState(false)

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
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-8">Trouvez votre véhicule idéal</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <Popover open={openBrand} onOpenChange={setOpenBrand}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openBrand}
              className="w-full md:w-[200px] justify-between"
              disabled={isLoadingBrands}
            >
              {isLoadingBrands ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </div>
              ) : (
                <>
                  {brand !== "all" ? brands.find((b) => b.value === brand)?.label : "Marque"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Rechercher une marque..." />
              <CommandList>
                <CommandEmpty>Aucune marque trouvée.</CommandEmpty>
                <CommandGroup>
                  {brands.map((b) => (
                    <CommandItem
                      key={b.value}
                      value={b.value}
                      onSelect={(currentValue: string) => {
                        setBrand(currentValue === brand ? "all" : currentValue)
                        setOpenBrand(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", brand === b.value ? "opacity-100" : "opacity-0")} />
                      {b.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openType} onOpenChange={setOpenType}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openType}
              className="w-full md:w-[200px] justify-between"
            >
              {type !== "all" ? types.find((t) => t.value === type)?.label : "Type"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {types.map((t) => (
                    <CommandItem
                      key={t.value}
                      value={t.value}
                      onSelect={(currentValue: string) => {
                        setType(currentValue === type ? "all" : currentValue)
                        setOpenType(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", type === t.value ? "opacity-100" : "opacity-0")} />
                      {t.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openPrice} onOpenChange={setOpenPrice}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openPrice}
              className="w-full md:w-[200px] justify-between"
            >
              {priceMax !== "all" ? priceRanges.find((p) => p.value === priceMax)?.label : "Prix maximum"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {priceRanges.map((p) => (
                    <CommandItem
                      key={p.value}
                      value={p.value}
                      onSelect={(currentValue: string) => {
                        setPriceMax(currentValue === priceMax ? "all" : currentValue)
                        setOpenPrice(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", priceMax === p.value ? "opacity-100" : "opacity-0")} />
                      {p.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button className="w-full md:w-auto" onClick={handleSearch}>
          Rechercher
        </Button>
      </div>
    </div>
  )
}

