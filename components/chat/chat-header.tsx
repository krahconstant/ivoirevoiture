import { MoreVertical, Phone, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { VehicleType } from "@/lib/types"

interface ChatHeaderProps {
  vehicle: {
    id: string
    type: VehicleType
    brand: string
    model: string
    price: number
    dailyRate: number | null
    images: string[]
  }
  isOnline?: boolean
  isTyping?: boolean
}

export function ChatHeader({ vehicle, isOnline = false, isTyping = false }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-background">
          <AvatarImage src={vehicle.images[0]} alt={`${vehicle.brand} ${vehicle.model}`} />
          <AvatarFallback>{vehicle.brand[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">
              {vehicle.brand} {vehicle.model}
            </h3>
            {isOnline && <Badge variant="success" className="h-1.5 w-1.5 rounded-full p-0" aria-label="En ligne" />}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {vehicle.type === "LOCATION" ? `${vehicle.dailyRate}€/jour` : `${vehicle.price}€`}
            </p>
            {isTyping && <span className="text-xs text-muted-foreground animate-pulse">en train d'écrire...</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Appel audio">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Appel vidéo">
          <Video className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Plus d'options">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Voir le véhicule</DropdownMenuItem>
            <DropdownMenuItem>Marquer comme non lu</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Bloquer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

