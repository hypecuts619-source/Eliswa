const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const targetMenu = `<div className="hidden md:flex items-center justify-center gap-6 lg:gap-10 text-[10px] lg:text-[11px] tracking-[0.25em] uppercase font-semibold text-[#cf958f]">
            <a href="#home" className="hover:text-[#a86058] transition-colors relative group py-1">
              The House
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
            <span className="text-[#cf958f]/40 text-xs select-none">•</span>
            <a href="#collection" className="hover:text-[#a86058] transition-colors relative group py-1">
              The Collection
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
            <span className="text-[#cf958f]/40 text-xs select-none">•</span>
            <a href="#about-us" className="hover:text-[#a86058] transition-colors relative group py-1">
              Our Story
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
            <span className="text-[#cf958f]/40 text-xs select-none">•</span>
            <a href="#client-stories" className="hover:text-[#a86058] transition-colors relative group py-1">
              Patrons
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
            <span className="text-[#cf958f]/40 text-xs select-none">•</span>
            <a href="/journal" className="hover:text-[#a86058] transition-colors relative group py-1">
              The Editorial
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
          </div>`;

const replaceMenu = `<div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 text-[10px] lg:text-[11px] tracking-[0.25em] uppercase font-semibold text-[#cf958f]">
            <a href="/" className="hover:text-[#a86058] transition-colors relative group py-1">
              Home
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
            <span className="text-[#cf958f]/40 text-xs select-none">•</span>
            
            <div className="relative group/nav-item py-1">
              <span className="hover:text-[#a86058] transition-colors cursor-pointer">
                Collections
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-cream border border-[#cf958f]/20 shadow-lg py-2 opacity-0 pointer-events-none group-hover/nav-item:opacity-100 group-hover/nav-item:pointer-events-auto transition-all duration-300 flex flex-col text-center">
                <a href="/onam-sarees" className="py-2 hover:bg-vintage/5 hover:text-[#a86058] transition-colors">Onam Sarees</a>
                <a href="/kasavu-sarees" className="py-2 hover:bg-vintage/5 hover:text-[#a86058] transition-colors">Kasavu Sarees</a>
                <a href="/tissue-sarees" className="py-2 hover:bg-vintage/5 hover:text-[#a86058] transition-colors">Tissue Sarees</a>
              </div>
            </div>

            <span className="text-[#cf958f]/40 text-xs select-none">•</span>
            <a href="/about" className="hover:text-[#a86058] transition-colors relative group py-1">
              About
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
            <span className="text-[#cf958f]/40 text-xs select-none">•</span>
            <a href="/contact" className="hover:text-[#a86058] transition-colors relative group py-1">
              Contact
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
            <span className="text-[#cf958f]/40 text-xs select-none">•</span>
            <a href="/journal" className="hover:text-[#a86058] transition-colors relative group py-1">
              The Editorial
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
          </div>`;

content = content.replace(targetMenu, replaceMenu);

const mobileMenu = `{[
            { label: 'The House', href: '#home' },
            { label: 'The Collection', href: '#collection' },
            { label: 'Our Story', href: '#about-us' },
            { label: 'Patrons', href: '#client-stories' },
            { label: "The Editorial", href: '/journal' }
          ]`;

const mobileReplace = `{[
            { label: 'Home', href: '/' },
            { label: 'Onam Sarees', href: '/onam-sarees' },
            { label: 'Kasavu Sarees', href: '/kasavu-sarees' },
            { label: 'Tissue Sarees', href: '/tissue-sarees' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: "The Editorial", href: '/journal' }
          ]`;

content = content.replace(mobileMenu, mobileReplace);

fs.writeFileSync('src/components/Navbar.tsx', content);
console.log("Navbar.tsx updated");
