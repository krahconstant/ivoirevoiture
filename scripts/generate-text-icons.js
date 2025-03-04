const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateTextIcons() {
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  // Texte à afficher (initiales de votre application)
  const text = 'VI';
  // Couleur de fond
  const bgColor = '#000000';
  // Couleur du texte
  const textColor = '#FFFFFF';
  
  // Tailles d'icônes à générer
  const sizes = [16, 32, 144, 180, 192, 512];
  
  console.log('Génération des icônes textuelles en cours...');
  
  for (const size of sizes) {
    // Créer un SVG avec le texte
    const fontSize = Math.floor(size * 0.5); // Taille de police proportionnelle
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${bgColor}"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="${fontSize}px" 
          font-weight="bold"
          fill="${textColor}" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >${text}</text>
      </svg>
    `;
    
    // Nom de fichier selon la taille
    let filename;
    if (size === 16) filename = 'favicon-16x16.png';
    else if (size === 32) filename = 'favicon-32x32.png';
    else if (size === 144) filename = 'icon-144x144.png';
    else if (size === 180) filename = 'apple-touch-icon.png';
    else if (size === 192) filename = 'android-chrome-192x192.png';
    else if (size === 512) filename = 'android-chrome-512x512.png';
    
    // Convertir SVG en PNG
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(iconsDir, filename));
    
    console.log(`✓ ${filename}`);
  }
  
  // Générer aussi favicon.ico (copie de favicon-32x32.png)
  await sharp(path.join(iconsDir, 'favicon-32x32.png'))
    .toFile(path.join(process.cwd(), 'public', 'favicon.ico'));
  console.log('✓ favicon.ico');
  
  console.log('Toutes les icônes ont été générées avec succès!');
}

generateTextIcons().catch(err => {
  console.error('Erreur lors de la génération des icônes:', err);
});