export enum VehicleType {
    LOCATION = "LOCATION",
    VENTE = "VENTE",
  }
  
  export interface Vehicle {
    id: string
    brand: string
    model: string
    price: number
    type: VehicleType
    dailyRate: number
    description: string
    images: string[]
    available: boolean
    createdAt: Date
    updatedAt: Date
  }