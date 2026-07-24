const fs = require('fs');

let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/src="\/eliswa_logo\.png"/g, 'src="/Eliswa%20Logo.PNG"');
fs.writeFileSync('src/components/Navbar.tsx', navbar);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/src="\/eliswa_india\.png"/g, 'src="/Eliswa%20India.png"');
fs.writeFileSync('src/components/Footer.tsx', footer);

console.log("Updated to exact filenames");
