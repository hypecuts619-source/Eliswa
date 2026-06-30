import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

interface SareeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  saree: any;
  fabricComponent: React.ReactNode;
}

export function SareeDetailModal({ isOpen, onClose, saree, fabricComponent }: SareeDetailModalProps) {
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
            className="relative w-full max-w-5xl bg-white border border-vintage/20 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[70vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image / 3D Preview Section */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-cream relative cursor-grab active:cursor-grabbing">
              <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 8]} intensity={1.2} color="#FFFFFF" />
                <directionalLight position={[-5, -10, -5]} intensity={0.5} color="#8B324D" />
                <Environment preset="city" />
                <PresentationControls 
                  global 
                  snap={true} 
                  rotation={[0, 0, 0]} 
                  polar={[-Math.PI / 6, Math.PI / 6]} 
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                  {fabricComponent}
                </PresentationControls>
              </Canvas>
              <div className="absolute bottom-4 left-4 text-xs font-display tracking-widest text-vintage/50 uppercase">
                Interactive Preview
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
              <span className="font-display tracking-wider text-rose uppercase text-xs mb-2">
                Bespoke Collection
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-vintage mb-6">
                {saree.name}
              </h2>
              
              <div className="space-y-6 text-vintage/80 font-light text-sm md:text-base leading-relaxed">
                <p>
                  A masterpiece of artisanal craftsmanship, this {saree.name.toLowerCase()} features a delicate interplay of soft, luxurious base tones and striking border accents. Carefully woven to reflect the modern romance of traditional elegance.
                </p>
                
                <div className="pt-6 border-t border-vintage/10 grid grid-cols-2 gap-y-4">
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-vintage/50 mb-1">Fabric</span>
                    <span className="font-medium text-vintage">Pure Tissue Kasavu</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-vintage/50 mb-1">Pattern</span>
                    <span className="font-medium text-vintage capitalize">{saree.pattern} Design</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-vintage/50 mb-1">Origin</span>
                    <span className="font-medium text-vintage">Handloom Kerala</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-vintage/50 mb-1">Care</span>
                    <span className="font-medium text-vintage">Dry Clean Only</span>
                  </div>
                </div>

                <div className="pt-6 mt-6">
                  <span className="block text-xs uppercase tracking-widest text-vintage/50 mb-1">Estimated Price</span>
                  <span className="font-display text-2xl text-vintage">₹18,500 <span className="text-sm text-vintage/50 italic font-body">onwards</span></span>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-vintage text-vintage hover:bg-vintage hover:text-white transition-all duration-300 tracking-widest uppercase text-xs font-medium text-center"
                >
                  Close View
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
