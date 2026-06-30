import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
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

function SareeFabric({ saree }: { saree: SareeData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  
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
      if (saree.pattern === 'brocade') {
        ctx.fillStyle = saree.borderColor;
        for(let x = 120; x < 900; x += 60) {
          for(let y = 0; y < 850; y += 60) {
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 30, y + 30, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (saree.pattern === 'geometric') {
        ctx.fillStyle = saree.accentColor;
        for(let x = 120; x < 900; x += 80) {
          for(let y = 0; y < 850; y += 80) {
            ctx.beginPath();
            ctx.moveTo(x, y - 20);
            ctx.lineTo(x + 20, y);
            ctx.lineTo(x, y + 20);
            ctx.lineTo(x - 20, y);
            ctx.fill();
          }
        }
      }

      // Border gradient
      const borderGradient = ctx.createLinearGradient(0, 0, 1024, 0);
      borderGradient.addColorStop(0, saree.borderColor);
      borderGradient.addColorStop(0.5, saree.accentColor);
      borderGradient.addColorStop(1, saree.borderColor);

      ctx.fillStyle = borderGradient;
      
      // Bottom border (Pallu part)
      ctx.fillRect(0, 1024 - 150, 1024, 150);
      
      // Side borders
      ctx.fillRect(0, 0, 80, 1024);
      ctx.fillRect(1024 - 80, 0, 80, 1024);
      
      // Thin inner lines
      ctx.fillStyle = saree.accentColor;
      ctx.fillRect(90, 0, 10, 1024);
      ctx.fillRect(1024 - 100, 0, 10, 1024);
      ctx.fillRect(0, 1024 - 170, 1024, 10);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [saree]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Elegant slow rotation
      meshRef.current.rotation.y = Math.sin(time * 0.15) * 0.2;
      meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;
    }
    
    // Animate vertices for a flowing fabric effect
    if (geomRef.current) {
      const position = geomRef.current.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        // Create smooth, elegant waves resembling a draping saree
        const z = Math.sin(x * 1.5 + time * 1.2) * 0.3 + 
                  Math.cos(y * 1.2 + time * 0.8) * 0.4 +
                  Math.sin(x * 0.5 + y * 0.5 + time) * 0.2;
        position.setZ(i, z);
      }
      position.needsUpdate = true;
      geomRef.current.computeVertexNormals();
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 5, 0, 0]}>
        <planeGeometry ref={geomRef} args={[4.5, 6, 64, 64]} />
        <meshPhysicalMaterial 
          map={texture}
          metalness={0.4}
          roughness={0.6}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
          side={THREE.DoubleSide}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

export function About() {
  const [currentSareeIndex, setCurrentSareeIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const handleNext = () => {
    setCurrentSareeIndex((prev) => (prev + 1) % SAREES.length);
  };

  const handlePrev = () => {
    setCurrentSareeIndex((prev) => (prev - 1 + SAREES.length) % SAREES.length);
  };

  const currentSaree = SAREES[currentSareeIndex];

  return (
    <section id="about-us" className="py-32 bg-pearl/20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cream rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-16 items-center relative z-10">
        
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="h-[600px] w-full bg-cream border border-vintage/20 shadow-2xl shadow-vintage/10 flex items-center justify-center relative overflow-hidden group">
            <motion.div className="absolute inset-0 z-0 h-[120%] -top-[10%]" style={{ y }}>
              <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#CE758C" />
                <Environment preset="city" />
                <PresentationControls 
                  global 
                  config={{ mass: 1, tension: 200 }} 
                  snap={{ mass: 2, tension: 500 }} 
                  rotation={[0, 0, 0]} 
                  polar={[-Math.PI / 8, Math.PI / 8]} 
                  azimuth={[-Math.PI / 8, Math.PI / 8]}
                >
                  <SareeFabric saree={currentSaree} />
                </PresentationControls>
              </Canvas>
            </motion.div>
            
            {/* Elegant overlay elements simulating texture */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #8B324D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Carousel Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 z-20 pointer-events-none">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white transition-colors shadow-lg pointer-events-auto"
              >
                <ChevronLeft size={24} />
              </button>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSaree.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-vintage/10 pointer-events-auto"
                >
                  <span className="font-display tracking-wider text-vintage uppercase text-sm">
                    {currentSaree.name}
                  </span>
                </motion.div>
              </AnimatePresence>

              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-vintage hover:bg-vintage hover:text-white transition-colors shadow-lg pointer-events-auto"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          {/* Decorative accents */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-vintage/30 pointer-events-none"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-vintage/30 pointer-events-none"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="pr-4"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-vintage"></div>
            <span className="uppercase tracking-widest text-vintage/70 text-sm">Our Story</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl mb-10 text-vintage leading-tight">Crafting Heritage</h2>
          
          <div className="text-vintage/80 space-y-8 text-lg font-light leading-relaxed">
            <p>
              Born from the visionary eye of Aashitha Wilson, Eliswa is a sanctuary of artisanal luxury—a tribute to classical femininity softly reimagined for the modern world.
            </p>
            <p>
              Every bespoke creation is an intimate tactile experience, defined by masterful 3D ribbed textures, elevated embroidery, and the delicate precision of fine spun wire. We weave stories into fabric, ensuring each piece is a unique narrative of its wearer.
            </p>
            <p>
              Bathed in an inviting, luminous palette of soft golden creams and metallic rose gold, an Eliswa garment is not merely worn; it is felt. It's an embrace of tradition, tailored for the contemporary muse.
            </p>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
