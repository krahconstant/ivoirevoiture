import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionEdge } from "@/lib/edge-auth" // Utilisez la version Edge
import { UserRole } from "@/lib/types"

export async function middleware(request: NextRequest) {
  const session = await getSessionEdge()
  // Logs de débogage
  console.log("Current path:", request.nextUrl.pathname)
  console.log("Session:", session)
  console.log("User role:", session?.user?.role)

  // Liste des routes protégées
  const protectedRoutes = ["/dashboard", "/admin", "/reservation"]
  const authRoutes = ["/auth/login", "/auth/register"]

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  // Si c'est une route admin, vérifier le rôle
  if (isAdminRoute) {
    if (!session?.user) {
      console.log("No session found for admin route")
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (session.user.role !== UserRole.ADMIN) {
      console.log("User is not admin:", session.user.role)
      return NextResponse.redirect(new URL("/", request.url))
    }

    console.log("Admin access granted")
    return NextResponse.next()
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (isProtectedRoute && !session) {
    console.log("Protected route access denied")
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux routes d'authentification
  if (isAuthRoute && session) {
    console.log("Auth route redirect for logged in user")
    return NextResponse.redirect(new URL(session.user.role === UserRole.ADMIN ? "/admin" : "/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/reservation/:path*", "/auth/login", "/auth/register"],
}

