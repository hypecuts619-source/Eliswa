const fs = require('fs');

// Fix Navbar.tsx
let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace("import eliswaLogo from '../assets/eliswa_logo.png';", "import eliswaLogo from '../assets/brand_logo.webp';");
fs.writeFileSync('src/components/Navbar.tsx', navbar);

// Fix Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace("import eliswaIndia from '../assets/eliswa_india.png';", "import eliswaIndia from '../assets/brand_india.webp';");
fs.writeFileSync('src/components/Footer.tsx', footer);

console.log("Logos fixed");
