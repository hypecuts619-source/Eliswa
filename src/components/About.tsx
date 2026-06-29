import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

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
              <img 
                src="/portrait.png" 
                alt="Aashitha Wilson - Founder & Designer"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Elegant overlay elements simulating texture */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #8B324D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
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
        </motion.div>
        
      </div>
    </section>
  );
}
