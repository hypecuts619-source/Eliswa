import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SareeData {
  id: string;
  name: string;
  baseColor: string;
  borderColor: string;
  accentColor: string;
  pattern: 'plain' | 'brocade' | 'geometric';
}

const SAREES: SareeData[] = [
  { id: 'kasavu', name: 'Kerala Kasavu', baseColor: '#F8F6F0', borderColor: '#C5A059', accentColor: '#B38B3A', pattern: 'plain' },
  { id: 'kanjeevaram', name: 'Kanjeevaram Silk', baseColor: '#8B0000', borderColor: '#D4AF37', accentColor: '#AA8822', pattern: 'plain' },
  { id: 'banarasi', name: 'Banarasi Brocade', baseColor: '#800080', borderColor: '#DAA520', accentColor: '#B8860B', pattern: 'brocade' },
  { id: 'chanderi', name: 'Chanderi', baseColor: '#98FF98', borderColor: '#C0C0C0', accentColor: '#A9A9A9', pattern: 'plain' },
  { id: 'patola', name: 'Patola', baseColor: '#E34234', borderColor: '#2E8B57', accentColor: '#FFD700', pattern: 'geometric' },
  { id: 'mysore', name: 'Mysore Silk', baseColor: '#D2B48C', borderColor: '#FF4500', accentColor: '#FFD700', pattern: 'plain' },
  { id: 'paithani', name: 'Paithani', baseColor: '#FF00FF', borderColor: '#00FA9A', accentColor: '#FFD700', pattern: 'geometric' },
  { id: 'baluchari', name: 'Baluchari', baseColor: '#000080', borderColor: '#CD5C5C', accentColor: '#FFD700', pattern: 'brocade' }
];

function SareeFabric2D({ saree }: { saree: SareeData }) {
  // Staggered gold-threaded floral buttas scattered elegantly on the fabric weave
  const buttaPositions = [
    { top: '15%', left: '25%' },
    { top: '20%', left: '70%' },
    { top: '40%', left: '20%' },
    { top: '45%', left: '80%' },
    { top: '60%', left: '30%' },
    { top: '65%', left: '70%' },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col justify-between p-8 overflow-hidden rounded-t-full transition-colors duration-1000"
      style={{
        background: `linear-gradient(135deg, ${saree.baseColor} 0%, #FAF6EB 100%)`,
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8 }}
    >
      {/* Linen texture overlay simulating fine woven cloth threads */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/5 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{
        backgroundImage: 'radial-gradient(#4A1521 1px, transparent 1px)',
        backgroundSize: '8px 8px'
      }} />

      {/* Repeating fine pattern base */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-1000" 
        style={{
          backgroundImage: saree.pattern === 'brocade' 
            ? `radial-gradient(circle at 50% 50%, ${saree.borderColor} 2.5px, transparent 3.5px)` 
            : saree.pattern === 'geometric'
            ? `repeating-linear-gradient(45deg, ${saree.accentColor} 0px, ${saree.accentColor} 1.5px, transparent 1.5px, transparent 12px)`
            : 'none',
          backgroundSize: '24px 24px'
        }} 
      />

      {/* Floating Shimmer Reflection */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
          repeatDelay: 1
        }}
      />

      {/* Handloom Gold-threaded Florals (Buttas) */}
      {buttaPositions.map((pos, index) => (
        <div 
          key={index} 
          className="absolute text-[12px] opacity-65 pointer-events-none select-none"
          style={{ top: pos.top, left: pos.left, color: saree.borderColor }}
        >
          ✿
        </div>
      ))}

      {/* Symmetrical luxury side borders (Zari / Kasavu laces) */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-8 md:w-12 border-r border-double transition-all duration-1000 flex flex-col justify-around py-12 items-center"
        style={{
          background: `linear-gradient(to right, ${saree.borderColor}, ${saree.accentColor})`,
          borderColor: `${saree.accentColor}50`
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-[7px] text-white/55 font-serif">♦</span>
        ))}
      </div>
      <div 
        className="absolute right-0 top-0 bottom-0 w-8 md:w-12 border-l border-double transition-all duration-1000 flex flex-col justify-around py-12 items-center"
        style={{
          background: `linear-gradient(to left, ${saree.borderColor}, ${saree.accentColor})`,
          borderColor: `${saree.accentColor}50`
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-[7px] text-white/55 font-serif">♦</span>
        ))}
      </div>

      {/* Double Gold Pallu Border representing exquisite Kasavu weave */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-36 border-t-2 border-double flex flex-col justify-end items-center pb-6 px-12 transition-all duration-1000"
        style={{
          background: `linear-gradient(to top, ${saree.borderColor}, ${saree.accentColor})`,
          borderColor: `${saree.accentColor}80`
        }}
      >
        {/* Intricate golden border work details inside the Pallu */}
        <div className="w-full h-[1px] bg-white/20 mb-1" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-white font-semibold text-center select-none font-display">
          {saree.name} • Royal Archive Weave
        </span>
        <div className="w-full h-[1px] bg-white/20 mt-1" />
      </div>

      {/* Centered Crest customized by pattern */}
      <div className="my-auto flex flex-col items-center gap-3 relative z-10 select-none animate-pulse">
        {saree.pattern === 'brocade' ? (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 54C42.4934 54 51 45.4934 51 35C51 22.5 32 6 32 6C32 6 13 22.5 13 35C13 45.4934 21.5066 54 32 54Z" stroke={saree.borderColor} strokeWidth="1.5" />
            <path d="M32 16C36 24 44 32 40 42C36 48 28 48 24 42C20 32 28 24 32 16Z" stroke={saree.accentColor} strokeWidth="1" />
          </svg>
        ) : saree.pattern === 'geometric' ? (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 6L16 24H48L32 6Z" stroke={saree.borderColor} strokeWidth="1.5" />
            <path d="M20 24V48H44V24" stroke={saree.borderColor} strokeWidth="1.5" />
            <circle cx="32" cy="36" r="6" stroke={saree.borderColor} strokeWidth="1.5" />
          </svg>
        ) : (
          <span className="text-vintage/25 text-5xl leading-none" style={{ color: saree.borderColor }}>⚜</span>
        )}
        
        <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-center" style={{ color: saree.borderColor }}>
          Handcrafted Splendor
        </span>
      </div>
    </motion.div>
  );
}

