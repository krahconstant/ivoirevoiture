import type { Role, VehicleType as PrismaVehicleType } from "@prisma/client"

export { Role } from "@prisma/client"

// Update the enum values to match the case you're using
export enum VehicleType {
  LOCATION = "LOCATION",
  VENTE = "VENTE",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// Define ReservationStatus as a standalone enum
export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  createdAt?: Date
  updatedAt?: Date
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  price: number
  type: VehicleType
  available: boolean
  images: string[]
  description?: string
  dailyRate?: number
  createdAt: Date
  updatedAt: Date
}

export interface Reservation {
  id: string
  userId: string
  vehicleId: string
  startDate: Date
  endDate: Date
  totalPrice: number
  status: ReservationStatus
  name: string
  email: string
  phone: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  user?: User
  vehicle?: Vehicle
}

export interface Message {
  id: string
  content: string
  createdAt: Date
  userId: string
  vehicleId: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  vehicle: {
    id: string
    brand: string
    model: string
  }
}

// Conversion functions
export function convertPrismaRole(role: Role): UserRole {
  return role as UserRole
}

// Conversion function
export function convertPrismaVehicleType(type: PrismaVehicleType): VehicleType {
  switch (type) {
    case "LOCATION":
      return VehicleType.LOCATION
    case "VENTE":
      return VehicleType.VENTE
    default:
      throw new Error(`Unknown vehicle type: ${type}`)
  }
}

// Helper function to validate reservation status
export function isValidReservationStatus(status: string): status is ReservationStatus {
  return Object.values(ReservationStatus).includes(status as ReservationStatus)
}

// Fonction pour convertir une réservation Prisma en type Reservation
export function convertPrismaReservation(prismaReservation: any): Reservation {
  // Ajouter des logs pour le débogage
  console.log(`Conversion de la réservation: ${prismaReservation.id}`)

  return {
    id: prismaReservation.id,
    userId: prismaReservation.userId,
    vehicleId: prismaReservation.vehicleId,
    startDate: prismaReservation.startDate,
    endDate: prismaReservation.endDate,
    totalPrice: prismaReservation.totalPrice,
    status: prismaReservation.status as ReservationStatus,
    name: prismaReservation.name,
    email: prismaReservation.email,
    phone: prismaReservation.phone,
    notes: prismaReservation.notes,
    createdAt: prismaReservation.createdAt,
    updatedAt: prismaReservation.updatedAt,
    user: prismaReservation.user
      ? {
          id: prismaReservation.user.id,
          name: prismaReservation.user.name,
          email: prismaReservation.user.email,
          phone: prismaReservation.user.phone || "",
          role: prismaReservation.user.role || UserRole.USER,
        }
      : undefined,
    vehicle: prismaReservation.vehicle
      ? {
          id: prismaReservation.vehicle.id,
          brand: prismaReservation.vehicle.brand,
          model: prismaReservation.vehicle.model,
          price: prismaReservation.vehicle.price || 0,
          type: prismaReservation.vehicle.type
            ? convertPrismaVehicleType(prismaReservation.vehicle.type)
            : VehicleType.LOCATION,
          available: true, // Valeur par défaut, à ajuster si nécessaire
          images: prismaReservation.vehicle.images || [],
          dailyRate: prismaReservation.vehicle.dailyRate || undefined,
          createdAt: prismaReservation.vehicle.createdAt || new Date(),
          updatedAt: prismaReservation.vehicle.updatedAt || new Date(),
        }
      : undefined,
  }
}

