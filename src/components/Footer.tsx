export function Footer() {
  return (
    <footer id="contact" className="bg-cream pt-24 pb-12 px-6 md:px-20 border-t border-vintage/10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 mb-16">
        
        <div className="col-span-1">
          <div className="flex flex-col items-center justify-center text-vintage select-none mb-6 self-start w-fit">
            <div className="font-logo-ew text-5xl leading-none flex items-center mb-1">
              <span className="font-normal tracking-tighter">EW</span>
            </div>
            <span className="font-logo-text text-2xl tracking-[0.15em] leading-none ml-1 font-normal">Eliswa</span>
          </div>
          <p className="text-vintage font-display italic text-lg mb-4 tracking-widest">You are rare.</p>
          <p className="text-vintage/70 font-light leading-relaxed mb-6">
            A sanctuary of artisanal luxury—a tribute to classical femininity softly reimagined for the modern world.
          </p>
        </div>
        
        <div className="col-span-1">
          <h4 className="text-vintage uppercase tracking-widest text-sm font-medium mb-6">Connect</h4>
          <ul className="space-y-4 text-vintage/70 font-light">
            <li>
              <a href="https://www.instagram.com/eliswaindia" target="_blank" rel="noopener noreferrer" className="hover:text-rose transition-colors">Instagram</a>
            </li>
            <li>
              <a href="#" className="hover:text-rose transition-colors">Facebook</a>
            </li>
            <li>
              <a href="#" className="hover:text-rose transition-colors">Pinterest</a>
            </li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h4 className="text-vintage uppercase tracking-widest text-sm font-medium mb-6">Inquiries</h4>
          <ul className="space-y-4 text-vintage/70 font-light">
            <li>
              <a href="mailto:contact@eliswa.com" className="hover:text-rose transition-colors">contact@eliswa.com</a>
            </li>
            <li>
              <a href="https://wa.me/919747771665" className="hover:text-rose transition-colors">+91 97477 71665</a>
            </li>
          </ul>
        </div>
        
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-vintage/20 text-vintage/50 text-sm font-light">
        <p>&copy; {new Date().getFullYear()} Eliswa Bespoke. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-vintage transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-vintage transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
