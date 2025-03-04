import type { Vehicle } from "@/lib/types"
import type { VehicleType } from "@/lib/types"

function getBaseUrl() {
  if (typeof window !== "undefined") return "" // Browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT || 3000}` // dev SSR should use localhost
}

export async function getVehicles(
  params: {
    available?: boolean
    type?: VehicleType
  } = {},
) {
  const searchParams = new URLSearchParams()

  if (params.available !== undefined) {
    searchParams.set("available", params.available.toString())
  }

  if (params.type) {
    searchParams.set("type", params.type)
  }

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/vehicles?${searchParams.toString()}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Error fetching vehicles: ${response.statusText}`)
  }

  const data = await response.json()
  return data.vehicles as Vehicle[]
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/vehicles/${id}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Error fetching vehicle: ${response.statusText}`)
  }

  const data = await response.json()
  return data.vehicle
}

