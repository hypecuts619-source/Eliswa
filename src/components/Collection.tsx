import { motion } from 'motion/react';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function KasavuDrape() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a plane geometry with vertex colors for the Kasavu border
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 20, 80, 140);
    const pos = geo.attributes.position;
    const colors = [];
    const colorCream = new THREE.Color("#FAF9F6"); // Ivory/Off-white cotton/silk
    const colorGold = new THREE.Color("#D4AF37"); // Classic Kasavu Gold
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      // Kasavu design: thick vertical borders and a bottom pallu stripe
      const isVerticalBorder = x < -4.5 || x > 4.5;
      const isSolidPallu = y < -7;
      // Additional horizontal thin stripes in the pallu region
      const isThinStripe = y > -6 && y < -5 && Math.sin(y * 15) > 0.5;

      if (isVerticalBorder || isSolidPallu || isThinStripe) {
        colors.push(colorGold.r, colorGold.g, colorGold.b);
      } else {
        colors.push(colorCream.r, colorCream.g, colorCream.b);
      }
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  const initialPositions = useMemo(() => new Float32Array(geometry.attributes.position.array), [geometry]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pos = geometry.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const origX = initialPositions[i * 3];
      const origY = initialPositions[i * 3 + 1];
      
      // Gravity-based wave effect: top is pinned, bottom flutters
      const falloff = Math.max(0, (10 - origY) / 20); // 0 at top (+10), 1 at bottom (-10)
      
      // Cascading wave simulating a hanging saree pallu blowing softly
      const waveX = Math.sin(origY * 0.4 + time * 0.6) * 1.5 * falloff;
      const waveZ = Math.sin(origX * 0.5 + time * 0.5) * 1.5 * falloff + Math.cos(origY * 0.3 - time * 0.4) * 2.0 * falloff;
      
      pos.setX(i, origX + waveX);
      pos.setZ(i, waveZ);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    
    if (groupRef.current) {
      // Gentle sway
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
      groupRef.current.rotation.x = Math.cos(time * 0.15) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} rotation={[0, 0, 0]} scale={0.55} position={[0, 1.5, 0]}>
        {/* The main Kasavu fabric */}
        <mesh ref={meshRef} geometry={geometry}>
          <meshPhysicalMaterial 
            vertexColors={true}
            roughness={0.6}
            metalness={0.2}
            clearcoat={0.1}
            side={THREE.DoubleSide}
            sheen={1}
            sheenColor="#FFFFFF"
          />
        </mesh>
        
        {/* Subtle gold threads overlay to make the Kasavu shine */}
        <mesh geometry={geometry} scale={1.001}>
          <meshPhysicalMaterial 
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={0.2}
            metalness={1}
            roughness={0.2}
            wireframe={true}
            transparent={true}
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function Collection() {
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
          <button className="px-10 py-4 border-2 border-vintage text-vintage hover:bg-vintage hover:text-white transition-all duration-500 tracking-widest uppercase text-sm font-medium">
            Join the Waitlist
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="order-1 md:order-2"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream border border-vintage/20 shadow-xl shadow-vintage/5 group">
            <div className="absolute inset-0 z-0">
              <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 8]} intensity={1.2} color="#FFFFFF" />
                <directionalLight position={[-5, -10, -5]} intensity={0.5} color="#B86B77" />
                <Environment preset="city" />
                <PresentationControls 
                  global 
                  config={{ mass: 1, tension: 300 }} 
                  snap={{ mass: 2, tension: 800 }} 
                  rotation={[0, 0, 0]} 
                  polar={[-Math.PI / 6, Math.PI / 6]} 
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                  <KasavuDrape />
                </PresentationControls>
              </Canvas>
            </div>
            
            {/* Elegant overlay elements simulating texture */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #B86B77 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
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
