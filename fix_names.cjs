const fs = require('fs');

let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/src="\/Eliswa%20Logo\.PNG"/g, 'src="/eliswa_logo.png"');
navbar = navbar.replace(/src="\/Eliswa Logo\.PNG"/g, 'src="/eliswa_logo.png"');
fs.writeFileSync('src/components/Navbar.tsx', navbar);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/src="\/Eliswa%20India\.png"/g, 'src="/eliswa_india.png"');
footer = footer.replace(/src="\/Eliswa India\.png"/g, 'src="/eliswa_india.png"');
fs.writeFileSync('src/components/Footer.tsx', footer);

console.log("Updated to standard names");
