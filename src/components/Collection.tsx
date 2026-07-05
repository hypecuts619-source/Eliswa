import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Expand, ShoppingBag, Sparkles } from 'lucide-react';
import { SareeDetailModal } from './SareeDetailModal';
import { OnamSareeData } from '../types';
import { useCart } from '../context/CartContext';

export const ONAM_SAREES: OnamSareeData[] = [
  { id: 'traditional-kasavu', name: 'Traditional Kerala Kasavu', baseColor: '#FDFBF7', borderColor: '#D4AF37', accentColor: '#B8860B', pattern: 'plain', material: 'Cotton', occasion: 'Festive' },
  { id: 'silver-tissue', name: 'Silver Tissue Kasavu', baseColor: '#F5F5F5', borderColor: '#C0C0C0', accentColor: '#A9A9A9', pattern: 'plain', material: 'Tissue', occasion: 'Wedding' },
  { id: 'golden-tissue', name: 'Golden Tissue Kasavu', baseColor: '#F8F0E3', borderColor: '#E5C158', accentColor: '#DAA520', pattern: 'plain', material: 'Tissue', occasion: 'Wedding' },
  { id: 'rose-gold-tissue', name: 'Rose Gold Tissue', baseColor: '#FAF0E6', borderColor: '#B76E79', accentColor: '#C07C88', pattern: 'brocade', material: 'Tissue', occasion: 'Wedding' },
  { id: 'minimalist-tissue', name: 'Minimalist Tissue', baseColor: '#FDFDFD', borderColor: '#D4AF37', accentColor: '#F5DEB3', pattern: 'plain', material: 'Tissue', occasion: 'Casual' },
  { id: 'mural-painted', name: 'Mural Painted Kasavu', baseColor: '#FDFBF7', borderColor: '#D4AF37', accentColor: '#8B0000', pattern: 'mural', material: 'Silk', occasion: 'Festive' },
  { id: 'copper-tissue', name: 'Copper Tissue Kasavu', baseColor: '#FFF8DC', borderColor: '#B87333', accentColor: '#D2691E', pattern: 'plain', material: 'Tissue', occasion: 'Festive' },
  { id: 'peacock-silk', name: 'Peacock Motif Silk Kasavu', baseColor: '#FDFBF7', borderColor: '#D4AF37', accentColor: '#008080', pattern: 'brocade', material: 'Silk', occasion: 'Festive' },
  { id: 'temple-border', name: 'Temple Border Kasavu', baseColor: '#FDFBF7', borderColor: '#8B0000', accentColor: '#D4AF37', pattern: 'geometric', material: 'Cotton', occasion: 'Festive' },
  { id: 'green-border', name: 'Kasavu with Green Border', baseColor: '#FDFBF7', borderColor: '#2E8B57', accentColor: '#006400', pattern: 'plain', material: 'Cotton', occasion: 'Casual' },
  { id: 'red-border', name: 'Kasavu with Red Border', baseColor: '#FDFBF7', borderColor: '#8B0000', accentColor: '#A52A2A', pattern: 'plain', material: 'Cotton', occasion: 'Casual' },
  { id: 'checks-kasavu', name: 'Checkered Kasavu', baseColor: '#FDFBF7', borderColor: '#D4AF37', accentColor: '#B8860B', pattern: 'geometric', material: 'Cotton', occasion: 'Festive' }
];

