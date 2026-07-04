import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-vintage/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-cream border border-vintage/15 shadow-xl z-50 flex flex-col max-h-[80vh]"
          >
            <div className="p-4 border-b border-vintage/15 flex justify-between items-center bg-cream/90 sticky top-0">
              <h2 className="text-sm font-display tracking-[0.2em] text-vintage uppercase font-bold">{title}</h2>
              <button 
                onClick={onClose}
                className="text-vintage/60 hover:text-vintage transition-colors p-2"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs text-vintage/80 font-light leading-relaxed prose prose-sm max-w-none">
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
