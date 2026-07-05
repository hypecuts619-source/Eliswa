/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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

export default function App() {
  return (
    <CartProvider>
      <main className="relative min-h-screen text-vintage font-body overflow-x-hidden selection:bg-rose selection:text-white bg-transparent">
        {/* 3D Cloth Waving Global Background */}
        <svg width="0" height="0" className="hidden absolute">
          <filter id="cloth-wave" x="-20%" y="-20%" width="140%" height="140%">
            {/* Create organic noise for the fabric folds */}
            <feTurbulence type="fractalNoise" baseFrequency="0.002 0.0015" numOctaves="4" result="rawNoise" />
            
            {/* Animate the noise diagonally to simulate wind/movement */}
            <feOffset dx="0" dy="0" in="rawNoise" result="noise">
              <animate attributeName="dx" values="0; -200; 0" dur="40s" repeatCount="indefinite" />
              <animate attributeName="dy" values="0; 200; 0" dur="40s" repeatCount="indefinite" />
            </feOffset>
            
            {/* Displace the background colors to follow the noise */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="120" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            
            {/* Add 3D lighting over the noise to create shadows and highlights of folds */}
            <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="2.5" result="light">
              <feDistantLight azimuth="60" elevation="50" />
            </feDiffuseLighting>
            
            {/* Blend lighting with the displaced background */}
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
          <Hero />
          <Collection />
          <About />
          <Footer />
          <HeritageSoundtrack />
          <WhatsAppButton />
          <BackToTop />
        </div>
      </main>
    </CartProvider>
  );
}
