import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call for inquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        clearCart();
        setIsSubmitted(false);
        setIsCartOpen(false);
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-cream/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-vintage/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-vintage/10 bg-cream/30">
              <h2 className="font-display text-2xl text-vintage flex items-center gap-2">
                <ShoppingBag size={24} />
                Your Selection
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-vintage hover:bg-vintage/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-vintage/5 text-vintage/70 text-xs text-center py-2 mb-6 border border-vintage/10 tracking-widest uppercase">
                Complimentary Global Shipping on all orders
              </div>
              
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-vintage/50 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="font-light tracking-wider uppercase text-sm">Your selection is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2 border border-vintage/30 text-vintage hover:bg-vintage hover:text-white transition-all duration-300 tracking-widest uppercase text-xs"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl text-vintage">Request Sent Successfully</h3>
                  <p className="text-vintage/70 font-light max-w-[250px]">
                    Thank you for your interest. Our artisans will contact you shortly to finalize your bespoke order.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.saree.id} className="flex gap-4 p-4 border border-vintage/10 rounded-lg bg-cream/20">
                        <div 
                          className="w-20 h-24 rounded bg-cream border border-vintage/20"
                          style={{ backgroundColor: item.saree.baseColor }}
                        >
                           {/* A placeholder for the 3D element or image. Just colored box for now. */}
                           <div className="w-full h-full opacity-50" style={{ backgroundImage: `linear-gradient(45deg, ${item.saree.borderColor} 25%, transparent 25%), linear-gradient(-45deg, ${item.saree.borderColor} 25%, transparent 25%)`, backgroundSize: '10px 10px' }} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-display text-lg text-vintage leading-tight">{item.saree.name}</h4>
                            <p className="text-xs text-vintage/60 mt-1">{item.saree.material} • {item.saree.pattern}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-vintage/20 rounded">
                              <button
                                onClick={() => updateQuantity(item.saree.id, item.quantity - 1)}
                                className="p-1 text-vintage hover:bg-vintage/5"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-sm font-medium text-vintage">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.saree.id, item.quantity + 1)}
                                className="p-1 text-vintage hover:bg-vintage/5"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.saree.id)}
                              className="text-xs text-rose hover:text-red-700 underline tracking-wider"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="border-t border-vintage/10 pt-6 space-y-4">
                    <h3 className="font-display text-xl text-vintage mb-4">Inquiry Details</h3>
                    <div>
                      <input 
                        type="text" 
                        required 
                        placeholder="Full Name" 
                        className="w-full px-4 py-3 bg-white border border-vintage/20 focus:outline-none focus:border-vintage text-vintage placeholder:text-vintage/40"
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        required 
                        placeholder="Email Address" 
                        className="w-full px-4 py-3 bg-white border border-vintage/20 focus:outline-none focus:border-vintage text-vintage placeholder:text-vintage/40"
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        required 
                        placeholder="Phone Number (with country code)" 
                        className="w-full px-4 py-3 bg-white border border-vintage/20 focus:outline-none focus:border-vintage text-vintage placeholder:text-vintage/40"
                      />
                    </div>
                    <div>
                      <textarea 
                        rows={3}
                        placeholder="Any specific customizations or questions?" 
                        className="w-full px-4 py-3 bg-white border border-vintage/20 focus:outline-none focus:border-vintage text-vintage placeholder:text-vintage/40 resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-vintage text-white tracking-widest uppercase text-sm hover:bg-vintage/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Request Quote"
                      )}
                    </button>
                    <p className="text-center text-xs text-vintage/50 italic font-light pt-2">
                      No payment required at this step. Our team will contact you.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
