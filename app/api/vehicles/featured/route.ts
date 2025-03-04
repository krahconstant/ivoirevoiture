import { NextResponse } from "next/server"
import { getFeaturedVehicles } from "@/lib/data"

export function GET() {
  const vehicles = getFeaturedVehicles()
  return NextResponse.json(vehicles)
}

