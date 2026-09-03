import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RazorpayIntroSplashProps {
  onComplete: () => void;
}

export const RazorpayIntroSplash: React.FC<RazorpayIntroSplashProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 600); // Allow fade-out animation to complete
  }, [onComplete]);

  useEffect(() => {
    // Show zoomed logo for 2.4 seconds, then fade into the landing page
    const timer = setTimeout(handleFinish, 2400);
    return () => clearTimeout(timer);
  }, [handleFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleFinish}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#04060E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* Radiant Deep Blue Background Glow */}
          <div
            style={{
              position: 'absolute',
              width: '800px',
              height: '800px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(12, 45, 90, 0.85) 0%, rgba(2, 5, 15, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Cinematic Expanding Laser Aura */}
          <motion.div
            animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.25, 0.7, 0.25] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              border: '2px solid rgba(0, 210, 255, 0.4)',
              boxShadow: '0 0 60px rgba(0, 210, 255, 0.3)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ scale: [1.1, 1.7, 1.1], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{
              position: 'absolute',
              width: '720px',
              height: '720px',
              borderRadius: '50%',
              border: '1.5px dashed rgba(124, 58, 237, 0.35)',
              pointerEvents: 'none',
            }}
          />

          {/* Zoomed Big Razorpay Logo */}
          <motion.div
            initial={{ scale: 0.65, opacity: 0 }}
            animate={{ scale: [0.65, 1.08, 1], opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              zIndex: 10,
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '2.5rem 5rem',
              boxShadow: '0 35px 100px rgba(0, 0, 0, 0.95), 0 0 80px rgba(0, 210, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '90vw',
            }}
          >
            <img
              src="/razorpay-logo.png"
              alt="Razorpay"
              style={{
                height: 'clamp(70px, 12vw, 120px)',
                width: 'auto',
                maxWidth: 'min(80vw, 520px)',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
