/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Collection } from './components/Collection';
import { About } from './components/About';
import { HeritageSoundtrack } from './components/HeritageSoundtrack';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { BackToTop } from './components/BackToTop';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { OnamSarees } from './components/OnamSarees';
import { Journal } from './components/Journal';
import { BlogPost } from './components/BlogPost';
import { GenericPage } from './components/GenericPage';
import { pageContents } from './pages';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const renderContent = () => {
    if (currentPath === '/onam-sarees' || currentPath === '/kasavu-sarees' || currentPath === '/tissue-sarees') {
      const titleMap: Record<string, string> = {
        '/onam-sarees': 'Onam Sarees – Handwoven Kerala Kasavu Sarees for Thiruvonam',
        '/kasavu-sarees': 'Kasavu Sarees – Traditional Off-White Cotton Sarees',
        '/tissue-sarees': 'Tissue Sarees – Fine Metallic Tissue Weaves'
      };
      
      // Update document title manually
      document.title = titleMap[currentPath] + " | Eliswa India";

      return (
        <div className="pt-24 pb-16">
          <h1 className="sr-only">{titleMap[currentPath]}</h1>
          <Collection defaultCategory={currentPath === "/tissue-sarees" ? "Tissue" : currentPath === "/kasavu-sarees" ? "Cotton" : null} />
        </div>
      );
    }
    
    if (currentPath === '/journal') {
      return <Journal />;
    }
    
    if (currentPath.startsWith('/blogs/')) {
      return <BlogPost slug={currentPath} />;
    }

    if (pageContents[currentPath]) {
      // Update document title manually
      document.title = pageContents[currentPath].title + " | Eliswa India";
      return <GenericPage title={pageContents[currentPath].title} content={pageContents[currentPath].content} />;
    }

    // Default home page
    return (
      <>
        <Hero />
        <Collection />
        <About />
      </>
    );
  };

  return (
    <CartProvider>
      <main className="relative min-h-screen text-vintage font-body overflow-x-hidden selection:bg-rose selection:text-white bg-transparent">
        {currentPath !== '/onam-sarees' && <h1 className="sr-only">Bespoke Kerala Kasavu & Onam Sarees, Handwoven for You</h1>}
        
        {/* 3D Cloth Waving Global Background */}
        <svg width="0" height="0" className="hidden absolute">
          <filter id="cloth-wave" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.002 0.0015" numOctaves="4" result="rawNoise" />
            <feOffset dx="0" dy="0" in="rawNoise" result="noise">
              <animate attributeName="dx" values="0; -200; 0" dur="40s" repeatCount="indefinite" />
              <animate attributeName="dy" values="0; 200; 0" dur="40s" repeatCount="indefinite" />
            </feOffset>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="120" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="2.5" result="light">
              <feDistantLight azimuth="60" elevation="50" />
            </feDiffuseLighting>
            <feBlend mode="multiply" in="light" in2="displaced" />
          </filter>
        </svg>

        <div 
          className="fixed -inset-1/2 z-0 pointer-events-none bg-cloth-3d opacity-60"
          style={{ filter: 'url(#cloth-wave)' }}
        />

        <div className="relative z-10">
          <Navbar />
          <CartDrawer />
          {renderContent()}
          <Footer />
          <HeritageSoundtrack />
          <WhatsAppButton />
          <BackToTop />
        </div>
      </main>
    </CartProvider>
  );
}
