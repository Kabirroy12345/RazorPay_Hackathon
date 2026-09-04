import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RazorpayIntroSplashProps {
  onComplete: () => void;
}

export const RazorpayIntroSplash: React.FC<RazorpayIntroSplashProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [statusText, setStatusText] = useState<string>('INIT // 3-WAY LEDGER PROTOCOL');

  const handleFinish = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 650);
  }, [onComplete]);

  useEffect(() => {
    // Dynamic status text updates
    const t1 = setTimeout(() => setStatusText('FAST-PATH // CALIBRATING <1.2ms PIPELINE'), 1100);
    const t2 = setTimeout(() => setStatusText('READY // LAUNCHING OMNISETTLE ENGINE'), 2200);
    const tEnd = setTimeout(handleFinish, 3400);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleFinish}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#030712',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {/* ========================================================================= */}
          {/* 1. ATMOSPHERIC BACKDROP: VIGNETTE & RADIAL NEBULA                          */}
          {/* ========================================================================= */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 45%, rgba(12, 140, 233, 0.14) 0%, rgba(3, 7, 18, 0.7) 55%, #030712 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Perspective Cybernetic Floor Grid */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '-20%',
              right: '-20%',
              height: '48%',
              backgroundImage: `
                linear-gradient(to right, rgba(12, 140, 233, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(12, 140, 233, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(65deg)',
              transformOrigin: 'bottom center',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 85%)',
              pointerEvents: 'none',
            }}
          />

          {/* Luminous Center Orb */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '650px',
              height: '650px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(12, 140, 233, 0.22) 0%, rgba(99, 102, 241, 0.06) 45%, transparent 70%)',
              pointerEvents: 'none',
              filter: 'blur(30px)',
            }}
          />

          {/* Floating Micro Light Embers */}
          {[
            { top: '22%', left: '28%', delay: 0.2, size: 3 },
            { top: '35%', left: '72%', delay: 0.5, size: 2.5 },
            { top: '68%', left: '32%', delay: 0.8, size: 2 },
            { top: '60%', left: '68%', delay: 1.1, size: 3 },
            { top: '25%', left: '62%', delay: 0.4, size: 2 },
            { top: '48%', left: '18%', delay: 0.7, size: 2.5 },
            { top: '42%', left: '82%', delay: 0.9, size: 2 },
          ].map((ember, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: [0, 0.8, 0], y: [-10, -50] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: ember.delay, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: ember.top,
                left: ember.left,
                width: `${ember.size}px`,
                height: `${ember.size}px`,
                borderRadius: '50%',
                backgroundColor: '#38BDF8',
                boxShadow: '0 0 10px #38BDF8',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* ========================================================================= */}
          {/* 2. TOP STATUS PILL: BUILDATHON TRACK INFO                                 */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{
              position: 'relative',
              zIndex: 10,
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(12, 140, 233, 0.08)',
              border: '1px solid rgba(12, 140, 233, 0.28)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 10px #10B981',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                color: '#E2E8F0',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Razorpay Buildathon 2026
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.7rem' }}>•</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                color: '#38BDF8',
                fontWeight: 600,
              }}
            >
              TRACK 04: FINTECH AI
            </span>
          </motion.div>

          {/* ========================================================================= */}
          {/* 3. CENTERPIECE: OFFICIAL RAZORPAY BRAND IDENTITY                          */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Ambient Backing Glow specific to the logo */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '140%',
                background: 'radial-gradient(ellipse at center, rgba(12, 140, 233, 0.3) 0%, transparent 70%)',
                filter: 'blur(35px)',
                pointerEvents: 'none',
                zIndex: -1,
              }}
            />

            {/* Official Transparent Dark-Mode Razorpay Logo */}
            <div style={{ position: 'relative', overflow: 'hidden', padding: '0.5rem 1.5rem' }}>
              <img
                src="/razorpay-brand-dark.png"
                alt="Razorpay"
                style={{
                  height: 'clamp(52px, 8.5vw, 84px)',
                  width: 'auto',
                  maxWidth: 'min(82vw, 460px)',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 0 28px rgba(12, 140, 233, 0.65))',
                }}
              />

              {/* Shimmer Light Reflection Sweep */}
              <motion.div
                initial={{ x: '-120%' }}
                animate={{ x: '220%' }}
                transition={{ duration: 1.4, delay: 0.8, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '60px',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  transform: 'skewX(-25deg)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Glowing Conduit Connector */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'min(380px, 75vw)',
                margin: '1.25rem 0 1.25rem',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(12, 140, 233, 0.6), transparent)',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  transform: 'rotate(45deg)',
                  backgroundColor: '#0C8CE9',
                  boxShadow: '0 0 12px #0C8CE9',
                  margin: '0 1rem',
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(12, 140, 233, 0.6), transparent)',
                }}
              />
            </div>

            {/* OmniSettle AI Signature Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(1.2rem, 3.2vw, 1.85rem)',
                    fontWeight: 900,
                    letterSpacing: '0.16em',
                    color: '#FFFFFF',
                    textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  OMNISETTLE
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(1.2rem, 3.2vw, 1.85rem)',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    color: '#0C8CE9',
                    textShadow: '0 0 20px rgba(12, 140, 233, 0.7)',
                  }}
                >
                  .AI
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.72rem, 1.4vw, 0.92rem)',
                  color: '#94A3B8',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                Autonomous 3-Way Financial Reconciliation Engine
              </div>
            </motion.div>
          </motion.div>

          {/* ========================================================================= */}
          {/* 4. PROGRESS BAR & DYNAMIC TELEMETRY LOGS                                  */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              position: 'absolute',
              bottom: '3.5rem',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              width: 'min(360px, 80vw)',
            }}
          >
            {/* Real-time Telemetry Status Text */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: '#38BDF8',
                letterSpacing: '0.12em',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#38BDF8',
                  boxShadow: '0 0 8px #38BDF8',
                  animation: 'telemetryPulse 1.2s infinite ease-in-out',
                }}
              />
              <span>{statusText}</span>
            </div>

            {/* Precision Loading Track */}
            <div
              style={{
                width: '100%',
                height: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.6)',
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #0C8CE9 0%, #38BDF8 60%, #FFFFFF 100%)',
                  borderRadius: '999px',
                  boxShadow: '0 0 14px rgba(56, 189, 248, 0.8)',
                }}
              />
            </div>

            {/* Discrete Skip Hint */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: '#64748B',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginTop: '0.25rem',
              }}
            >
              CLICK ANYWHERE OR PRESS ESC TO ENTER
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
