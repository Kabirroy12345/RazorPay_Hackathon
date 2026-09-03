import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';

interface RazorpayIntroSplashProps {
  onComplete: () => void;
}

export const RazorpayIntroSplash: React.FC<RazorpayIntroSplashProps> = ({ onComplete }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 600); // Allow fade-out animation to finish
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
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#05070E',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {/* Radiant Background Spotlight */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(12, 35, 64, 0.8) 0%, rgba(2, 4, 10, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Concentric Laser Pulse Rings */}
          <motion.div
            animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              border: '1.5px solid rgba(0, 210, 255, 0.35)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ scale: [1.1, 1.6, 1.1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{
              position: 'absolute',
              width: '520px',
              height: '520px',
              borderRadius: '50%',
              border: '1px dashed rgba(124, 58, 237, 0.35)',
              pointerEvents: 'none',
            }}
          />

          {/* Central Logo Lockup */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Authentic Razorpay Logo Container */}
            <div
              style={{
                position: 'relative',
                padding: '1.5rem 2.5rem',
                background: 'rgba(10, 14, 25, 0.85)',
                border: '1px solid rgba(0, 210, 255, 0.4)',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 45px rgba(0, 210, 255, 0.25)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              {/* Razorpay Brand Image */}
              <img
                src="/razorpay-logo.png"
                alt="Razorpay"
                style={{
                  height: '48px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 15px rgba(0, 210, 255, 0.5))',
                }}
                onError={(e) => {
                  // Fallback SVG mark if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = document.getElementById('rzp-fallback-mark');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />

              {/* Fallback Vector Emblem */}
              <div
                id="rzp-fallback-mark"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#00D2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={24} color="#000" />
                </div>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                  Razorpay
                </span>
              </div>
            </div>

            {/* Hackathon Track Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D2FF', boxShadow: '0 0 10px #00D2FF' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#00D2FF', letterSpacing: '0.15em', fontWeight: 800 }}>
                RAZORPAY BUILDATHON 2026 • TRACK 04
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: '0 0 0.5rem',
              }}
            >
              Autonomous 3-Way Reconciliation
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#8E8E93', margin: '0 0 2rem', maxWidth: '420px', lineHeight: 1.5 }}>
              Connecting Bank Statements, Razorpay Gateway settlements, and ERP General Ledgers with zero-delta proof.
            </p>

            {/* 3-Second Loading Progress Bar */}
            <div style={{ width: '280px', position: 'relative' }}>
              <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #00D2FF 0%, #7C3AED 100%)',
                    boxShadow: '0 0 12px #00D2FF',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', marginTop: '0.6rem' }}>
                <span>INITIALIZING ENGINE...</span>
                <span style={{ color: '#00D2FF', fontWeight: 800 }}>{secondsRemaining}s</span>
              </div>
            </div>

            {/* Skip Intro Button */}
            <button
              onClick={handleFinish}
              style={{
                marginTop: '1.5rem',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
            >
              SKIP INTRO <ArrowRight size={12} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
