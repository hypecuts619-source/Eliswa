import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';

const LoomWeaveScene = lazy(() => import('./three/LoomWeaveScene'));

/**
 * Keeps a failed chunk download or a refused WebGL context local to this
 * section — the page keeps working and the reader gets the still drape.
 */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Loom scene unavailable, falling back to the still image.', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** WebGL is probed once, lazily, and cached. */
let webglSupport: boolean | null = null;
function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    webglSupport = Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl')
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

const CRAFT_NOTES = [
  { label: 'The Warp', copy: 'Unbleached cotton, tensioned by hand across the pit loom.' },
  { label: 'The Weft', copy: 'Every coloured stripe is one pick — thrown by shuttle, beaten home.' },
  { label: 'The Pallu', copy: 'The signed end — where the weaver leaves their measure of the work.' },
];

/**
 * The section that follows the hero: a live WebGL pit loom weaving an Onam
 * kasavu, the cloth running off the breast beam into a hanging drape.
 *
 * It is deliberately cautious about when it runs — the scene is code-split, it
 * only mounts once the section nears the viewport, its render loop halts when
 * the section leaves, and it degrades to a still gradient when WebGL is
 * unavailable or the reader has asked for reduced motion.
 */
export function WeaveShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // `mounted` latches on approach; `active` tracks visibility for the render loop.
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [canRender3D, setCanRender3D] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    progressRef.current = value;
  });

  useEffect(() => {
    setCanRender3D(supportsWebGL());
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      setActive(true);
      return;
    }

    // Wide margin: start downloading and warming the scene before it is seen.
    const preloader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          preloader.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );

    const visibility = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 }
    );

    preloader.observe(node);
    visibility.observe(node);
    return () => {
      preloader.disconnect();
      visibility.disconnect();
    };
  }, []);

  const showCanvas = mounted && canRender3D;

  return (
    <section
      ref={sectionRef}
      id="the-loom"
      aria-labelledby="the-loom-heading"
      className="relative w-full overflow-hidden isolate"
      style={{
        // A deep band of the house's own vintage maroon, warmed toward rose at
        // the top. Nothing outside the existing palette — but dark enough that
        // cream silk and gold zari finally have something to read against.
        backgroundColor: '#4A1521',
        backgroundImage:
          'radial-gradient(130% 105% at 50% -10%, color-mix(in srgb, #4A1521 78%, #C1838F) 0%, #4A1521 58%, #3d1119 100%)',
      }}
    >
      {/* Cream feathering top and bottom so the band joins the page. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-16 sm:h-24 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, #FAF6EB, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-16 sm:h-24 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to top, #FAF6EB, transparent)' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 md:px-16 pt-24 pb-24 sm:pt-28 sm:pb-28">
        {/* --- Editorial header --- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center select-none"
        >
          <span className="text-rosegold/60 text-xl mb-2" aria-hidden="true">
            ✧
          </span>
          <h2
            id="the-loom-heading"
            className="font-display text-[10px] sm:text-xs tracking-[0.35em] uppercase text-rosegold font-semibold"
          >
            The Loom, In Motion
          </h2>
          <p className="font-display text-cream mt-4 max-w-2xl leading-[1.25] tracking-wide text-[clamp(1.6rem,1.1rem+2vw,3rem)]">
            Made <span className="italic rose-gold-metallic">while you watch</span>
          </p>
          <p className="text-pearl/65 font-light mt-5 max-w-xl text-[clamp(0.9rem,0.85rem+0.3vw,1.05rem)] leading-relaxed">
            Six metres of Onam kasavu, a pick at a time. The olive, rose and lilac stripes
            arrive one thrown shuttle at a time, and the cloth grows as you watch.
          </p>
        </motion.div>

        {/* --- The drape --- */}
        <div className="relative h-[58vh] min-h-[340px] max-h-[660px] sm:h-[64vh] -mt-2">
          {showCanvas ? (
            <SceneBoundary fallback={<DrapeFallback />}>
              <Suspense fallback={<DrapeFallback />}>
                <LoomWeaveScene
                  progressRef={progressRef}
                  active={active}
                  animate={!prefersReducedMotion}
                />
              </Suspense>
            </SceneBoundary>
          ) : (
            <DrapeFallback />
          )}
        </div>

        {/* --- Craft notes --- */}
        <div className="relative grid gap-px sm:grid-cols-3 bg-pearl/12 border border-pearl/12 rounded-sm overflow-hidden backdrop-blur-sm">
          {CRAFT_NOTES.map((note, index) => (
            <motion.div
              key={note.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 py-7 text-center sm:text-left bg-vintage/45"
            >
              <span className="block text-[10px] tracking-[0.28em] uppercase font-bold text-rosegold">
                {note.label}
              </span>
              <p className="mt-2.5 text-pearl/70 font-light text-sm leading-relaxed">
                {note.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Still stand-in: the same palette, no WebGL, no motion. */
function DrapeFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-[88%] h-[58%] rounded-[45%_45%_42%_42%/14%_14%_12%_12%] shadow-[0_34px_80px_-20px_rgb(0_0_0/0.45)]"
        style={{
          background:
            'linear-gradient(102deg, #F5EBE6 0%, #FAF6EB 26%, #f2d5d1 46%, #FAF6EB 66%, #F5EBE6 100%)',
          borderTop: '6px solid #cf958f',
          borderBottom: '6px solid #a86058',
        }}
      />
    </div>
  );
}
