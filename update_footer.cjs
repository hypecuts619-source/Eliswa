const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const targetLinks1 = `<div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">CONNECT</h4>
            <div className="flex flex-col items-center space-y-2 text-xs tracking-widest uppercase font-semibold text-vintage/70">
              <a href="https://www.instagram.com/eliswaindia" target="_blank" rel="noopener noreferrer" className="hover:text-rose transition-colors">Instagram</a>
              <a href="#" className="hover:text-rose transition-colors">Facebook</a>
              <a href="#" className="hover:text-rose transition-colors">Pinterest</a>
            </div>
          </div>`;

const replaceLinks1 = `<div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">ASSISTANCE</h4>
            <div className="flex flex-col items-center space-y-2 text-xs tracking-widest uppercase font-semibold text-vintage/70">
              <a href="/shipping-returns" className="hover:text-rose transition-colors">Shipping & Returns</a>
              <a href="/size-guide" className="hover:text-rose transition-colors">Size & Fit Guide</a>
              <a href="/faq" className="hover:text-rose transition-colors">FAQ</a>
            </div>
          </div>`;

const targetLinks2 = `<div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">ATELIER INQUIRIES</h4>
            <div className="flex flex-col items-center space-y-2 text-xs tracking-widest uppercase font-semibold text-vintage/70">
              <a href="mailto:contact@eliswa.com" className="hover:text-rose transition-colors">contact@eliswa.com</a>
              <p className="text-[9px] tracking-widest text-vintage/50 italic mt-1 font-serif">Response within 24 hours</p>
            </div>
          </div>`;

const replaceLinks2 = `<div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">CONNECT</h4>
            <div className="flex flex-col items-center space-y-2 text-xs tracking-widest uppercase font-semibold text-vintage/70">
              <a href="/contact" className="hover:text-rose transition-colors">Contact Us</a>
              <a href="https://www.instagram.com/eliswaindia" target="_blank" rel="noopener noreferrer" className="hover:text-rose transition-colors mt-2">Instagram</a>
            </div>
          </div>`;

content = content.replace(targetLinks1, replaceLinks1);
content = content.replace(targetLinks2, replaceLinks2);

fs.writeFileSync('src/components/Footer.tsx', content);
console.log("Footer.tsx updated");
