import { motion, useScroll } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartTotalCount, setIsCartOpen } = useCart();
  
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <>
      <motion.div 
        className={`fixed w-full z-50 transition-all duration-300 px-6 md:px-12 ${
          isScrolled 
            ? 'top-4 pointer-events-none' 
            : 'top-0 pointer-events-none'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className={`mx-auto pointer-events-auto transition-all duration-500 bg-cream/95 backdrop-blur-md border border-vintage/15 shadow-sm flex items-center justify-between ${
          isScrolled 
            ? 'max-w-6xl rounded-full py-2 px-6 shadow-lg' 
            : 'max-w-7xl rounded-sm py-2 px-4 md:px-8 border-t-0'
        }`}>
          
          {/* Left: Brand Branding in Logo Style */}
          <a href="#home" className="flex flex-col items-center justify-center select-none group/logo">
            <img 
              src="/Eliswa_logo.png" 
              alt="EW Logo" 
              className="h-16 md:h-20 transition-transform duration-300 group-hover/logo:scale-[1.02] object-contain"
            />
          </a>

          {/* Center: Symmetrical Editorial Desktop Menu */}
          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10 text-[10px] lg:text-[11px] tracking-[0.25em] uppercase font-semibold text-[#cf958f]">
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
            <a href="#contact" className="hover:text-[#a86058] transition-colors relative group py-1">
              Atelier Inquiries
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-[#cf958f]/60 transition-all group-hover:w-full"></span>
            </a>
          </div>

          {/* Right: Cart & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button 
              className="text-[#cf958f] relative hover:text-[#a86058] transition-all duration-300 p-2 border border-[#cf958f]/20 hover:border-[#cf958f]/50 rounded-full"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} className="stroke-[1.5]" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#cf958f] text-cream text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-cream">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-[#cf958f] p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <motion.div 
        className="fixed inset-0 z-40 bg-cream/98 flex flex-col items-center justify-center space-y-8 md:hidden p-8"
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="border border-[#cf958f]/20 p-8 w-full max-w-md h-full max-h-[80vh] flex flex-col items-center justify-center space-y-8 relative">
          <img 
            src="/Eliswa_logo.png" 
            alt="EW Logo" 
            className="absolute top-5 h-16 object-contain" 
          />
          
          <span className="text-[#cf958f]/40 text-2xl">❦</span>
          
          {[
            { label: 'The House', href: '#home' },
            { label: 'The Collection', href: '#collection' },
            { label: 'Our Story', href: '#about-us' },
            { label: 'Patrons', href: '#client-stories' },
            { label: 'Atelier Inquiries', href: '#contact' }
          ].map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-lg font-display uppercase tracking-widest text-[#cf958f] hover:text-[#a86058] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <span className="text-[#cf958f]/40 text-2xl">❦</span>
          
          <div className="text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-olive font-medium">KOCHI • CHENNAI • BOMBAY</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
