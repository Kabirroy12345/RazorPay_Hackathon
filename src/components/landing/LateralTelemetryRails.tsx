import React, { useState, useEffect } from 'react';
import { useLandingTheme } from '../../context/LandingThemeContext';

const SECTIONS = [
  { id: 'hero', label: '01 // HERO', href: '#' },
  { id: 'problem', label: '02 // SILOS', href: '#problem' },
  { id: 'pipeline', label: '03 // PIPELINE', href: '#pipeline' },
  { id: 'hybrid', label: '04 // DUAL-PATH', href: '#hybrid' },
  { id: 'bundle', label: '05 // MATH LAB', href: '#bundle' },
  { id: 'exceptions', label: '06 // SONAR', href: '#exceptions' },
  { id: 'modules', label: '07 // SUITE', href: '#modules' },
];

export const LateralTelemetryRails: React.FC = () => {
  const { themeConfig } = useLandingTheme();
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 300;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = SECTIONS[i];
        if (sec.id === 'hero') continue;
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sec.id);
          return;
        }
      }
      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* LEFT TELEMETRY CONDUIT (Widescreen Only)                          */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="widescreen-lateral-rail"
        style={{
          position: 'fixed',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Top Micro Coordinate */}
        <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#64748B', letterSpacing: '0.15em' }}>
          NODE // BLR-DC-01
        </div>

        {/* Vertical Glowing Energy Conduits */}
        <div style={{ position: 'relative', width: '2px', height: '140px', background: 'rgba(255, 255, 255, 0.08)' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40px',
              background: `linear-gradient(180deg, transparent, ${themeConfig.primaryAccent}, transparent)`,
              boxShadow: `0 0 8px ${themeConfig.primaryAccent}`,
              animation: 'telemetryPulse 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Live Feeds Status Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'center' }}>
          {[
            { label: 'BANK', color: '#00D2FF' },
            { label: 'RZP', color: '#EC4899' },
            { label: 'ERP', color: '#10B981' },
          ].map((feed) => (
            <div
              key={feed.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(5, 8, 18, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.25rem 0.45rem',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: '#94A3B8',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: feed.color, boxShadow: `0 0 6px ${feed.color}` }} />
              <span>{feed.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Laser Line */}
        <div style={{ width: '2px', height: '60px', background: 'rgba(255, 255, 255, 0.08)' }} />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* RIGHT QUICK-NAV DOCK (Widescreen Only)                            */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="widescreen-lateral-rail"
        style={{
          position: 'fixed',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.75rem',
          userSelect: 'none',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#64748B', letterSpacing: '0.1em', marginBottom: '0.25rem', paddingRight: '0.2rem' }}>
          NAV // STAGES
        </div>

        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={sec.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                textDecoration: 'none',
                padding: '0.2rem',
                transition: 'all 0.2s',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: isActive ? themeConfig.primaryAccent : '#64748B',
                  fontWeight: isActive ? 800 : 500,
                  opacity: isActive ? 1 : 0.6,
                  transition: 'all 0.2s',
                }}
              >
                {sec.label}
              </span>
              <span
                style={{
                  width: isActive ? '9px' : '6px',
                  height: isActive ? '9px' : '6px',
                  borderRadius: '50%',
                  background: isActive ? themeConfig.primaryAccent : 'rgba(255, 255, 255, 0.2)',
                  boxShadow: isActive ? `0 0 10px ${themeConfig.primaryAccent}` : 'none',
                  transition: 'all 0.2s',
                }}
              />
            </a>
          );
        })}
      </div>
    </>
  );
};
