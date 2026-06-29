import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';

function SilkRibbon() {
  const groupRef = useRef<THREE.Group>(null);
  
  // A long, elegant scarf/ribbon geometry
  const geometry = useMemo(() => new THREE.PlaneGeometry(40, 12, 200, 60), []);
  const initialPositions = useMemo(() => {
    return new Float32Array(geometry.attributes.position.array);
  }, [geometry]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positionAttribute = geometry.attributes.position;
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const origX = initialPositions[i * 3];
      const origY = initialPositions[i * 3 + 1];
      
      // Smooth, flowing ribbon dynamics
      const flowX = time * 0.4;
      
      // Primary large waves
      const wave1 = Math.sin(origX * 0.12 + flowX) * 3.0;
      // Secondary ripples for silk-like folds
      const wave2 = Math.cos(origX * 0.25 + origY * 0.4 - flowX * 1.5) * 0.6;
      // Elegant twisting based on Y axis to make edges curl
      const twist = Math.sin(origX * 0.05 + flowX * 0.5) * origY * 0.6;
      
      positionAttribute.setZ(i, wave1 + wave2 + twist);
      
      // Slight vertical folds to create depth
      const fold = Math.sin(origX * 0.15 - flowX) * 0.8;
      positionAttribute.setY(i, origY + fold);
    }
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    if (groupRef.current) {
      // Very slow, majestic rotation
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
      groupRef.current.rotation.z = Math.cos(time * 0.05) * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} rotation={[-Math.PI / 4, 0, 0]}>
        {/* Main Silk Fabric - Pearl/Rose finish */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial 
            color="#F7D2D8" // pearl
            metalness={0.1}
            roughness={0.3}
            clearcoat={1.0}
            clearcoatRoughness={0.15}
            sheen={1}
            sheenColor="#DB9CA6" // rose
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Zari thread details overlay - shimmering gold */}
        <mesh geometry={geometry} scale={1.001}>
          <meshPhysicalMaterial 
            color="#D4AF37" // classic gold
            emissive="#D4AF37"
            emissiveIntensity={0.05}
            metalness={1}
            roughness={0.2}
            wireframe={true}
            transparent={true}
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function Hero() {
  return (
    <header id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-pearl/30">
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.6} color="#FDE5B2" />
          <directionalLight position={[10, 10, 5]} intensity={1.8} color="#FFFFFF" />
          <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#DB9CA6" />
          <spotLight position={[0, 10, 0]} angle={0.6} penumbra={1} intensity={2} color="#F7D2D8" castShadow />
          <Environment preset="studio" />
          <PresentationControls 
            global 
            config={{ mass: 2, tension: 500 }} 
            snap={{ mass: 4, tension: 1500 }} 
            rotation={[0, 0, 0]} 
            polar={[-Math.PI / 8, Math.PI / 8]} 
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <SilkRibbon />
            <Sparkles count={150} scale={25} size={2.5} speed={0.3} opacity={0.6} color="#D4AF37" />
          </PresentationControls>
        </Canvas>
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
