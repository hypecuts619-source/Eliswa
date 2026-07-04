import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

interface SareeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  saree: any;
  fabricComponent: React.ReactNode;
}

export function SareeDetailModal({ isOpen, onClose, saree, fabricComponent }: SareeDetailModalProps) {
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!saree) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
          <div className="absolute inset-0 bg-cream/90 backdrop-blur-md" onClick={onClose} />
          
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-5xl bg-cream border-4 border-double border-vintage/30 p-2 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[70vh] rounded-sm"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-cream/90 backdrop-blur-sm flex items-center justify-center text-vintage hover:bg-vintage hover:text-white border border-vintage/15 transition-all duration-300 shadow-md"
            >
              <X size={18} className="stroke-[1.5]" />
            </button>

            {/* Image / Fabric Preview Section with Fine Frame */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-cream relative border-b md:border-b-0 md:border-r border-vintage/15 p-4 flex flex-col justify-between">
              <div className="w-full h-full border border-vintage/10 rounded-t-full relative overflow-hidden group/modal-image">
                <div className="w-full h-full transform transition-transform duration-[1.5s] ease-out group-hover/modal-image:scale-110">
                  {fabricComponent}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 text-[9px] font-display tracking-[0.2em] text-vintage/45 uppercase font-bold">
                ❦ ARCHIVAL WEAVE EXHIBIT
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center bg-cream overflow-y-auto">
              <span className="font-display tracking-[0.25em] text-olive uppercase text-[10px] font-bold mb-2 block">
                Atelier Registry • Lookbook
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-vintage mb-6 font-semibold tracking-wide">
                {saree.name}
              </h2>
              
              <div className="space-y-6 text-vintage/85 font-light text-sm md:text-base leading-relaxed">
                <p className="italic">
                  A peerless masterpiece of pure handloom craftsmanship, this {saree.name.toLowerCase()} features an intimate interplay of luxurious heritage tones, finished with magnificent, custom-embroidered gold borders. Custom-crafted for your most celebrated occasions.
                </p>
                
                <div className="pt-6 border-t border-vintage/15 grid grid-cols-2 gap-y-4 text-xs">
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-vintage/50 mb-1">Fabric Spec</span>
                    <span className="font-medium text-vintage">Pure Tissue Kasavu</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-vintage/50 mb-1">Pattern Guild</span>
                    <span className="font-medium text-vintage capitalize">{saree.pattern} Design</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-vintage/50 mb-1">Weave Origin</span>
                    <span className="font-medium text-vintage font-serif italic">Balaramapuram, IN</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-vintage/50 mb-1">Care & Hold</span>
                    <span className="font-medium text-vintage">Dry Clean / Vault Storage</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-vintage/15">
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-vintage/50 mb-1">Estimated Value</span>
                  <span className="font-display text-2xl text-vintage font-bold">₹18,500 <span className="text-xs text-vintage/50 italic font-serif">onward valuation</span></span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart(saree)}
                  className="flex-1 px-6 py-3.5 bg-vintage text-white hover:bg-vintage/90 transition-all duration-300 tracking-[0.2em] uppercase text-[10px] font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag size={14} className="stroke-[1.5]" />
                  ADD TO SELECTION
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 border border-vintage/30 text-vintage hover:bg-vintage hover:text-white transition-all duration-300 tracking-[0.2em] uppercase text-[10px] font-bold text-center bg-cream/20"
                >
                  CLOSE VIEW
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
