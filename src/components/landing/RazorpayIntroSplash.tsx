import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface RazorpayIntroSplashProps {
  onComplete: () => void;
}

export const RazorpayIntroSplash: React.FC<RazorpayIntroSplashProps> = ({ onComplete }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 500); // Smooth fade-out before unmounting
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [handleFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#04060E',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {/* Deep Cosmic Background Spotlight */}
          <div
            style={{
              position: 'absolute',
              width: '700px',
              height: '700px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(12, 35, 64, 0.9) 0%, rgba(2, 4, 10, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Animated Neon Pulse Rings */}
          <motion.div
            animate={{ scale: [0.85, 1.35, 0.85], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              border: '2px solid rgba(0, 210, 255, 0.4)',
              boxShadow: '0 0 40px rgba(0, 210, 255, 0.25)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ scale: [1.1, 1.6, 1.1], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            style={{
              position: 'absolute',
              width: '560px',
              height: '560px',
              borderRadius: '50%',
              border: '1.5px dashed rgba(124, 58, 237, 0.4)',
              pointerEvents: 'none',
            }}
          />

          {/* Content Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 2rem',
            }}
          >
            {/* Authentic Razorpay Logo Display Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem 2.75rem',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 210, 255, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <img
                src="/razorpay-logo.png"
                alt="Razorpay"
                style={{
                  height: '54px',
                  maxWidth: '260px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Track 04 Metadata Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1rem',
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.35)',
                padding: '0.35rem 0.9rem',
                borderRadius: '20px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D2FF', boxShadow: '0 0 10px #00D2FF' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#00D2FF', letterSpacing: '0.12em', fontWeight: 800 }}>
                RAZORPAY BUILDATHON 2026 • TRACK 04
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: '0 0 0.5rem',
              }}
            >
              Autonomous 3-Way Reconciliation
            </h2>

            <p style={{ fontSize: '0.92rem', color: '#8E8E93', margin: '0 0 2rem', maxWidth: '440px', lineHeight: 1.5 }}>
              Engineered for high-volume settlements, fee audit compliance, and zero-delta mathematical verification.
            </p>

            {/* 3-Second Loading Progress Bar */}
            <div style={{ width: '300px', position: 'relative' }}>
              <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #00D2FF 0%, #7C3AED 100%)',
                    boxShadow: '0 0 15px #00D2FF',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginTop: '0.65rem' }}>
                <span>INITIALIZING ENGINE...</span>
                <span style={{ color: '#00D2FF', fontWeight: 800 }}>{secondsRemaining}s</span>
              </div>
            </div>

            {/* Skip Intro Button */}
            <button
              onClick={handleFinish}
              style={{
                marginTop: '1.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '0.45rem 1rem',
                color: '#8E8E93',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = '#00D2FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8E8E93';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              SKIP INTRO <ArrowRight size={13} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
