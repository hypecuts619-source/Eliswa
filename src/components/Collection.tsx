import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function OnamImage3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, 'https://opal.google/board/blobs/6cc00215-60c2-4719-9bdf-e047dfe08680');
  
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section id="collection" className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
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
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="order-1 md:order-2 cursor-pointer"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream border border-vintage/20 shadow-xl shadow-vintage/5 transition-all duration-700 hover:shadow-2xl hover:shadow-vintage/20 group">
            <motion.div className="absolute inset-0 z-0 h-[120%] -top-[10%]" style={{ y }}>
              <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 8]} intensity={1.2} color="#FFFFFF" />
                <directionalLight position={[-5, -10, -5]} intensity={0.5} color="#8B324D" />
                <Environment preset="city" />
                <PresentationControls 
                  global 
                  config={{ mass: 1, tension: 300 }} 
                  snap={{ mass: 2, tension: 800 }} 
                  rotation={[0, 0, 0]} 
                  polar={[-Math.PI / 6, Math.PI / 6]} 
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                  <Suspense fallback={null}>
                    <OnamImage3D />
                  </Suspense>
                </PresentationControls>
              </Canvas>
            </motion.div>
            
            {/* Elegant overlay elements simulating texture */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #8B324D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[85%] h-[85%] border border-vintage/30 rounded-t-full relative flex flex-col items-center justify-end p-8 pb-12">
                <span className="font-display text-2xl text-vintage/70 italic drop-shadow-md">Onam '26</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
