import { useState } from 'react';
import { LegalModal } from './LegalModals';
import { motion } from 'framer-motion';
import eliswaIndia from '../assets/eliswa_india.png';

export function Footer() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <footer id="contact" className="relative pt-32 pb-16 px-6 md:px-20 border-t border-vintage/15 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto flex flex-col items-center relative z-10"
      >
        
        {/* Symmetrical Footer Header in Logo Style */}
        <div className="flex flex-col items-center justify-center text-vintage select-none text-center mb-16">
          <img 
            src={eliswaIndia} 
            alt="Eliswa India" 
            className="h-32 md:h-48 object-contain -mt-4"
          />
          <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-olive font-medium mt-2">
            You are rare
          </span>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl text-center mb-16">
          
          <div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">THE HOUSE</h4>
            <p className="text-vintage/80 font-light text-xs max-w-xs leading-relaxed font-display italic">
              A private preserve of Indian handloom heritage and slow-fashioned legacy.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">ASSISTANCE</h4>
            <div className="flex flex-col items-center space-y-2 text-xs tracking-widest uppercase font-semibold text-vintage/70">
              <a href="/shipping-returns" className="hover:text-rose transition-colors">Shipping & Returns</a>
              <a href="/size-guide" className="hover:text-rose transition-colors">Size & Fit Guide</a>
              <a href="/faq" className="hover:text-rose transition-colors">FAQ</a>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-vintage uppercase tracking-[0.2em] text-[10px] font-bold mb-4">CONNECT</h4>
            <div className="flex flex-col items-center space-y-2 text-xs tracking-widest uppercase font-semibold text-vintage/70">
              <a href="/contact" className="hover:text-rose transition-colors">Contact Us</a>
              <a href="https://www.instagram.com/eliswaindia" target="_blank" rel="noopener noreferrer" className="hover:text-rose transition-colors mt-2">Instagram</a>
            </div>
          </div>
          
        </div>
        
        {/* Double-bordered Copyright block */}
        <div className="w-full max-w-4xl pt-8 border-t border-vintage/10 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase font-semibold text-vintage/50">
          <p>&copy; {new Date().getFullYear()} ELISWA. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-vintage transition-colors uppercase tracking-[0.2em]">Privacy Policy</button>
            <span className="text-vintage/20">•</span>
            <button onClick={() => setIsTermsOpen(true)} className="hover:text-vintage transition-colors uppercase tracking-[0.2em]">Terms of Service</button>
          </div>
        </div>

      </motion.div>

      {/* Modals */}
      <LegalModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        title="Privacy Policy"
        content={
          <div className="space-y-4">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>Eliswa ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">1. Information We Collect</h3>
            <p>We may collect personal information such as your name, email address, shipping address, phone number, and payment details when you place an order, subscribe to our newsletter, or contact our atelier.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">2. How We Use Your Information</h3>
            <p>We use the information we collect to process transactions, manage your bespoke orders, send you updates regarding your purchase, and communicate promotional offers (if you have opted in).</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">3. Information Sharing</h3>
            <p>We do not sell or rent your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website, processing payments, or delivering your orders.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">4. Data Security</h3>
            <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">5. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at contact@eliswa.com.</p>
          </div>
        }
      />

      <LegalModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Terms of Service"
        content={
          <div className="space-y-4">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>These Terms of Service govern your use of the Eliswa website and the purchase of our bespoke clothing and handloom products.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">1. Bespoke Orders and Craftsmanship</h3>
            <p>Our products are meticulously handcrafted. Due to the nature of handloom weaving, slight variations in color, texture, and pattern may occur. These are the hallmarks of true artisanal luxury, not defects.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">2. Pricing and Payment</h3>
            <p>All prices are listed in the applicable currency. We reserve the right to modify prices at any time. Full payment or a required deposit must be made to initiate bespoke orders.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">3. Shipping and Delivery</h3>
            <p>We ship globally. Delivery timelines vary based on the bespoke nature of your order. We will provide estimated delivery dates, but we are not liable for delays caused by customs or courier services.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">4. Returns and Exchanges</h3>
            <p>Given the custom and bespoke nature of our garments, we generally do not accept returns. However, if a product arrives damaged or significantly flawed, please contact us within 48 hours of delivery for an assessment.</p>
            
            <h3 className="text-sm font-bold mt-6 mb-2">5. Intellectual Property</h3>
            <p>All designs, patterns, imagery, and content on this website are the intellectual property of Eliswa and may not be reproduced without prior written consent.</p>
          </div>
        }
      />
    </footer>
  );
}
