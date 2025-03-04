"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ value = [], onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)

        // Créer un FormData avec les images
        const formData = new FormData()
        acceptedFiles.forEach((file) => {
          formData.append("files", file)
        })

        // Envoyer les images au serveur
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        onChange([...value, ...data.urls])
      } catch (error) {
        console.error("Upload error:", error)
      } finally {
        setIsUploading(false)
      }
    },
    [value, onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    disabled: disabled || isUploading,
    multiple: true,
  })

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-sm">
            {isDragActive ? (
              <p>Déposez les images ici</p>
            ) : (
              <p>Glissez-déposez des images ici, ou cliquez pour sélectionner des fichiers</p>
            )}
          </div>
          <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
        </div>
      </div>

      {/* Prévisualisation des images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {value.map((url, index) => (
            <div key={index} className="group relative aspect-square">
              <Image
                src={url || "/placeholder.svg"}
                alt={`Image ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

