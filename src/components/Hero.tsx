import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Compass, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroChapter {
  id: string;
  chapterNumber: string;
  title: string;
  tagline: string;
  poeticCopy: string;
  imageUrl: string;
  crest: string;
  accent: string;
  vintageFact: string;
}

const HERO_CHAPTERS: HeroChapter[] = [
  {
    id: 'kerala',
    chapterNumber: 'Chapter I',
    title: 'Kerala Traditional Saree',
    tagline: 'Pure ivory and gold Kasavu weaving',
    poeticCopy: 'Traditional handloom of Kerala, spun from fine cotton with pure golden zari borders.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600',
    crest: '⚜',
    accent: 'Kerala Kasavu Saree',
    vintageFact: 'Traditional Ivory & Gold'
  },
  {
    id: 'kanchepuram',
    chapterNumber: 'Chapter II',
    title: 'Kanchepuram Silk Saree',
    tagline: 'Royal silk threads of South Indian heritage',
    poeticCopy: 'A magnificent Kanjivaram double-warp silk masterpiece cast with lustrous temple borders.',
    imageUrl: '/kanchepuram_saree.png',
    crest: '✿',
    accent: 'Kanchepuram Silk Saree',
    vintageFact: 'Double-Woven Silk'
  },
  {
    id: 'banaras',
    chapterNumber: 'Chapter III',
    title: 'Banaras Silk Saree',
    tagline: 'Opulent gold brocades from holy banks',
    poeticCopy: 'A breath-taking heritage red Banarasi silk woven with intricate floral jaal zari patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1600',
    crest: '❦',
    accent: 'Banaras Silk Saree',
    vintageFact: 'Fine Zari Brocade'
  }
];

const CRAFT_CATEGORIES = [
  {
    name: 'Kasavu Cotton',
    desc: 'Traditional Ivory',
    material: 'Cotton',
    occasion: null,
    baseColor: '#FDFBF7',
    borderColor: '#D4AF37',
    accentColor: '#B8860B',
    crest: '⚜'
  },
  {
    name: 'Metallic Tissue',
    desc: 'Liquid Gold Weave',
    material: 'Tissue',
    occasion: null,
    baseColor: '#F8F0E3',
    borderColor: '#E5C158',
    accentColor: '#DAA520',
    crest: '✧'
  },
  {
    name: 'Mulberry Silk',
    desc: 'Fine Royal Brocade',
    material: 'Silk',
    occasion: null,
    baseColor: '#FDFBF7',
    borderColor: '#D4AF37',
    accentColor: '#008080',
    crest: '✿'
  },
  {
    name: 'Bridal drapes',
    desc: 'Sacred Wedding Weaves',
    material: null,
    occasion: 'Wedding',
    baseColor: '#FAF0E6',
    borderColor: '#B76E79',
    accentColor: '#C07C88',
    crest: '❦'
  },
  {
    name: 'Festive Wear',
    desc: 'Celebratory Classics',
    material: null,
    occasion: 'Festive',
    baseColor: '#FDFBF7',
    borderColor: '#8B0000',
    accentColor: '#D4AF37',
    crest: '✦'
  }
];

