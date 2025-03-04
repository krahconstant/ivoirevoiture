import type { DefaultSession } from "next-auth"
import type { UserRole } from "@/lib/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      phone?: string | null
    } & DefaultSession["user"]
  }
}

