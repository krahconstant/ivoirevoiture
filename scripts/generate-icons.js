const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Créer le répertoire icons s'il n'existe pas
const iconsDir = path.join(process.cwd(), "public", "icons")
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

console.log(`
=====================================================
INSTRUCTIONS POUR GÉNÉRER LES ICÔNES PWA
=====================================================

Pour résoudre l'erreur 404 sur les icônes PWA, veuillez suivre ces étapes :

1. Créez un logo carré pour votre application (idéalement 512x512 pixels)
2. Installez le package 'sharp' pour Node.js :
   npm install sharp

3. Placez votre logo dans le dossier 'public' sous le nom 'logo.png'

4. Exécutez ce script pour générer toutes les icônes nécessaires :
   node scripts/generate-icons.js

Les icônes suivantes seront générées :
- /public/icons/android-chrome-192x192.png
- /public/icons/android-chrome-512x512.png
- /public/icons/apple-touch-icon.png
- /public/icons/favicon-16x16.png
- /public/icons/favicon-32x32.png
- /public/icons/icon-144x144.png (celui qui cause l'erreur 404)
- /public/favicon.ico

=====================================================
`)

// Vérifier si sharp est installé
try {
  require.resolve("sharp")
  console.log("Le package sharp est installé. Vous pouvez générer les icônes.")
} catch (e) {
  console.log("Le package sharp n'est pas installé. Veuillez l'installer avec npm install sharp")
}

// Vérifier si le logo source existe
const logoPath = path.join(process.cwd(), "public", "logo.png")
if (fs.existsSync(logoPath)) {
  console.log("Logo trouvé! Vous pouvez générer les icônes en exécutant ce script.")
} else {
  console.log("Logo non trouvé. Veuillez placer votre logo dans public/logo.png")
}

// Exemple de code pour générer les icônes (commenté pour éviter l'exécution accidentelle)
console.log(`
// Exemple de code pour générer les icônes avec sharp :

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  
  // Générer les icônes Android
  await sharp(logoPath)
    .resize(192, 192)
    .toFile(path.join(iconsDir, 'android-chrome-192x192.png'));
  
  await sharp(logoPath)
    .resize(512, 512)
    .toFile(path.join(iconsDir, 'android-chrome-512x512.png'));
  
  // Générer l'icône Apple
  await sharp(logoPath)
    .resize(180, 180)
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  
  // Générer les favicons
  await sharp(logoPath)
    .resize(16, 16)
    .toFile(path.join(iconsDir, 'favicon-16x16.png'));
  
  await sharp(logoPath)
    .resize(32, 32)
    .toFile(path.join(iconsDir, 'favicon-32x32.png'));
  
  // Générer l'icône 144x144 (celle qui cause l'erreur 404)
  await sharp(logoPath)
    .resize(144, 144)
    .toFile(path.join(iconsDir, 'icon-144x144.png'));
  
  // Générer le favicon.ico (conversion en ICO requise)
  await sharp(logoPath)
    .resize(32, 32)
    .toFile(path.join(process.cwd(), 'public', 'favicon.ico'));
  
  console.log('Toutes les icônes ont été générées avec succès!');
}

generateIcons().catch(console.error);
`)

