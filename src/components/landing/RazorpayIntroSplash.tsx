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
    // Show zoomed logo over the cinematic Buildathon desk for 2.6 seconds, then fade into the landing page
    const timer = setTimeout(handleFinish, 2600);
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
            backgroundColor: '#050814',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* Layer 1: Cinematic Razorpay Buildathon Developer Desk Atmosphere */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.06 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/razorpay-buildathon-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 60%',
              filter: 'brightness(0.72) contrast(1.15) saturate(1.1)',
            }}
          />

          {/* Layer 2: Targeted Top-Right Vignette (Permanently Covers 'sound', 'Tracks', 'Apply now') */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '450px',
              height: '110px',
              background: 'radial-gradient(ellipse at top right, rgba(5, 8, 20, 0.98) 50%, rgba(5, 8, 20, 0.7) 75%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Layer 3: Top Perimeter Shadow Banner */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: 'linear-gradient(180deg, rgba(4, 6, 16, 0.92) 0%, rgba(4, 6, 16, 0.4) 60%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />

          {/* Layer 4: Deep Peripheral Radial Vignette to Focus on Center */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(5, 8, 20, 0.25) 0%, rgba(4, 6, 16, 0.85) 85%)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />

          {/* Layer 5: Radiant Sapphire Spotlight Aura */}
          <div
            style={{
              position: 'absolute',
              width: '800px',
              height: '800px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(12, 50, 110, 0.6) 0%, rgba(5, 8, 20, 0) 70%)',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          />

          {/* Layer 6: Cinematic Expanding Laser Rings */}
          <motion.div
            animate={{ scale: [0.92, 1.35, 0.92], opacity: [0.3, 0.75, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '560px',
              height: '560px',
              borderRadius: '50%',
              border: '2px solid rgba(0, 210, 255, 0.45)',
              boxShadow: '0 0 50px rgba(0, 210, 255, 0.35)',
              pointerEvents: 'none',
              zIndex: 7,
            }}
          />
          <motion.div
            animate={{ scale: [1.1, 1.65, 1.1], opacity: [0.2, 0.55, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{
              position: 'absolute',
              width: '680px',
              height: '680px',
              borderRadius: '50%',
              border: '1.5px dashed rgba(12, 140, 233, 0.4)',
              pointerEvents: 'none',
              zIndex: 7,
            }}
          />

          {/* Layer 7: Zoomed Big Razorpay Logo Card */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 15 }}
            animate={{ scale: [0.7, 1.06, 1], opacity: 1, y: 0 }}
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
              border: '1px solid rgba(255, 255, 255, 0.3)',
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
