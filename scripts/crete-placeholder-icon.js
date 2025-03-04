const fs = require("fs")
const path = require("path")

// Créer le répertoire icons s'il n'existe pas
const iconsDir = path.join(process.cwd(), "public", "icons")
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Créer une icône temporaire 144x144 (un fichier binaire vide de 1x1 pixel)
const iconPath = path.join(iconsDir, "icon-144x144.png")
if (!fs.existsSync(iconPath)) {
  console.log("Création d'une icône temporaire...")

  // Créer un fichier PNG minimal (1x1 pixel transparent)
  // Base64 d'un PNG 1x1 transparent
  const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  const pngBuffer = Buffer.from(pngBase64, "base64")

  fs.writeFileSync(iconPath, pngBuffer)

  console.log("Icône temporaire créée : " + iconPath)
}

