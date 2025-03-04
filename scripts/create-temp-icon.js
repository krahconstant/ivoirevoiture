const fs = require("fs")
const path = require("path")

// Créer le répertoire icons s'il n'existe pas
const iconsDir = path.join(process.cwd(), "public", "icons")
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Créer une icône temporaire 144x144 (un fichier texte avec des instructions)
const iconPath = path.join(iconsDir, "icon-144x144.png")
if (!fs.existsSync(iconPath)) {
  console.log("Création d'une icône temporaire...")

  // Créer un fichier texte avec des instructions
  const readmePath = path.join(iconsDir, "README.txt")
  fs.writeFileSync(
    readmePath,
    `
INSTRUCTIONS POUR LES ICÔNES PWA

Pour résoudre l'erreur 404 sur les icônes PWA, veuillez générer les icônes suivantes :
- /public/icons/android-chrome-192x192.png
- /public/icons/android-chrome-512x512.png
- /public/icons/apple-touch-icon.png
- /public/icons/favicon-16x16.png
- /public/icons/favicon-32x32.png
- /public/icons/icon-144x144.png (celui qui cause l'erreur 404)
- /public/favicon.ico

Utilisez le script dans scripts/generate-icons.js pour plus d'informations.
  `,
  )

  console.log("Fichier README.txt créé dans le dossier public/icons/")
  console.log("Veuillez générer les vraies icônes en suivant les instructions.")
}

