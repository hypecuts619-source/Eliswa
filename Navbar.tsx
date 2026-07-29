import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

const COLLECTIONS = [
  { label: 'Onam Sarees', href: '/onam-sarees' },
  { label: 'Kasavu Sarees', href: '/kasavu-sarees' },
  { label: 'Tissue Sarees', href: '/tissue-sarees' },
];

const PRIMARY_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'The Editorial', href: '/journal' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartTotalCount, setIsCartOpen } = useCart();
  const collectionsRef = useRef<HTMLDivElement>(null);

  // A hairline reading progress rule under the bar.
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 34, mass: 0.4 });

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // The mobile sheet must not leave the page scrollable behind it.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Escape closes whatever is open; clicking away closes the dropdown.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      setIsCollectionsOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!collectionsRef.current?.contains(event.target as Node)) {
        setIsCollectionsOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <>
      <motion.header
        className="fixed w-full z-50 transition-all duration-500 px-4 sm:px-6 md:px-12 top-0 pointer-events-none"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto pointer-events-auto surface-glass flex items-center justify-between transition-[max-width,border-radius,padding,box-shadow,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled
              ? 'max-w-6xl mt-4 rounded-full py-1.5 px-4 sm:px-6 shadow-[var(--shadow-lifted)]'
              : 'max-w-7xl mt-0 rounded-b-2xl py-2 px-4 md:px-8 border-t-0 shadow-[var(--shadow-soft)]'
          }`}
        >
          {/* Left: the EW monogram */}
          <a
            href="/"
            aria-label="Eliswa India — home"
            className="flex items-center justify-center select-none group/logo shrink-0 rounded-sm"
          >
            <img
              src="/eliswa_logo.png"
              alt="Eliswa India"
              width={282}
              height={240}
              className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:scale-105"
              fetchPriority="high"
            />
          </a>

          {/* Centre: desktop menu */}
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-7 text-[10px] lg:text-[11px] tracking-[0.25em] uppercase font-semibold text-rosegold">
            <a href="/" className="link-zari hover:text-rosegold-deep transition-colors py-1">
              Home
            </a>

            <Dot />

            <div ref={collectionsRef} className="relative py-1">
              <button
                type="button"
                aria-expanded={isCollectionsOpen}
                aria-haspopup="true"
                onClick={() => setIsCollectionsOpen((open) => !open)}
                className="flex items-center gap-1 uppercase tracking-[0.25em] hover:text-rosegold-deep transition-colors"
              >
                Collections
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${isCollectionsOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 surface-glass rounded-xl shadow-[var(--shadow-lifted)] py-2 flex flex-col text-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isCollectionsOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-1 pointer-events-none'
                }`}
              >
                {COLLECTIONS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="py-2.5 hover:bg-vintage/5 hover:text-rosegold-deep transition-colors"
                    tabIndex={isCollectionsOpen ? 0 : -1}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {PRIMARY_LINKS.slice(1).map((item) => (
              <span key={item.href} className="contents">
                <Dot />
                <a
                  href={item.href}
                  className="link-zari hover:text-rosegold-deep transition-colors py-1"
                >
                  {item.label}
                </a>
              </span>
            ))}
          </div>

          {/* Right: cart & mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              className="text-rosegold relative hover:text-rosegold-deep hover:border-rosegold/50 transition-all duration-300 p-2 border border-rosegold/20 rounded-full"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open cart${cartTotalCount > 0 ? `, ${cartTotalCount} item${cartTotalCount === 1 ? '' : 's'}` : ''}`}
            >
              <ShoppingBag size={20} className="stroke-[1.5]" aria-hidden="true" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rosegold text-cream text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-cream">
                  {cartTotalCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="md:hidden text-rosegold p-2 border border-rosegold/20 rounded-full transition-colors hover:text-rosegold-deep"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>

        </nav>
      </motion.header>

      {/* Reading progress: a thread of zari drawn across the top of the page. */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left pointer-events-none"
        style={{
          scaleX: progress,
          background: 'linear-gradient(to right, #f2d5d1, #cf958f 45%, #a86058)',
        }}
      />

      {/* Mobile sheet */}
      <motion.div
        id="mobile-menu"
        className="fixed inset-0 z-40 bg-cream/98 backdrop-blur-md flex flex-col items-center justify-center md:hidden p-6"
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isOpen}
      >
        <div className="border border-rosegold/20 rounded-2xl px-6 py-10 w-full max-w-md max-h-[85vh] overflow-y-auto flex flex-col items-center gap-7">
          <img
            src="/eliswa_logo.png"
            alt=""
            width={282}
            height={240}
            className="h-16 w-auto object-contain"
            aria-hidden="true"
          />

          <span className="text-rosegold/40 text-2xl" aria-hidden="true">
            ❦
          </span>

          {[PRIMARY_LINKS[0], ...COLLECTIONS, ...PRIMARY_LINKS.slice(1)].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-lg font-display uppercase tracking-widest text-rosegold hover:text-rosegold-deep transition-colors"
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
            >
              {item.label}
            </a>
          ))}

          <span className="text-rosegold/40 text-2xl" aria-hidden="true">
            ❦
          </span>

          <p className="text-[10px] tracking-[0.2em] uppercase text-olive font-medium text-center">
            KOCHI • CHENNAI • BOMBAY
          </p>
        </div>
      </motion.div>
    </>
  );
}

function Dot() {
  return (
    <span className="text-rosegold/40 text-xs select-none" aria-hidden="true">
      •
    </span>
  );
}
