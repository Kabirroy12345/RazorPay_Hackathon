import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Activity, Zap } from 'lucide-react';

interface LoadingSplashViewProps {
  onComplete: () => void;
}

const STATUS_MESSAGES = [
  'CONNECTING_TO_RAZORPAY_SETTLEMENT_GATEWAY...',
  'SYNCHRONIZING_3_WAY_LEDGER_PROTOCOLS...',
  'CALIBRATING_CLAUDE_3.5_AGENTIC_PROOFER...',
  'VERIFYING_GAAP_COMPLIANCE_SIGNATURES...',
  'INITIALIZATION_COMPLETE. LAUNCHING_OMNISETTLE...',
];

export const LoadingSplashView: React.FC<LoadingSplashViewProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);
        const nextStatus = Math.min(
          STATUS_MESSAGES.length - 1,
          Math.floor((next / 100) * STATUS_MESSAGES.length)
        );
        setStatusIndex(nextStatus);
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#05070B',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {/* Background Topographic Wave Contours (Inspired by design reference) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="topoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="topoGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Topographic Contours */}
        <path
          d="M 200 450 C 350 250, 600 220, 800 320 C 1000 420, 1200 300, 1350 480 C 1450 600, 1100 800, 850 720 C 600 640, 350 780, 200 620 Z"
          stroke="url(#topoGradient1)"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
        <path
          d="M 260 460 C 390 290, 610 260, 780 350 C 950 440, 1140 330, 1270 490 C 1360 600, 1060 750, 830 680 C 600 610, 390 730, 260 590 Z"
          stroke="url(#topoGradient2)"
          strokeWidth="1.8"
        />
        <path
          d="M 330 470 C 430 330, 620 300, 760 380 C 900 460, 1080 370, 1190 500 C 1270 590, 1020 700, 810 640 C 610 580, 430 680, 330 560 Z"
          stroke="url(#topoGradient1)"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          d="M 400 480 C 480 370, 640 350, 750 410 C 860 470, 1010 400, 1100 510 C 1170 590, 970 660, 790 610 C 610 560, 480 630, 400 540 Z"
          stroke="url(#topoGradient2)"
          strokeWidth="2.2"
        />
        <path
          d="M 480 490 C 540 410, 670 400, 740 440 C 810 480, 930 440, 1000 510 C 1050 560, 910 610, 760 580 C 620 550, 520 590, 480 520 Z"
          stroke="url(#topoGradient1)"
          strokeWidth="2.5"
          filter="url(#glow)"
        />
        <path
          d="M 560 495 C 600 445, 690 440, 730 465 C 770 490, 850 470, 890 510 C 920 540, 840 570, 740 550 C 640 530, 580 550, 560 510 Z"
          stroke="url(#topoGradient2)"
          strokeWidth="3"
        />
      </svg>

      {/* Floating Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%)',
          top: '20%',
          left: '15%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          bottom: '15%',
          right: '15%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar with Skip Action */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2.5rem',
          right: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* Track Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 0.9rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7', boxShadow: '0 0 8px #0284c7' }}></span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
            RAZORPAY BUILDATHON 2026 • TRACK 04
          </span>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="font-mono"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e2e8f0',
            fontSize: '0.75rem',
            padding: '0.45rem 1rem',
            borderRadius: '9999px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#0284c7';
            e.currentTarget.style.color = '#38bdf8';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#e2e8f0';
          }}
        >
          SKIP_INTRO <ArrowRight size={13} />
        </button>
      </div>

      {/* Center Cinematic Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '680px',
          padding: '0 1.5rem',
        }}
      >
        {/* Dual Razorpay & OmniSettle Emblem Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}
        >
          {/* Razorpay Logo Box */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              boxShadow: '0 0 35px rgba(2, 132, 199, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/razorpay-logo.png"
              alt="Razorpay"
              style={{ height: '26px', objectFit: 'contain' }}
            />
          </div>

          <span className="font-mono" style={{ color: '#64748b', fontSize: '1.1rem' }}>✕</span>

          {/* OmniSettle Shield Emblem */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={26} color="#38bdf8" />
          </div>
        </div>

        {/* Project Title */}
        <h1
          className="font-mono"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: '#ffffff',
            margin: '0 0 0.5rem 0',
            textShadow: '0 0 40px rgba(56, 189, 248, 0.4)',
          }}
        >
          OMNISETTLE<span style={{ color: '#38bdf8' }}>.AI</span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-mono"
          style={{
            fontSize: '0.85rem',
            letterSpacing: '0.18em',
            color: '#94a3b8',
            margin: '0 0 2.5rem 0',
            textTransform: 'uppercase',
          }}
        >
          Autonomous 3-Way Financial Reconciliation Engine
        </p>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            marginBottom: '1.25rem',
          }}
        >
          {/* Progress Bar Track */}
          <div
            style={{
              width: '100%',
              height: '5px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #a855f7 100%)',
                boxShadow: '0 0 16px #38bdf8',
                borderRadius: '9999px',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>

        {/* Live Telemetry Status Line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '440px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#38bdf8' }}>
            <Activity size={13} className="pulse-indicator" />
            <span style={{ letterSpacing: '0.04em' }}>{STATUS_MESSAGES[statusIndex]}</span>
          </div>

          <span style={{ color: '#e2e8f0', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: '#64748b',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Zap size={12} color="#0284c7" />
        <span>SECURE HIGH-FREQUENCY LEDGER CLEARING FOR RAZORPAY MERCHANTS</span>
      </div>
    </div>
  );
};
