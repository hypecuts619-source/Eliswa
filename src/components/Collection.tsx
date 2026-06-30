import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { SareeDetailModal } from './SareeDetailModal';

export interface OnamSareeData {
  id: string;
  name: string;
  baseColor: string;
  borderColor: string;
  accentColor: string;
  pattern: 'plain' | 'brocade' | 'geometric' | 'mural';
  material: 'Cotton' | 'Tissue' | 'Silk';
  occasion: 'Festive' | 'Wedding' | 'Casual';
}

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

function OnamSareeFabric({ saree }: { saree: OnamSareeData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base color
      ctx.fillStyle = saree.baseColor;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Patterns
      if (saree.pattern === 'mural') {
        ctx.fillStyle = saree.accentColor;
        for(let x = 150; x < 900; x += 100) {
          for(let y = 100; y < 900; y += 150) {
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#2E8B57'; // green leaves
            ctx.beginPath();
            ctx.moveTo(x + 20, y);
            ctx.lineTo(x + 40, y - 20);
            ctx.lineTo(x + 40, y + 20);
            ctx.fill();
            ctx.fillStyle = saree.accentColor;
          }
        }
      } else if (saree.pattern === 'geometric') {
        ctx.fillStyle = saree.accentColor;
        ctx.globalAlpha = 0.3;
        for(let x = 120; x < 900; x += 40) {
          ctx.fillRect(x, 0, 2, 1024);
        }
        for(let y = 0; y < 850; y += 40) {
          ctx.fillRect(0, y, 1024, 2);
        }
        ctx.globalAlpha = 1.0;
      }

      // Border gradient
      const borderGradient = ctx.createLinearGradient(0, 0, 1024, 0);
      borderGradient.addColorStop(0, saree.borderColor);
      borderGradient.addColorStop(0.5, saree.accentColor);
      borderGradient.addColorStop(1, saree.borderColor);

      ctx.fillStyle = borderGradient;
      
      // Bottom border (Pallu part)
      ctx.fillRect(0, 1024 - 180, 1024, 180);
      
      // Side borders
      ctx.fillRect(0, 0, 100, 1024);
      ctx.fillRect(1024 - 100, 0, 100, 1024);
      
      // Thin inner lines
      ctx.fillStyle = saree.accentColor;
      ctx.fillRect(110, 0, 10, 1024);
      ctx.fillRect(1024 - 120, 0, 10, 1024);
      ctx.fillRect(0, 1024 - 200, 1024, 10);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [saree]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(8, 10, 64, 64), []);
  const initialPositions = useMemo(() => new Float32Array(geometry.attributes.position.array), [geometry]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pos = geometry.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const origX = initialPositions[i * 3];
      const origY = initialPositions[i * 3 + 1];
      
      // Gentle, luxurious wave
      const waveZ = Math.sin(origX * 0.5 + time * 0.8) * 0.3 + 
                    Math.cos(origY * 0.5 + time * 0.5) * 0.3;
      
      pos.setZ(i, waveZ);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
      meshRef.current.rotation.x = Math.cos(time * 0.15) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef} geometry={geometry} scale={0.75}>
        <meshPhysicalMaterial 
          map={texture}
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

interface CollectionProps {
  onOpenWaitlist?: () => void;
}

export function Collection({ onOpenWaitlist }: CollectionProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  const filteredSarees = useMemo(() => {
    return ONAM_SAREES.filter(saree => {
      const matchMaterial = selectedMaterial ? saree.material === selectedMaterial : true;
      const matchOccasion = selectedOccasion ? saree.occasion === selectedOccasion : true;
      return matchMaterial && matchOccasion;
    });
  }, [selectedMaterial, selectedOccasion]);

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Reset index when filters change
  useMemo(() => {
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

  const currentSaree = filteredSarees[currentIndex];

  return (
    <section id="collection" className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
      {/* Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16 flex flex-col xl:flex-row justify-between items-center gap-6 border-b border-vintage/10 pb-6"
      >
        <h3 className="font-display text-2xl text-vintage">Curate Your Look</h3>
        <div className="flex flex-wrap gap-6 items-center justify-center xl:justify-end">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <span className="text-xs font-medium tracking-widest uppercase text-vintage/60 mr-2">Material:</span>
            {['Cotton', 'Tissue', 'Silk'].map(material => (
              <button
                key={material}
                onClick={() => setSelectedMaterial(prev => prev === material ? null : material)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 border ${selectedMaterial === material ? 'bg-vintage text-white border-vintage' : 'border-vintage/20 text-vintage hover:border-vintage/50'}`}
              >
                {material}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <span className="text-xs font-medium tracking-widest uppercase text-vintage/60 mr-2">Occasion:</span>
            {['Festive', 'Wedding', 'Casual'].map(occasion => (
              <button
                key={occasion}
                onClick={() => setSelectedOccasion(prev => prev === occasion ? null : occasion)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 border ${selectedOccasion === occasion ? 'bg-vintage text-white border-vintage' : 'border-vintage/20 text-vintage hover:border-vintage/50'}`}
              >
                {occasion}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-2 md:order-1"
        >
          <h2 className="font-display text-4xl md:text-5xl mb-6 text-vintage">Launching Soon:<br/>The Onam Edit</h2>
          <p className="text-lg text-vintage/90 leading-relaxed mb-10 font-light">
            A cultural masterpiece, elegantly woven in soft creams and opulent metallic rose gold. The exclusive Onam Sarees collection is quietly taking shape, bringing a bespoke, feminine grace to storied traditions. Prepare to drape yourself in modern romance—unveiling soon.
          </p>
          <button 
            onClick={onOpenWaitlist}
            className="px-10 py-4 border-2 border-vintage text-vintage hover:bg-vintage hover:text-white transition-all duration-500 tracking-widest uppercase text-sm font-medium"
          >
            Join the Waitlist
          </button>
        </motion.div>
        
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="order-1 md:order-2 cursor-pointer"
          onClick={handleOpenModal}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream border border-vintage/20 shadow-xl shadow-vintage/5 transition-all duration-700 hover:shadow-2xl hover:shadow-vintage/20 group">
            {filteredSarees.length > 0 ? (
              <>
                <motion.div className="absolute inset-0 z-0 h-[120%] -top-[10%]" style={{ y }}>
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
                      <Suspense fallback={null}>
                        <OnamSareeFabric saree={currentSaree} />
                      </Suspense>
                    </PresentationControls>
                  </Canvas>
                </motion.div>
                
                {/* Elegant overlay elements simulating texture */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #8B324D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/60 backdrop-blur-md rounded-full p-2 text-vintage shadow-md">
                    <Expand size={20} />
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[85%] h-[85%] border border-vintage/30 rounded-t-full relative flex flex-col items-center justify-end p-8 pb-12">
                    <span className="font-display text-2xl text-vintage/70 italic drop-shadow-md">Onam '26</span>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 z-20 pointer-events-none">
                  <button 
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white transition-colors shadow-lg pointer-events-auto"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSaree.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-vintage/10 pointer-events-auto flex items-center"
                    >
                      <span className="font-display tracking-wider text-vintage uppercase text-xs">
                        {currentSaree.name}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  <button 
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white transition-colors shadow-lg pointer-events-auto"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-cream/50">
                <span className="font-display tracking-wider text-vintage/60 uppercase text-xs mb-4">
                  No matches found
                </span>
                <p className="text-vintage font-light leading-relaxed max-w-sm">
                  We are continually expanding our collection. Please try adjusting your curated filters to discover more exquisite pieces.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMaterial(null);
                    setSelectedOccasion(null);
                  }}
                  className="mt-8 px-6 py-2 border border-vintage/30 text-vintage hover:bg-vintage hover:text-white transition-all duration-300 tracking-widest uppercase text-xs"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {currentSaree && (
        <SareeDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          saree={currentSaree} 
          fabricComponent={<OnamSareeFabric saree={currentSaree} />} 
        />
      )}
    </section>
  );
}
