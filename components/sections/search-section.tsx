import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchSection() {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Trouvez votre véhicule idéal</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Marque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mercedes">Mercedes</SelectItem>
                <SelectItem value="bmw">BMW</SelectItem>
                <SelectItem value="audi">Audi</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="vente">Vente</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Prix max" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50000">Jusqu'à 50,000€</SelectItem>
                <SelectItem value="100000">Jusqu'à 100,000€</SelectItem>
                <SelectItem value="200000">Jusqu'à 200,000€</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

