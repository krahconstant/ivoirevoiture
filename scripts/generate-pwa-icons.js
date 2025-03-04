const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

// Assurez-vous que le répertoire icons existe
const iconsDir = path.join(process.cwd(), "public", "icons")
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Tailles d'icônes à générer
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

// Fonction pour générer les icônes
async function generateIcons() {
  // Utilisez une image source (remplacez par votre logo)
  const sourceImage = path.join(process.cwd(), "public", "logo.png")

  // Si vous n'avez pas de logo.png, créez une image de base
  if (!fs.existsSync(sourceImage)) {
    console.log("Logo source non trouvé, création d'une image de base...")
    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
    })
      .composite([
        {
          input: Buffer.from(`<svg width="512" height="512">
        <rect width="512" height="512" fill="#000000"/>
        <text x="50%" y="50%" font-family="Arial" font-size="72" fill="white" text-anchor="middle" dominant-baseline="middle">VI</text>
      </svg>`),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toFile(sourceImage)
  }

  // Générer les icônes dans différentes tailles
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`)
    await sharp(sourceImage).resize(size, size).png().toFile(outputPath)
    console.log(`Icône générée: ${outputPath}`)
  }

  // Générer également un favicon.ico
  await sharp(sourceImage)
    .resize(32, 32)
    .toFile(path.join(process.cwd(), "public", "favicon.ico"))
  console.log("Favicon généré")
}

generateIcons()
  .then(() => console.log("Génération des icônes terminée!"))
  .catch((err) => console.error("Erreur lors de la génération des icônes:", err))

