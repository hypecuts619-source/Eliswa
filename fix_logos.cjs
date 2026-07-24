const fs = require('fs');

let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/import eliswaLogo from '[^']+';\n/, "");
navbar = navbar.replace(/src=\{eliswaLogo\}/g, 'src="/eliswa_logo.png"');
fs.writeFileSync('src/components/Navbar.tsx', navbar);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/import eliswaIndia from '[^']+';\n/, "");
footer = footer.replace(/src=\{eliswaIndia\}/g, 'src="/eliswa_india.png"');
fs.writeFileSync('src/components/Footer.tsx', footer);

console.log("Logos updated to use public paths");
