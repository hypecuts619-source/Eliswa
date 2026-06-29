import { motion } from 'motion/react';

export function Hero() {
  return (
    <header id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-pearl/30">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          src="https://opal.google/board/blobs/7cfc0970-2c05-42de-90a6-2a90c4f38b3c"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-90"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/20 to-cream/80"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none mt-20">
        <motion.h1 
          className="font-display text-5xl md:text-7xl lg:text-8xl text-vintage leading-tight mb-6 drop-shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        >
          Elegance That Defies<br />The Ordinary.
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-3xl text-vintage font-display italic tracking-widest mb-10 drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        >
          You are rare.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="pointer-events-auto"
        >
          <a 
            href="#collection"
            className="inline-block px-10 py-4 border-2 border-vintage text-vintage hover:bg-vintage hover:text-white transition-all duration-500 font-medium tracking-widest uppercase text-sm"
          >
            Discover More
          </a>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest text-vintage/60 mb-2">Scroll</span>
        <motion.div 
          className="w-[1px] h-12 bg-gradient-to-b from-vintage to-transparent"
          animate={{ height: ['0px', '48px', '0px'], y: [0, 24, 48] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </header>
  );
}
