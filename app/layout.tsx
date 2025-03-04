import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from 'next/font/google'
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/layout/header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
}

export const metadata: Metadata = {
  title: {
    default: "VenteIvoire - Location et Vente de Véhicules",
    template: "%s | VenteIvoire",
  },
  description: "Location et vente de véhicules de luxe en Côte d'Ivoire",
  keywords: ["location voiture", "vente voiture", "Côte d'Ivoire", "Abidjan", "véhicules de luxe"],
  authors: [{ name: "VenteIvoire" }],
  creator: "VenteIvoire",
  metadataBase: new URL("https://venteivoire.ci"),
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://venteivoire.ci",
    title: "VenteIvoire - Location et Vente de Véhicules",
    description: "Location et vente de véhicules de luxe en Côte d'Ivoire",
    siteName: "VenteIvoire",
  },
  twitter: {
    card: "summary_large_image",
    title: "VenteIvoire - Location et Vente de Véhicules",
    description: "Location et vente de véhicules de luxe en Côte d'Ivoire",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" }
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png" }
    ],
    shortcut: ["/favicon.ico"]
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} flex min-h-full flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}