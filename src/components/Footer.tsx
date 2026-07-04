export function Footer() {
  return (
    <footer id="contact" className="relative pt-32 pb-16 px-6 md:px-20 border-t border-vintage/15 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Symmetrical Footer Header in Logo Style */}
        <div className="flex flex-col items-center justify-center text-vintage select-none text-center mb-16">
          <img 
            src="/Eliswa_India.png" 
            alt="Eliswa India" 
            className="h-40 md:h-56 object-contain -mt-4 mix-blend-multiply"
          />
          <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-olive font-medium mt-2">
            You are rare
          </span>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl text-center mb-16">
          
          <div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">THE HOUSE</h4>
            <p className="text-vintage/80 font-light text-xs max-w-xs leading-relaxed font-display italic">
              A private preserve of Indian handloom heritage and slow-fashioned legacy.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">CONNECT</h4>
            <div className="flex flex-col items-center space-y-2 text-xs tracking-widest uppercase font-semibold text-vintage/70">
              <a href="https://www.instagram.com/eliswaindia" target="_blank" rel="noopener noreferrer" className="hover:text-rose transition-colors">Instagram</a>
              <a href="#" className="hover:text-rose transition-colors">Facebook</a>
              <a href="#" className="hover:text-rose transition-colors">Pinterest</a>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">ATELIER INQUIRIES</h4>
            <div className="flex flex-col items-center space-y-2 text-xs tracking-widest uppercase font-semibold text-vintage/70">
              <a href="mailto:contact@eliswa.com" className="hover:text-rose transition-colors">contact@eliswa.com</a>
              <p className="text-[9px] tracking-widest text-vintage/50 italic mt-1 font-serif">Response within 24 hours</p>
            </div>
          </div>
          
        </div>
        
        {/* Double-bordered Copyright block */}
        <div className="w-full max-w-4xl pt-8 border-t border-vintage/10 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase font-semibold text-vintage/50">
          <p>&copy; {new Date().getFullYear()} ELISWA. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-vintage transition-colors">Privacy Policy</a>
            <span className="text-vintage/20">•</span>
            <a href="#" className="hover:text-vintage transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
