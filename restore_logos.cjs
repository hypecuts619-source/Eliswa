const fs = require('fs');

// Fix Navbar.tsx
let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace("import { LogoEW } from './Logo';", "import eliswaLogo from '../assets/eliswa_logo.png';");
navbar = navbar.replace(
  `<LogoEW className="h-16 md:h-20 transition-transform duration-300 group-hover/logo:scale-[1.02]" />`,
  `<img src={eliswaLogo} alt="EW Logo" className="h-16 md:h-20 transition-transform duration-300 group-hover/logo:scale-[1.02] object-contain" />`
);
navbar = navbar.replace(
  `<LogoEW className="absolute top-5 h-16" />`,
  `<img src={eliswaLogo} alt="EW Logo" className="absolute top-5 h-16 object-contain" />`
);
fs.writeFileSync('src/components/Navbar.tsx', navbar);

// Fix Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace("import { LogoEliswa } from './Logo';", "import eliswaIndia from '../assets/eliswa_india.png';");
footer = footer.replace(
  `<LogoEliswa className="h-32 md:h-48 -mt-4" />`,
  `<img src={eliswaIndia} alt="Eliswa India" className="h-32 md:h-48 object-contain -mt-4" />`
);
fs.writeFileSync('src/components/Footer.tsx', footer);

console.log("Logos restored");
