"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface VehicleGalleryProps {
  images: string[]
}

export function VehicleGallery({ images }: VehicleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
        <Image src={images[selectedImage] || "/placeholder.svg"} alt="Vehicle" fill className="object-cover" priority />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg",
              "ring-2 ring-offset-2 transition-all",
              selectedImage === index ? "ring-primary" : "ring-transparent hover:ring-muted-foreground/20",
            )}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Vehicle thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

