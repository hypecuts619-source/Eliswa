import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function WhatsAppButton() {
  return (
    <motion.a 
      href="https://wa.me/919747771665?text=Hello%20Eliswa,%20I%20am%20interested%20in%20your%20bespoke%20collections." 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-vintage text-white p-4 rounded-full shadow-xl shadow-vintage/20 flex items-center justify-center group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-white text-vintage px-4 py-2 rounded shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Chat with us
      </div>
      
      <MessageCircle size={28} />
    </motion.a>
  );
}
