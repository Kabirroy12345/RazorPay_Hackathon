import React, { useState } from 'react';
import { Zap, Palette } from 'lucide-react';
import { useLandingTheme, THEME_CONFIGS, type LandingThemeMode } from '../../context/LandingThemeContext';

interface NavbarProps {
  onJudgePass: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJudgePass, onOpenAuthModal }) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { theme, themeConfig, setTheme } = useLandingTheme();

  const navLinks = [
    { label: '01. BOTTLENECK', href: '#problem' },
    { label: '02. PIPELINE', href: '#pipeline' },
    { label: '03. HYBRID', href: '#hybrid' },
    { label: '04. BUNDLE LAB', href: '#bundle' },
    { label: '05. ANOMALIES', href: '#exceptions' },
    { label: '06. MODULES', href: '#modules' },
  ];

  const themesList: LandingThemeMode[] = ['cosmic', 'stealth', 'razorpay', 'hyperion'];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: 'rgba(5, 7, 14, 0.75)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        borderBottom: `1px solid ${themeConfig.borderSubtle}`,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 1px 0 ${themeConfig.glowColor}`,
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
            <svg width="38" height="38" viewBox="0 0 40 40" fill="none" style={{ filter: `drop-shadow(0 0 10px ${themeConfig.primaryAccent})` }}>
              <defs>
                <linearGradient id="navLogoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={themeConfig.primaryAccent} />
                  <stop offset="100%" stopColor={themeConfig.secondaryAccent} />
                </linearGradient>
              </defs>

              {/* Node 1: Bank (Top) */}
              <polygon points="20,4 28,18 12,18" fill="url(#navLogoGrad1)" opacity="0.95" />
              {/* Node 2: Gateway (Bottom Right) */}
              <polygon points="32,22 38,34 22,34" fill={themeConfig.secondaryAccent} opacity="0.9" />
              {/* Node 3: ERP (Bottom Left) */}
              <polygon points="8,22 18,34 2,34" fill={themeConfig.primaryAccent} opacity="0.8" />
              {/* Central Convergence Core */}
              <circle cx="20" cy="24" r="4.5" fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 6px ${themeConfig.primaryAccent})` }} />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.08rem', fontWeight: 900, letterSpacing: '0.1em', color: '#FFFFFF' }}>
                OMNISETTLE
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.08rem', fontWeight: 900, color: themeConfig.primaryAccent }}>
                .AI
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93', letterSpacing: '0.08em' }} className="desktop-nav-links">
              AUTONOMOUS 3-WAY ENGINE
            </div>
          </div>
        </a>
      </div>

      {/* Center Navigation Links with Glowing Hover */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav-links">
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
                color: isHovered ? themeConfig.primaryAccent : '#8E8E93',
                textDecoration: 'none',
                position: 'relative',
                padding: '0.4rem 0.2rem',
                paddingBottom: '0.25rem',
                borderBottom: isHovered ? '2px solid ' + themeConfig.primaryAccent : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      {/* Right Controls: Theme Switcher + CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Dynamic Multi-Theme Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${themeConfig.primaryAccent}40`,
              borderRadius: '7px',
              padding: '0.45rem 0.75rem',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s',
            }}
          >
            <Palette size={14} color={themeConfig.primaryAccent} />
            <span>{themeConfig.badge}</span>
          </button>

          {/* Theme Dropdown Menu */}
          {showThemeMenu && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#070A14',
                border: `1px solid ${themeConfig.borderSubtle}`,
                borderRadius: '8px',
                padding: '0.4rem',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                zIndex: 10000,
                minWidth: '150px',
              }}
            >
              {themesList.map((t) => {
                const conf = THEME_CONFIGS[t];
                const isSelected = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      setShowThemeMenu(false);
                    }}
                    style={{
                      background: isSelected ? `${conf.primaryAccent}20` : 'transparent',
                      border: isSelected ? `1px solid ${conf.primaryAccent}` : '1px solid transparent',
                      borderRadius: '6px',
                      padding: '0.45rem 0.65rem',
                      color: isSelected ? conf.primaryAccent : '#8E8E93',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      fontWeight: isSelected ? 800 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: conf.primaryAccent }} />
                    <span>{conf.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Judge Evaluation Pass Button */}
        <button
          onClick={onJudgePass}
          style={{
            background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
            border: `1px solid ${themeConfig.primaryAccent}88`,
            color: '#FFFFFF',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '0.82rem',
            padding: '0.45rem 1.05rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: `0 2px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 16px ${themeConfig.glowColor}`,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.borderColor = themeConfig.primaryAccent;
            e.currentTarget.style.boxShadow = `0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 24px ${themeConfig.glowColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = `${themeConfig.primaryAccent}88`;
            e.currentTarget.style.boxShadow = `0 2px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 16px ${themeConfig.glowColor}`;
          }}
        >
          <Zap size={14} color={themeConfig.primaryAccent} />
          <span>Judge Evaluation Pass</span>
        </button>

        {/* Sign In Button */}
        <button
          onClick={onOpenAuthModal}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#CBD5E1',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
            fontWeight: 500,
            padding: '0.45rem 0.95rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#CBD5E1';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          }}
        >
          <span>Sign In</span>
        </button>
      </div>
    </header>
  );
};
