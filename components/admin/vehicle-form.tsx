"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"
import { VehicleType, type Vehicle } from "@/lib/types"

interface VehicleFormProps {
  vehicle?: Vehicle
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    description: vehicle?.description || "",
    type: vehicle?.type || VehicleType.LOCATION,
    price: vehicle?.price || 0,
    dailyRate: vehicle?.dailyRate || 0,
    available: vehicle?.available ?? true,
    images: vehicle?.images || [],
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(vehicle ? `/api/admin/vehicles/${vehicle.id}` : "/api/admin/vehicles", {
        method: vehicle ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }

      toast({
        title: vehicle ? "Véhicule modifié" : "Véhicule ajouté",
        description: vehicle ? "Le véhicule a été modifié avec succès" : "Le véhicule a été ajouté avec succès",
      })

      router.push("/admin/vehicules")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-8 p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Marque */}
            <div className="space-y-2">
              <label htmlFor="brand" className="text-sm font-medium">
                Marque
              </label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            {/* Modèle */}
            <div className="space-y-2">
              <label htmlFor="model" className="text-sm font-medium">
                Modèle
              </label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="type"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
                disabled={isLoading}
                required
              >
                <option value={VehicleType.LOCATION}>Location</option>
                <option value={VehicleType.VENTE}>Vente</option>
              </select>
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Prix
              </label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">Prix de vente ou caution pour la location</p>
            </div>

            {/* Tarif journalier */}
            <div className="space-y-2">
              <label htmlFor="dailyRate" className="text-sm font-medium">
                Tarif journalier
              </label>
              <Input
                id="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Uniquement pour les véhicules en location</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Disponibilité */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="available"
              className="h-4 w-4 rounded border-gray-300"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              disabled={isLoading}
            />
            <label htmlFor="available" className="text-sm font-medium">
              Disponible
            </label>
          </div>

          {/* Ajout du composant ImageUpload avant les boutons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Images</label>
            <ImageUpload
              value={formData.images}
              onChange={(urls) => setFormData({ ...formData, images: urls })}
              disabled={isLoading}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (vehicle ? "Modification..." : "Création...") : vehicle ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

