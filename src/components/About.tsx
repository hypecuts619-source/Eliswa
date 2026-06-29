import { motion } from 'motion/react';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function Logo3D() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Elegant, subtle rotation
      groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.15;
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      // Gentle floating
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.8/files/playfair-display-latin-400-normal.woff';
  const italicFontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.8/files/playfair-display-latin-400-italic.woff';
  
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} scale={1.3}>
        {/* Soft background glow */}
        <mesh position={[0, 0, -0.5]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial color="#DB9CA6" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        <Text 
          font={italicFontUrl} 
          position={[-0.3, 0.75, 0]} 
          fontSize={1.6} 
          color="#B86B77"
        >
          E
          <meshPhysicalMaterial 
            color="#DB9CA6"
            metalness={0.9}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Text>
        <Text 
          font={fontUrl} 
          position={[0.3, 0.45, 0.1]} 
          fontSize={1.4} 
          color="#B86B77"
        >
          W
          <meshPhysicalMaterial 
            color="#DB9CA6"
            metalness={0.9}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Text>
        <group position={[0, -0.6, 0.2]}>
          <Text 
            font={italicFontUrl} 
            position={[-0.9, 0, 0]} 
            fontSize={1.2} 
            color="#B86B77"
          >
            E
            <meshPhysicalMaterial 
              color="#DB9CA6"
              metalness={0.9}
              roughness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </Text>
          <Text 
            font={fontUrl} 
            position={[0.55, 0, 0]} 
            fontSize={1.2} 
            letterSpacing={0.12}
            color="#B86B77"
          >
            liswa
            <meshPhysicalMaterial 
              color="#DB9CA6"
              metalness={0.9}
              roughness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </Text>
        </group>
      </group>
    </Float>
  );
}

export function About() {
  return (
    <section id="about" className="py-32 bg-pearl/20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cream rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-16 items-center relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="h-[600px] w-full bg-cream border border-vintage/20 shadow-2xl shadow-vintage/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 z-0">
              <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#DB9CA6" />
                <Environment preset="city" />
                <PresentationControls 
                  global 
                  config={{ mass: 1, tension: 200 }} 
                  snap={{ mass: 2, tension: 500 }} 
                  rotation={[0, 0, 0]} 
                  polar={[-Math.PI / 8, Math.PI / 8]} 
                  azimuth={[-Math.PI / 8, Math.PI / 8]}
                >
                  <Logo3D />
                </PresentationControls>
              </Canvas>
            </div>
            
            {/* Elegant overlay elements simulating texture */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #B86B77 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
          {/* Decorative accents */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-vintage/30"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-vintage/30"></div>
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
          
          <div className="mt-12">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNjAiPjxwYXRoIGQ9Ik0xMCAzMFEzMCAxMCA1MCAzMFQ5MCAzMFQxMzAgMzBUMTcwIDMwIiBmaWxsPSJub25lIiBzdHJva2U9IiNCODZCNzciIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCA0Ii8+PC9zdmc+" 
              className="w-48 opacity-50" 
              alt="Decorative line" 
            />
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