function OnamSareeFabric2D({ saree }: { saree: OnamSareeData | undefined }) {
  if (!saree) return null;

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
        className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000" 
        style={{
          backgroundImage: saree.pattern === 'brocade'
            ? `radial-gradient(circle at 50% 50%, ${saree.borderColor} 2.5px, transparent 3.5px)`
            : saree.pattern === 'geometric'
            ? `repeating-linear-gradient(45deg, ${saree.accentColor} 0px, ${saree.accentColor} 1.5px, transparent 1.5px, transparent 12px)`
            : 'none',
          backgroundSize: '24px 24px'
        }} 
      />

      {/* Floating Shimmer Light effect simulating premium silk luster */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          repeat: Infinity,
          duration: 5,
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
        {/* Fine gold border carvings */}
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
      
      {/* Ornate Gold Pallu Border representing exquisite Kerala weave work */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 border-t-4 border-double flex flex-col justify-end items-center pb-8 px-12 transition-all duration-1000"
        style={{
          background: `linear-gradient(to top, ${saree.borderColor}, ${saree.accentColor})`,
          borderColor: `${saree.accentColor}dd`
        }}
      >
        <div className="w-full h-[1px] bg-white/30 mb-2" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-white font-semibold text-center select-none font-display">
          {saree.name}
        </span>
        <span className="text-[8px] tracking-[0.2em] uppercase text-white/80 mt-1 select-none font-body">
          ★ {saree.material} Masterwork • {saree.occasion} ★
        </span>
        <div className="w-full h-[1px] bg-white/30 mt-2" />
      </div>

      {/* Centered Golden Crest customized by saree style */}
      <div className="my-auto flex flex-col items-center gap-3 relative z-10 select-none">
        {saree.pattern === 'mural' ? (
          // Elegant Peacock Crest
          <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8C22 8 16 16 16 26C16 34 22 40 26 44L32 54L38 44C42 40 48 34 48 26C48 16 42 8 32 8Z" stroke={saree.borderColor} strokeWidth="1.5" />
            <circle cx="32" cy="24" r="8" stroke={saree.borderColor} strokeWidth="1" />
            <path d="M32 16V22" stroke={saree.accentColor} strokeWidth="1.5" />
            <path d="M28 24C28 24 30 26 32 26C34 26 36 24 36 24" stroke={saree.accentColor} strokeWidth="1" />
            <path d="M32 32C30 35 24 38 24 42" stroke={saree.borderColor} strokeWidth="1" />
            <path d="M32 32C34 35 40 38 40 42" stroke={saree.borderColor} strokeWidth="1" />
          </svg>
        ) : saree.pattern === 'geometric' ? (
          // Elegant Temple Shikhara/Dome Silhouette
          <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 6L16 24H48L32 6Z" stroke={saree.borderColor} strokeWidth="1.5" />
            <path d="M20 24V48H44V24" stroke={saree.borderColor} strokeWidth="1.5" />
            <path d="M32 24V48" stroke={saree.accentColor} strokeWidth="1" />
            <circle cx="32" cy="36" r="6" stroke={saree.borderColor} strokeWidth="1.5" />
            <path d="M28 48H36" stroke={saree.borderColor} strokeWidth="2" />
          </svg>
        ) : saree.pattern === 'brocade' ? (
          // Imperial Paisley/Kalka motif
          <svg className="w-20 h-20 drop-shadow-md" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 54C42.4934 54 51 45.4934 51 35C51 22.5 32 6 32 6C32 6 13 22.5 13 35C13 45.4934 21.5066 54 32 54Z" stroke={saree.borderColor} strokeWidth="1.5" />
            <path d="M32 16C36 24 44 32 40 42C36 48 28 48 24 42C20 32 28 24 32 16Z" stroke={saree.accentColor} strokeWidth="1" />
          </svg>
        ) : (
          // Classic Fleur-de-lis or Ornate Royal Star
          <span className="text-5xl drop-shadow-md" style={{ color: saree.borderColor }}>⚜</span>
        )}
        
        <span className="text-[9px] tracking-[0.40em] uppercase font-bold text-center" style={{ color: saree.borderColor }}>
          HERITAGE ARCHIVE
        </span>
      </div>
    </motion.div>
  );
}

export function Collection() {
  const { addToCart } = useCart();
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  useEffect(() => {
    const handleCustomFilter = (e: Event) => {
      const customEvent = e as CustomEvent<{ material?: string | null; occasion?: string | null }>;
      if (customEvent.detail) {
        if (customEvent.detail.material !== undefined) {
          setSelectedMaterial(customEvent.detail.material);
        }
        if (customEvent.detail.occasion !== undefined) {
          setSelectedOccasion(customEvent.detail.occasion);
        }
      }
    };
    window.addEventListener('filter-sarees', handleCustomFilter);
    return () => window.removeEventListener('filter-sarees', handleCustomFilter);
  }, []);

  const filteredSarees = useMemo(() => {
    return ONAM_SAREES.filter(saree => {
      const matchMaterial = selectedMaterial ? saree.material === selectedMaterial : true;
      const matchOccasion = selectedOccasion ? saree.occasion === selectedOccasion : true;
      return matchMaterial && matchOccasion;
    });
  }, [selectedMaterial, selectedOccasion]);

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Reset index when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedMaterial, selectedOccasion]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filteredSarees.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredSarees.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filteredSarees.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredSarees.length) % filteredSarees.length);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const safeIndex = currentIndex < filteredSarees.length ? currentIndex : 0;
  const currentSaree = filteredSarees[safeIndex];

  return (
    <section id="collection" className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
      
      {/* Sabyasachi-Style Symmetrical Section Divider */}
      <div className="flex flex-col items-center justify-center mb-16 text-center select-none">
        <span className="text-vintage/30 text-xl md:text-2xl mb-2">❦</span>
        <h2 className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-olive font-semibold">
          THE ARTISANAL CHRONICLES
        </h2>
        <div className="w-16 h-[1px] bg-vintage/20 mt-3"></div>
      </div>

      {/* Filter Bar - Classical Editorial Style */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-20 flex flex-col xl:flex-row justify-between items-center gap-6 border-b border-vintage/15 pb-8"
      >
        <div className="flex flex-col items-center xl:items-start">
          <h3 className="font-display text-xl md:text-2xl text-vintage tracking-wide uppercase font-semibold">CURATE THE ANTHOLOGY</h3>
          <span className="text-[10px] tracking-[0.2em] uppercase text-olive mt-1">SURELY PERSONALIZED FOR YOUR CONNOISSEURSHIP</span>
        </div>
        
        <div className="flex flex-wrap gap-8 items-center justify-center xl:justify-end text-[10px] tracking-[0.25em] uppercase font-semibold">
          {/* Material selection */}
          <div className="flex items-center gap-4">
            <span className="text-vintage/50 italic font-serif">by fabric:</span>
            <div className="flex gap-4">
              {['Cotton', 'Tissue', 'Silk'].map(material => (
                <button
                  key={material}
                  onClick={() => setSelectedMaterial(prev => prev === material ? null : material)}
                  className={`transition-all duration-300 pb-0.5 border-b ${
                    selectedMaterial === material 
                      ? 'border-vintage text-vintage' 
                      : 'border-transparent text-vintage/60 hover:text-vintage hover:border-vintage/40'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>
          
          <span className="hidden sm:inline text-vintage/20">|</span>
          
          {/* Occasion selection */}
          <div className="flex items-center gap-4">
            <span className="text-vintage/50 italic font-serif">by custom:</span>
            <div className="flex gap-4">
              {['Festive', 'Wedding', 'Casual'].map(occasion => (
                <button
                  key={occasion}
                  onClick={() => setSelectedOccasion(prev => prev === occasion ? null : occasion)}
                  className={`transition-all duration-300 pb-0.5 border-b ${
                    selectedOccasion === occasion 
                      ? 'border-vintage text-vintage' 
                      : 'border-transparent text-vintage/60 hover:text-vintage hover:border-vintage/40'
                  }`}
                >
                  {occasion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Editorial Narrative Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-2 md:order-1 md:col-span-5 flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="uppercase tracking-[0.2em] text-olive text-[10px] font-bold">Limited Handloom Edition</span>
            <div className="h-[1px] flex-1 bg-vintage/15"></div>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-8 text-vintage font-semibold leading-[1.15] tracking-wide">
            BESPOKE EDIT:<br/>THE ONAM SYMPHONY
          </h2>
          
          {/* Sabyasachi Editorial Description with Drop Cap */}
          <div className="text-vintage/85 font-light text-base md:text-lg leading-relaxed mb-10 space-y-6">
            <p className="relative pl-14 pt-1">
              <span className="absolute left-0 top-0 font-display text-5xl md:text-6xl text-vintage font-bold leading-none select-none border border-vintage/20 p-2 bg-cream/50 shadow-sm rounded-sm">
                A
              </span>
              cultural masterpiece, meticulously crafted on the ancient looms of Kerala. This hand-woven anthology is draped in organic handloom creams, shimmering kasavu weaves, and opulent metallic rose gold threads. 
            </p>
            <p className="italic text-vintage/70 text-sm font-display tracking-wider uppercase leading-relaxed pt-2 border-t border-vintage/10">
              ❦ EACH PIECE EXHUMES VINTAGE GRACE, WOVEN WITH DEVOTION AND CELEBRATING THE NOSTALGIC ROMANCE OF ROYAL KERALA.
            </p>
          </div>

          <div className="border-t border-vintage/10 pt-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-vintage/60">
              ORIGIN: TRIVANDRUM & BALARAMAPURAM COOPERATIVES
            </p>
          </div>
        </motion.div>
        
        {/* Right 3D Arched Canvas Lookbook Picture */}
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="order-1 md:order-2 md:col-span-7 cursor-pointer"
          onClick={handleOpenModal}
        >
          {/* The Arched frame container (rounded-t-full) */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream border-4 border-double border-vintage/30 p-2 shadow-2xl transition-all duration-700 hover:shadow-vintage/15 group rounded-t-full">
            <div className="w-full h-full border border-vintage/15 relative overflow-hidden rounded-t-full flex flex-col justify-between">
              
              {filteredSarees.length > 0 ? (
                <>
                  <motion.div className="absolute inset-0 z-0 h-[110%] -top-[5%] rounded-t-full transition-transform duration-[2s] ease-out group-hover:scale-110" style={{ y }}>
                    <AnimatePresence mode="wait">
                      <OnamSareeFabric2D key={currentSaree?.id} saree={currentSaree} />
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Fine lace/texture pattern overlay */}
                  <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none rounded-t-full" style={{ backgroundImage: 'radial-gradient(circle at center, #8B324D 1.2px, transparent 1.2px)', backgroundSize: '16px 16px' }}></div>
                  
                  <div className="absolute top-8 right-8 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-cream/90 backdrop-blur-md rounded-full p-2.5 text-vintage shadow-md border border-vintage/10">
                      <Expand size={18} className="stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-[85%] h-[85%] border border-vintage/20 rounded-t-full relative flex flex-col items-center justify-end p-8 pb-16">
                      <span className="font-display text-xl text-vintage/60 italic drop-shadow-md tracking-widest font-semibold uppercase">ARCHIVAL SERIES '26</span>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 z-20 pointer-events-none">
                    <button 
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full bg-cream/90 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white border border-vintage/20 transition-all duration-300 shadow-lg pointer-events-auto"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    <AnimatePresence mode="wait">
                      {currentSaree && (
                        <motion.div
                          key={currentSaree.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-cream/95 backdrop-blur-md px-5 py-1.5 rounded-full shadow-md border border-vintage/20 pointer-events-auto flex items-center"
                        >
                          <span className="text-[9px] tracking-[0.2em] text-vintage uppercase font-bold">
                            {currentSaree.name}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full bg-cream/90 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white border border-vintage/20 transition-all duration-300 shadow-lg pointer-events-auto"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-cream/50 rounded-t-full">
                  <span className="font-display tracking-[0.25em] text-vintage/60 uppercase text-xs mb-4">
                    NO ARCHIVE RECORD
                  </span>
                  <p className="text-vintage/80 font-light text-sm leading-relaxed max-w-xs">
                    Please refresh or adjust your curated fabric search to locate these rare hand-woven textiles.
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMaterial(null);
                      setSelectedOccasion(null);
                    }}
                    className="mt-8 px-8 py-2.5 border border-vintage/30 text-vintage hover:bg-vintage hover:text-white transition-all duration-300 tracking-widest uppercase text-[10px] font-bold"
                  >
                    Reset Curations
                  </button>
                </div>
              )}
              
            </div>
          </div>
        </motion.div>
      </div>

      {/* Editorial Catalog Grid Section */}
      <div className="mt-32 pt-20 border-t border-vintage/15">
        <div className="flex flex-col items-center justify-center text-center mb-16 select-none">
          <span className="text-vintage/30 text-xl md:text-2xl mb-2">⚜</span>
          <h2 className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-olive font-semibold">
            THE CATALOGUE OF MASTERWORKS
          </h2>
          <h3 className="font-display text-2xl md:text-3xl text-vintage mt-3 italic tracking-wide">
            Explore the Complete Handloom Anthology
          </h3>
          <p className="text-xs text-vintage/70 tracking-widest uppercase mt-2">
            SELECT A MASTERPIECE TO INSPECT TEXTURES OR SECURE A DRAPE
          </p>
          <div className="w-16 h-[1px] bg-vintage/20 mt-4"></div>
        </div>

        {filteredSarees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSarees.map((saree, index) => {
              const price = {
                'traditional-kasavu': '₹18,500',
                'silver-tissue': '₹34,000',
                'golden-tissue': '₹36,500',
                'rose-gold-tissue': '₹39,000',
                'minimalist-tissue': '₹22,000',
                'mural-painted': '₹48,500',
                'copper-tissue': '₹35,000',
                'peacock-silk': '₹45,000',
                'temple-border': '₹21,000',
                'green-border': '₹16,500',
                'red-border': '₹16,500',
                'checks-kasavu': '₹19,500'
              }[saree.id] || '₹18,500';

              const spec = {
                'Cotton': 'Pure Kerala Cotton',
                'Tissue': 'Metallic Tissue Weave',
                'Silk': 'Fine Mulberry Silk'
              }[saree.material];

              return (
                <motion.div 
                  key={saree.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-cream/40 border border-vintage/15 p-2 rounded-sm relative flex flex-col justify-between group shadow-sm transition-all duration-500 hover:shadow-lg hover:border-vintage/30"
                >
                  <div className="border border-vintage/10 p-4 flex flex-col justify-between h-full">
                    {/* Small Mini-Fabric Swatch */}
                    <div 
                      onClick={() => {
                        const idx = ONAM_SAREES.findIndex(s => s.id === saree.id);
                        if (idx !== -1) {
                          setCurrentIndex(idx);
                          setIsModalOpen(true);
                        }
                      }}
                      className="aspect-[4/3] w-full relative overflow-hidden rounded-t-sm border border-vintage/15 cursor-pointer p-1 group/fabric"
                    >
                      <div 
                        className="w-full h-full relative transition-transform duration-[1.5s] ease-out group-hover/fabric:scale-125 flex items-center justify-center overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${saree.baseColor} 0%, #FAF6EB 100%)`
                        }}
                      >
                        {/* Swatch Border Lines */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 border-r border-vintage/10" style={{ background: `linear-gradient(to right, ${saree.borderColor}, ${saree.accentColor})` }} />
                        <div className="absolute right-0 top-0 bottom-0 w-3 border-l border-vintage/10" style={{ background: `linear-gradient(to left, ${saree.borderColor}, ${saree.accentColor})` }} />
                        <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-vintage/15" style={{ background: `linear-gradient(to top, ${saree.borderColor}, ${saree.accentColor})` }} />
                        
                        {/* Swatch Pattern */}
                        <div 
                          className="absolute inset-0 opacity-15 pointer-events-none" 
                          style={{
                            backgroundImage: saree.pattern === 'brocade'
                              ? `radial-gradient(circle at 50% 50%, ${saree.borderColor} 2px, transparent 3px)`
                              : saree.pattern === 'geometric'
                              ? `repeating-linear-gradient(45deg, ${saree.accentColor} 0px, ${saree.accentColor} 1px, transparent 1px, transparent 8px)`
                              : 'none',
                            backgroundSize: '16px 16px'
                          }} 
                        />
                        
                        <span className="text-xl opacity-35 z-10" style={{ color: saree.borderColor }}>⚜</span>
                      </div>
                      
                      {/* Zoom Indicator */}
                      <div className="absolute inset-0 bg-vintage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="bg-cream/90 backdrop-blur-sm border border-vintage/20 text-vintage text-[8px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <Expand size={10} /> EXAMINE
                        </span>
                      </div>
                    </div>

                    {/* Saree Info */}
                    <div className="mt-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <h4 className="font-display font-semibold text-xs tracking-wider text-vintage uppercase line-clamp-1">
                            {saree.name}
                          </h4>
                        </div>
                        <p className="text-[9px] tracking-[0.15em] uppercase text-olive font-bold mb-3">
                          {spec} • {saree.occasion}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-vintage/10 flex justify-between items-center mt-auto">
                        <span className="text-[10px] tracking-wider text-vintage/60 font-body uppercase">Value</span>
                        <span className="font-display text-sm text-vintage font-bold">{price}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-vintage/10">
                      <button
                        onClick={() => {
                          const idx = ONAM_SAREES.findIndex(s => s.id === saree.id);
                          if (idx !== -1) {
                            setCurrentIndex(idx);
                            setIsModalOpen(true);
                          }
                        }}
                        className="px-2 py-2 border border-vintage/20 text-vintage hover:bg-vintage hover:text-white transition-all duration-300 tracking-widest uppercase text-[8px] font-bold text-center bg-cream/10"
                      >
                        CLOSE-UP
                      </button>
                      <button
                        onClick={() => addToCart(saree)}
                        className="px-2 py-2 bg-vintage text-white hover:bg-vintage/90 transition-all duration-300 tracking-widest uppercase text-[8px] font-bold flex items-center justify-center gap-1 shadow-sm"
                      >
                        <ShoppingBag size={10} />
                        ADD BAG
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-vintage/20 bg-cream/20">
            <p className="text-sm text-vintage/70 italic font-display">No masterpieces found matching the current selections.</p>
            <button
              onClick={() => {
                setSelectedMaterial(null);
                setSelectedOccasion(null);
              }}
              className="mt-6 px-8 py-2.5 border border-vintage/30 text-vintage hover:bg-vintage hover:text-white transition-all duration-300 tracking-widest uppercase text-[10px] font-bold"
            >
              Reset Curations
            </button>
          </div>
        )}
      </div>

      {currentSaree && (
        <SareeDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          saree={currentSaree} 
          fabricComponent={<OnamSareeFabric2D saree={currentSaree} />} 
        />
      )}
    </section>
  );
}
