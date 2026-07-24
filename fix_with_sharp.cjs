const sharp = require('sharp');
const fs = require('fs');

async function fix() {
  await sharp('public/eliswa_logo.png').toFile('public/eliswa_logo_fixed.png');
  await sharp('public/eliswa_india.png').toFile('public/eliswa_india_fixed.png');
  
  fs.copyFileSync('public/eliswa_logo_fixed.png', 'public/eliswa_logo.png');
  fs.copyFileSync('public/eliswa_india_fixed.png', 'public/eliswa_india.png');
  
  console.log("Images fixed with sharp.");
}
fix();
