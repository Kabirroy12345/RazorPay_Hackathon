import React, { useState } from 'react';
import { Zap, Lock } from 'lucide-react';

interface NavbarProps {
  onJudgePass: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJudgePass, onOpenAuthModal }) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { label: '01. BOTTLENECK', href: '#problem' },
    { label: '02. PIPELINE', href: '#pipeline' },
    { label: '03. HYBRID', href: '#hybrid' },
    { label: '04. BUNDLE LAB', href: '#bundle' },
    { label: '05. ANOMALIES', href: '#exceptions' },
    { label: '06. MODULES', href: '#modules' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        backgroundColor: 'rgba(5, 7, 14, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0, 210, 255, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
      }}
    >
      {/* Left Brand Lockup: Bespoke 3-Way Reconciliation Nexus Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          {/* Custom 3-Way Convergence SVG Logo */}
          <div
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 210, 255, 0.5))' }}>
              <defs>
                <linearGradient id="logoGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D2FF" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <linearGradient id="logoGradViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="logoGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Node 1: Bank (Top) */}
              <polygon points="20,4 28,18 12,18" fill="url(#logoGradCyan)" opacity="0.9" />
              {/* Node 2: Gateway (Bottom Right) */}
              <polygon points="32,22 38,34 22,34" fill="url(#logoGradViolet)" opacity="0.9" />
              {/* Node 3: ERP (Bottom Left) */}
              <polygon points="8,22 18,34 2,34" fill="url(#logoGradEmerald)" opacity="0.9" />
              {/* Central Convergence Core */}
              <circle cx="20" cy="24" r="4.5" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 6px #00D2FF)' }} />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.08rem', fontWeight: 900, letterSpacing: '0.06em', color: '#FFFFFF' }}>
                OMNISETTLE
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.08rem', fontWeight: 900, color: '#00D2FF' }}>
                .AI
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93', letterSpacing: '0.08em' }} className="desktop-nav-links">
              AUTONOMOUS 3-WAY ENGINE
            </div>
          </div>
        </a>

        {/* Live Engine Telemetry Badge */}
        <div
          className="desktop-nav-links"
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '0.3rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#10B981', fontWeight: 800 }}>
            ENGINE LIVE &lt;1.2ms
          </span>
        </div>
      </div>

      {/* Center Navigation Links with Glowing Hover */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }} className="desktop-nav-links">
        {navLinks.map((link) => {
          const isHovered = hoveredLink === link.label;
          return (
            <a
              key={link.label}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.label)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: isHovered ? '#00D2FF' : '#8E8E93',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.4rem 0.2rem',
                transition: 'all 0.2s ease',
              }}
            >
              {link.label}
              {isHovered && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#00D2FF',
                    boxShadow: '0 0 8px #00D2FF',
                    borderRadius: '1px',
                  }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right Action CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* 1-Click Judge Pass Button */}
        <button
          onClick={onJudgePass}
          style={{
            background: 'linear-gradient(135deg, #00D2FF 0%, #0284C7 100%)',
            border: 'none',
            color: '#000000',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: '0.78rem',
            padding: '0.55rem 1.15rem',
            borderRadius: '7px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 0 25px rgba(0, 210, 255, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 210, 255, 0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 210, 255, 0.45)';
          }}
        >
          <Zap size={15} color="#000000" /> ⚡ 1-CLICK JUDGE PASS
        </button>

        {/* Operator Login Button */}
        <button
          onClick={onOpenAuthModal}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#EDEDED',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            fontWeight: 600,
            padding: '0.55rem 1rem',
            borderRadius: '7px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = '#00D2FF';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#EDEDED';
          }}
        >
          <Lock size={13} /> OPERATOR LOGIN
        </button>
      </div>
    </header>
  );
};
