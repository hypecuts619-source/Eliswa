/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Collection } from './components/Collection';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { WaitlistModal } from './components/WaitlistModal';

export default function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <main className="bg-cream min-h-screen text-vintage font-body overflow-x-hidden selection:bg-rose selection:text-white">
      <Navbar />
      <Hero />
      <Collection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      <About />
      <Footer />
      <WhatsAppButton />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </main>
  );
}
