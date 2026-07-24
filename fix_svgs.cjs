const fs = require('fs');

let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/src="\/eliswa_logo\.png"/g, 'src="/eliswa_logo.svg"');
fs.writeFileSync('src/components/Navbar.tsx', navbar);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/src="\/eliswa_india\.png"/g, 'src="/eliswa_india.svg"');
fs.writeFileSync('src/components/Footer.tsx', footer);

console.log("Logos updated to SVG placeholders");