export function About() {
  const [currentSareeIndex, setCurrentSareeIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const handleNext = () => {
    setCurrentSareeIndex((prev) => (prev + 1) % SAREES.length);
  };

  const handlePrev = () => {
    setCurrentSareeIndex((prev) => (prev - 1 + SAREES.length) % SAREES.length);
  };

  const currentSaree = SAREES[currentSareeIndex];

  return (
    <section id="about-us" className="py-32 bg-cream/20 relative overflow-hidden">
      
      {/* Sabyasachi-Style Symmetrical Section Divider */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center mb-16 text-center select-none"
      >
        <span className="text-vintage/30 text-xl md:text-2xl mb-2">❦</span>
        <h2 className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-olive font-semibold">
          THE HOUSE OF ELISWA
        </h2>
        <div className="w-16 h-[1px] bg-vintage/20 mt-3"></div>
      </motion.div>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cream rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Column: Arched Saree Fabric Canvas with Double Border */}
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Sabyasachi Archway double-bordered layout */}
          <div className="h-[600px] w-full bg-cream border-4 border-double border-vintage/30 p-2 shadow-2xl flex items-center justify-center relative overflow-hidden group rounded-t-full">
            <div className="w-full h-full border border-vintage/15 relative overflow-hidden rounded-t-full">
              
              <motion.div className="absolute inset-0 z-0 h-[110%] -top-[5%] rounded-t-full" style={{ y }}>
                <AnimatePresence mode="wait">
                  <SareeFabric2D key={currentSaree.id} saree={currentSaree} />
                </AnimatePresence>
              </motion.div>
              
              {/* Elegant overlay elements simulating texture */}
              <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none rounded-t-full" style={{ backgroundImage: 'radial-gradient(circle at center, #8B324D 1.2px, transparent 1.2px)', backgroundSize: '16px 16px' }}></div>
              
              {/* Carousel Controls */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 z-20 pointer-events-none">
                <button 
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-cream/90 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white border border-vintage/20 transition-all duration-300 shadow-md pointer-events-auto"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSaree.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-cream/95 backdrop-blur-md px-5 py-1.5 rounded-full shadow-md border border-vintage/20 pointer-events-auto"
                  >
                    <span className="text-[10px] tracking-[0.2em] text-vintage uppercase font-bold">
                      {currentSaree.name}
                    </span>
                  </motion.div>
                </AnimatePresence>

                <button 
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-cream/90 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white border border-vintage/20 transition-all duration-300 shadow-md pointer-events-auto"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
            </div>
          </div>
          
          {/* Decorative accents */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-vintage/20 pointer-events-none"></div>
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-vintage/20 pointer-events-none"></div>
        </motion.div>

        {/* Right Column: Editorial brand narrative */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="pr-4"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="uppercase tracking-[0.25em] text-olive text-[10px] font-bold">THE FOUNDATION & THE MUSE</span>
            <div className="h-[1px] flex-1 bg-vintage/15"></div>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-10 text-vintage font-semibold leading-[1.15] tracking-wide">
            CRAFTING HERITAGE:<br/>ELISWA INDIA
          </h2>
          
          <div className="text-vintage/85 space-y-6 text-base leading-relaxed font-light">
            <p className="relative pl-14 pt-1">
              <span className="absolute left-0 top-0 font-display text-5xl md:text-6xl text-vintage font-bold leading-none select-none border border-vintage/20 p-2 bg-cream/50 shadow-sm rounded-sm">
                B
              </span>
              orn from the visionary eye of lead designer Aashitha Wilson, Eliswa is a sanctuary of Indian luxury. Eliswa India is a passionate tribute to classical femininity, softly reinterpreted with a slow, cinematic elegance for the modern world.
            </p>
            <p>
              Every bespoke garment is a profound tactile experience, defined by masterfully draped structures, elevated Zardozi borders, and the delicate precision of fine spun copper and gold threads. We weave oral histories into cloth, creating true wearable poetry.
            </p>
            <p className="italic text-vintage/70 text-sm font-display tracking-wider uppercase pt-4 border-t border-vintage/10">
              ❦ Bathed in an inviting, luminous palette of soft golden creams, mossy olive greens, and metallic rose gold, an Eliswa weave is not merely worn; it is a legacy. It is an embrace of ancient handlooms, custom-designed for the contemporary muse.
            </p>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
