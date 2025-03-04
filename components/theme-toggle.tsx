"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Éviter l'erreur d'hydratation en ne rendant le contenu qu'après le montage
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Ne rien rendre jusqu'au montage pour éviter l'erreur d'hydratation
  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

