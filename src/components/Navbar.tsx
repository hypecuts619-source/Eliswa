import { motion, useScroll, useTransform } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <>
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-500 border-b px-6 py-4 flex justify-between items-center ${isScrolled ? 'bg-cream/70 backdrop-blur-md border-vintage/20 shadow-sm' : 'bg-transparent border-transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="flex items-center">
          <img src="https://opal.google/board/blobs/af18cf5c-4cfe-4dc8-ab23-d3e2806324ba" alt="Eliswa Logo" className="h-12 w-auto object-contain" />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm tracking-widest text-vintage font-display font-medium">
          {['Home', 'Collection', 'About Us', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`} 
              className="hover:text-rose transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-vintage"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div 
        className="fixed inset-0 z-40 bg-cream/95 backdrop-blur-md flex flex-col items-center justify-center space-y-8 md:hidden"
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.3 }}
      >
        {['Home', 'Collection', 'About Us', 'Contact'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase().replace(' ', '-')}`} 
            className="text-2xl font-display text-vintage hover:text-rose transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {item}
          </a>
        ))}
      </motion.div>
    </>
  );
}