export function Hero() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Auto-slide effect every 8.5 seconds unless manually controlled
  useEffect(() => {
    if (isManual) return;
    const interval = setInterval(() => {
      setCurrentChapter((prev) => (prev + 1) % HERO_CHAPTERS.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [isManual]);

  const handleNext = () => {
    setIsManual(true);
    setCurrentChapter((prev) => (prev + 1) % HERO_CHAPTERS.length);
  };

  const handlePrev = () => {
    setIsManual(true);
    setCurrentChapter((prev) => (prev - 1 + HERO_CHAPTERS.length) % HERO_CHAPTERS.length);
  };

  const handleChapterSelect = (index: number) => {
    setIsManual(true);
    setCurrentChapter(index);
  };

  const active = HERO_CHAPTERS[currentChapter];

  const showWeaveAndCraft = false; // Set to true to unhide the 'Shop by Weave & Craft' section later

  const handleCategoryClick = (category: typeof CRAFT_CATEGORIES[0]) => {
    // Dispatch custom event to Collection component
    const filterEvent = new CustomEvent('filter-sarees', {
      detail: {
        material: category.material,
        occasion: category.occasion
      }
    });
    window.dispatchEvent(filterEvent);

    // Smoothly scroll to the collection section
    const collectionSection = document.getElementById('collection');
    if (collectionSection) {
      collectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header id="home" className="relative w-full bg-transparent flex flex-col z-10 pt-0">
      
      {/* SECTION 1: FULL-SIZE CAMPAIGN HERO BANNER */}
      <div 
        ref={containerRef}
        onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
        className="relative w-full h-[60vh] sm:h-[72vh] md:h-[80vh] lg:h-[84vh] border-b border-vintage/15 overflow-hidden bg-vintage/5 cursor-pointer group"
      >
        
        {/* Large Campaign Slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <motion.img 
              src={active.imageUrl}
              alt={active.title}
              style={{ y }}
              className="w-full h-[130%] absolute -top-[15%] object-cover brightness-[0.93] contrast-[1.02] group-hover:scale-105 transition-transform duration-10000 ease-out"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic subtle gradients & framing lines (very light and non-intrusive) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-10" />
        <div className="absolute inset-4 sm:inset-6 border border-white/10 pointer-events-none rounded-xs z-10 transition-all duration-300 group-hover:border-white/20" />

        {/* Minimal indicator at the bottom to show the name of the Saree Type being showcased */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.p
              key={`name-${active.id}`}
              className="text-white text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase drop-shadow-md"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
            >
              {active.title}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Elegant Slider Arrow Controls */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/15 hover:bg-white hover:text-vintage hover:border-white transition-all duration-300 flex items-center justify-center text-white focus:outline-none z-30 cursor-pointer backdrop-blur-xs"
          aria-label="Previous banner"
        >
          <ChevronLeft size={18} />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/15 hover:bg-white hover:text-vintage hover:border-white transition-all duration-300 flex items-center justify-center text-white focus:outline-none z-30 cursor-pointer backdrop-blur-xs"
          aria-label="Next banner"
        >
          <ChevronRight size={18} />
        </button>

        {/* Slide Chapter Indicators at bottom of banner */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 bg-cream/95 backdrop-blur-md border border-vintage/15 px-5 py-2.5 rounded-full shadow-md"
        >
          <div className="flex items-center gap-2">
            {HERO_CHAPTERS.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterSelect(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentChapter === index ? 'bg-vintage scale-110 w-5' : 'bg-vintage/25 hover:bg-vintage/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>


      {/* SECTION 2: TANEIRA-STYLE 'SHOP BY WEAVE & CRAFT' SHELF */}
      {showWeaveAndCraft && (
        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-16 sm:py-20 z-20 bg-transparent">
          <div className="flex flex-col items-center justify-center text-center mb-12 select-none">
            <span className="text-vintage/30 text-xl mb-1">⚜</span>
            <h2 className="font-display text-[10px] sm:text-xs tracking-[0.35em] uppercase text-olive font-semibold">
              SHOP BY WEAVE & CRAFT
            </h2>
            <p className="text-[9px] tracking-[0.15em] text-vintage/60 uppercase mt-1">
              EXPLORE THE RICH TAPESTRY OF TRADITIONAL SOUTH-INDIAN GUILDS
            </p>
            <div className="w-12 h-[1px] bg-vintage/20 mt-3"></div>
          </div>

          {/* Horizontal Craft Category Cards Row (Spacious & Perfectly Aligned!) */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-4 md:gap-6 lg:gap-8 justify-items-center">
            {CRAFT_CATEGORIES.map((category, index) => (
              <motion.button
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                className="group flex flex-col items-center text-center focus:outline-none w-full max-w-[140px]"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                {/* Luxury Circular Specimen Weave Card */}
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-vintage/15 group-hover:border-vintage/45 transition-all duration-300 p-0.5 flex items-center justify-center relative overflow-hidden bg-cream shadow-sm"
                  style={{ borderColor: category.borderColor }}
                >
                  <div 
                    className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${category.baseColor} 0%, #FAF6EB 100%)`
                    }}
                  >
                    {/* Fine handloom thread mesh overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #4A1521 2px, #4A1521 4px)',
                      backgroundSize: '8px 8px'
                    }} />

                    {/* Inner gold circular lace */}
                    <div className="absolute inset-1 rounded-full border border-dashed border-vintage/15 group-hover:border-vintage/35 transition-colors duration-300" />
                    
                    {/* Centered Golden Crest */}
                    <span className="text-base font-serif group-hover:scale-125 transition-transform duration-500 z-10 select-none" style={{ color: category.accentColor }}>
                      {category.crest}
                    </span>

                    {/* Golden luster swipe animation on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>

                {/* Text Description */}
                <span className="text-[10px] tracking-wider font-semibold text-vintage uppercase mt-3.5 group-hover:text-rose transition-colors duration-300">
                  {category.name}
                </span>
                <span className="text-[7.5px] tracking-widest text-vintage/45 uppercase mt-0.5 font-light">
                  {category.desc}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}
