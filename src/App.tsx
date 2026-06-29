/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Collection } from './components/Collection';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

export default function App() {
  return (
    <main className="bg-cream min-h-screen text-vintage font-body overflow-x-hidden selection:bg-rose selection:text-white">
      <Navbar />
      <Hero />
      <Collection />
      <About />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
