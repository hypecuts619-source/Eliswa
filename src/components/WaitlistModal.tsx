import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useState } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:eliswaindia@gmail.com?subject=Waitlist Request: The Onam Edit&body=Please add me to the waitlist. My email is: ${email}`;
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setSubmitted(false);
          setEmail('');
        }, 500);
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-vintage/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%', scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '100%', scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-cream border border-vintage/20 shadow-2xl shadow-vintage/20 w-full max-w-md p-8 relative pointer-events-auto">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-vintage/60 hover:text-vintage transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="font-logo-ew text-4xl mb-2 text-vintage">EW</div>
                <h3 className="font-display text-3xl text-vintage mb-2">The Onam Edit</h3>
                <p className="text-vintage/70 font-light">Be the first to experience our upcoming bespoke collection.</p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email Address"
                      required
                      className="w-full bg-transparent border-b border-vintage/30 px-4 py-3 text-vintage placeholder:text-vintage/40 focus:outline-none focus:border-vintage transition-colors font-light"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-10 py-4 bg-vintage text-white border-2 border-vintage hover:bg-transparent hover:text-vintage transition-all duration-500 tracking-widest uppercase text-sm font-medium"
                  >
                    Join the Waitlist
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <p className="font-display italic text-2xl text-vintage mb-2">Thank you</p>
                  <p className="text-vintage/70 font-light">You have been added to our exclusive waitlist.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
