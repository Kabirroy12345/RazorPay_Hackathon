import React, { useState, useEffect } from 'react';

interface LoadingSplashViewProps {
  onComplete: () => void;
}

export const LoadingSplashView: React.FC<LoadingSplashViewProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 6) + 3;
        return Math.min(100, next);
      });
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#181014',
        backgroundImage: `
          radial-gradient(ellipse 90% 60% at 50% 35%, #351c27 0%, #1c1118 45%, #0f090d 100%)
        `,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem 3.5rem',
        overflow: 'hidden',
        color: '#F4ECE4',
        fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Ambient Illuminated Floating Sculpture Background (Inspired by Luxuminos reference) */}
      <div
        style={{
          position: 'absolute',
          top: '32%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '640px',
          height: '320px',
          background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(245, 180, 140, 0.28) 0%, rgba(217, 119, 6, 0.15) 35%, rgba(13, 148, 136, 0) 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* TOP EDITORIAL HEADER & NAVIGATION GRID */}
      <header style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Top Eyebrow Banner */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.78rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(244, 236, 228, 0.65)',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid rgba(244, 236, 228, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <span>RAZORPAY BUILDATHON 2026</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>TRACK 04: FINTECH AI & AUTONOMOUS RECONCILIATION</span>
        </div>

        {/* Fine Category Hairline Navigation Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(244, 236, 228, 0.55)',
            padding: '0.85rem 0',
            borderBottom: '1px solid rgba(244, 236, 228, 0.08)',
          }}
        >
          <span style={{ textAlign: 'left' }}>3-WAY AUDIT</span>
          <span style={{ textAlign: 'center' }}>SUBSET-SUM SOLVER</span>
          <span style={{ textAlign: 'center' }}>GATEWAY NETTING</span>
          <span style={{ textAlign: 'center' }}>IMMUTABLE LEDGER</span>
          <span style={{ textAlign: 'right' }}>ENTERPRISE GAAP</span>
        </div>
      </header>

      {/* CENTER STAGE: SCULPTURAL GLOW & OFFICIAL RAZORPAY BRANDING */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto 0',
          width: '100%',
        }}
      >
        {/* Sculptural Lighting Installation with warm interior glow */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
          }}
        >
          {/* Luminous undulating wave sculpture SVG inspired by the reference light fixture */}
          <svg
            width="420"
            height="180"
            viewBox="0 0 420 180"
            fill="none"
            style={{
              filter: 'drop-shadow(0 15px 35px rgba(245, 180, 140, 0.35))',
            }}
          >
            <defs>
              <linearGradient id="sculptureSurface" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF7EE" />
                <stop offset="45%" stopColor="#F5D9C4" />
                <stop offset="100%" stopColor="#DF9F82" />
              </linearGradient>
              <linearGradient id="warmInteriorGlow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#EA580C" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Left Sculptural Wave Lamp */}
            <path
              d="M 30 90 Q 60 40, 110 50 Q 160 60, 190 100 Q 170 145, 120 140 Q 60 135, 30 90 Z"
              fill="url(#sculptureSurface)"
            />
            <ellipse cx="110" cy="100" rx="45" ry="22" fill="url(#warmInteriorGlow)" />

            {/* Right Sculptural Wave Lamp */}
            <path
              d="M 170 95 Q 210 45, 270 55 Q 330 65, 370 105 Q 340 150, 280 145 Q 210 140, 170 95 Z"
              fill="url(#sculptureSurface)"
            />
            <ellipse cx="270" cy="105" rx="55" ry="25" fill="url(#warmInteriorGlow)" />

            {/* Suspension cords */}
            <line x1="110" y1="0" x2="110" y2="50" stroke="rgba(244, 236, 228, 0.4)" strokeWidth="1" />
            <line x1="270" y1="0" x2="270" y2="55" stroke="rgba(244, 236, 228, 0.4)" strokeWidth="1" />
          </svg>

          {/* PROMINENT OFFICIAL RAZORPAY BRANDING */}
          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {/* High-Resolution Razorpay Presentation Card */}
            <div
              style={{
                background: '#FFFFFF',
                padding: '0.9rem 2.4rem',
                borderRadius: '12px',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45), 0 0 35px rgba(12, 131, 253, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <img
                src="/razorpay-logo.png"
                alt="Razorpay"
                style={{
                  height: '38px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(244, 236, 228, 0.7)',
                marginTop: '0.4rem',
              }}
            >
              OFFICIAL SETTLEMENT ENGINE PARTNER
            </div>
          </div>
        </div>

        {/* 3-COLUMN EDITORIAL METADATA (Matching the reference layout) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            width: '100%',
            maxWidth: '1200px',
            marginTop: '1rem',
            fontSize: '0.8rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(244, 236, 228, 0.6)',
            alignItems: 'flex-end',
          }}
        >
          {/* Left Column */}
          <div style={{ textAlign: 'left', lineHeight: 1.5 }}>
            <span style={{ display: 'block', color: '#F4ECE4', fontWeight: 600 }}>AUTONOMOUS 3-WAY AUDIT</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(244, 236, 228, 0.45)' }}>FOR HIGH-VOLUME SETTLEMENTS</span>
          </div>

          {/* Center Column */}
          <div style={{ textAlign: 'center', fontStyle: 'italic', textTransform: 'none', fontSize: '0.95rem', color: '#F5D9C4', fontFamily: 'serif' }}>
            Proving the math behind every rupee.
          </div>

          {/* Right Column */}
          <div style={{ textAlign: 'right', lineHeight: 1.5 }}>
            <span style={{ display: 'block', color: '#F4ECE4', fontWeight: 600 }}>100% GROUND TRUTH MATCH</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(244, 236, 228, 0.45)' }}>ZERO TOKEN OVERHEAD ON CLEAN 1:1</span>
          </div>
        </div>
      </main>

      {/* BOTTOM SECTION: GIANT "OMNISETTLE" DISPLAY TYPOGRAPHY & ELEGANT LOADING BAR */}
      <footer style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Giant Monolith Title (Inspired by "LUXUMINOS" in the reference image) */}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            overflow: 'hidden',
            lineHeight: 0.85,
            paddingBottom: '0.5rem',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(4rem, 13vw, 11rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#F4ECE4',
              textTransform: 'uppercase',
              userSelect: 'none',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.35)',
            }}
          >
            OMNISETTLE
          </h1>
        </div>

        {/* Refined Hairline Loading Bar & Precision Counter */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            width: '100%',
            maxWidth: '100%',
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(244, 236, 228, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              color: 'rgba(244, 236, 228, 0.6)',
              textTransform: 'uppercase',
            }}
          >
            <span>SYSTEM INITIALIZATION</span>
            <span style={{ color: '#F5D9C4', fontWeight: 600 }}>{progress}%</span>
          </div>

          {/* Hairline Progress Track */}
          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'rgba(244, 236, 228, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #DF9F82 0%, #F5D9C4 50%, #FFF7EE 100%)',
                boxShadow: '0 0 10px rgba(245, 217, 196, 0.8)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};
