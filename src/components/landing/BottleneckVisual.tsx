import React, { useState, useEffect, useRef } from 'react';
import { Building2, CreditCard, FileSpreadsheet, AlertTriangle, Play, Pause } from 'lucide-react';
import { useLandingTheme } from '../../context/LandingThemeContext';

export const BottleneckVisual: React.FC = () => {
  const { themeConfig } = useLandingTheme();

  // 3D Orbital Revolution State
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const animRef = useRef<number | null>(null);

  // Simulator Sliders
  const [settlementLagDays, setSettlementLagDays] = useState<number>(3);
  const [mdrRate, setMdrRate] = useState<number>(2.5);

  // 60fps Orbital Revolution Loop
  useEffect(() => {
    const updateOrbit = () => {
      if (isRotating) {
        setOrbitAngle((prev) => (prev + 0.45) % 360);
      }
      animRef.current = requestAnimationFrame(updateOrbit);
    };

    animRef.current = requestAnimationFrame(updateOrbit);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRotating]);

  // The 3 Disconnected Silo Placards
  const silos = [
    {
      id: 0,
      badge: 'SILO 01 // BANK',
      title: 'Lump-Sum Batches',
      subtitle: 'Only registers lump-sum payouts clearing after banking cutoffs. Completely blind to transaction-level fee deductions and customer identities.',
      icon: <Building2 size={24} color="#00D2FF" />,
      color: '#00D2FF',
      metrics: [
        { label: 'RECORDED CREDITS', value: '₹48,272.80 (DELAYED T+3)' },
        { label: 'STATUS', value: '⚠️ PENDING CLEARING (72h BEHIND)', isWarning: true },
      ],
    },
    {
      id: 1,
      badge: 'SILO 02 // GATEWAY',
      title: 'Blended Deductions',
      subtitle: 'Combines multi-order settlements while stripping variable merchant discount rates (MDR), GST surcharges, and chargeback holds.',
      icon: <CreditCard size={24} color="#EC4899" />,
      color: '#EC4899',
      metrics: [
        { label: 'MDR + TAX APPLIED', value: `-₹1300.00 (${mdrRate}% Tier)` },
        { label: 'RATE VARIANCE', value: '⚠️ AUDIT GAP (CONTRACT: 2.0%)', isWarning: true },
      ],
    },
    {
      id: 2,
      badge: 'SILO 03 // ERP',
      title: 'Fragmented Invoices',
      subtitle: 'Generates individual order invoices. Completely detached from payment gateway bundle settlement batch numbers and bank clearing dates.',
      icon: <FileSpreadsheet size={24} color="#10B981" />,
      color: '#10B981',
      metrics: [
        { label: 'CUSTOMER INVOICES', value: '8 UNLINKED INVOICES (₹52,000)' },
        { label: 'REASONING', value: '⚠️ REQUIRES 1:N REASONING', isWarning: true },
      ],
    },
  ];

  // Snap placard to front on click
  const handleSnapToFront = (index: number) => {
    // Front angle is 90 degrees (sin(90) = 1)
    const targetBase = 90 - index * 120;
    setOrbitAngle((targetBase + 3600) % 360);
    setIsRotating(false);
  };

  const calculatedMDRFee = (52000 * (mdrRate / 100)).toFixed(2);
  const calculatedGST = (parseFloat(calculatedMDRFee) * 0.18).toFixed(2);
  const calculatedNet = (52000 - parseFloat(calculatedMDRFee) - parseFloat(calculatedGST) - 2500).toFixed(2);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      
      {/* ------------------------------------------------------------------- */}
      {/* 3D ORBITAL REVOLUTION STAGE (IMAGE 2 REVOLVING FEATURE)              */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '480px',
          margin: '0 auto 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1200px',
          overflow: 'visible',
        }}
        onMouseEnter={() => setIsRotating(false)}
        onMouseLeave={() => setIsRotating(true)}
      >
        {/* Orbital Track Guide Ring (Tilted 3D Ring) */}
        <div
          style={{
            position: 'absolute',
            width: '780px',
            height: '240px',
            borderRadius: '50%',
            border: `1.5px dashed ${themeConfig.primaryAccent}35`,
            boxShadow: `0 0 35px ${themeConfig.glowColor}`,
            transform: 'rotateX(68deg)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Central Gravitational Nucleus: The Disconnection Bottleneck */}
        <div
          style={{
            position: 'absolute',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(10, 14, 28, 0.95) 75%)',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '50%',
            width: '210px',
            height: '210px',
            padding: '1.25rem',
            boxShadow: '0 0 50px rgba(239, 68, 68, 0.35), inset 0 0 25px rgba(239, 68, 68, 0.2)',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem', border: '1px solid #EF4444' }}>
            <AlertTriangle size={20} color="#EF4444" />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 900, color: '#EF4444', letterSpacing: '0.08em' }}>
            DISCONNECTED CORE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#8E8E93', marginTop: '0.2rem', lineHeight: 1.3 }}>
            3 Silos Desynchronized<br />
            4-8 Hours Manual Triage
          </div>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', padding: '0.15rem 0.45rem', borderRadius: '4px', marginTop: '0.4rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            GRAVITATIONAL BOTTLENECK
          </div>
        </div>

        {/* The 3 Revolving Placards in 3D Space */}
        {silos.map((silo, index) => {
          const angleDeg = (orbitAngle + index * 120) % 360;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Elliptical coordinates with 3D tilt
          const radiusX = 370;
          const radiusY = 120;
          const x = Math.cos(angleRad) * radiusX;
          const y = Math.sin(angleRad) * radiusY;

          // Depth properties: front (sin = 1) is bigger, closer, highest z-index
          const depthFactor = (Math.sin(angleRad) + 1) / 2; // 0 (back) to 1 (front)
          const scale = 0.82 + depthFactor * 0.28; // 0.82 back, 1.10 front
          const zIndex = Math.round(depthFactor * 40) + 2;
          const opacity = 0.65 + depthFactor * 0.35; // dimmer in back, 1.0 in front

          return (
            <div
              key={silo.id}
              onClick={() => handleSnapToFront(index)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '320px',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                zIndex,
                opacity,
                transition: isRotating ? 'none' : 'transform 0.5s ease-out, opacity 0.5s ease-out',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(180deg, rgba(14, 18, 35, 0.96) 0%, rgba(6, 8, 16, 0.98) 100%)',
                  border: `1.5px solid ${silo.color}66`,
                  borderRadius: '12px',
                  padding: '1.4rem',
                  boxShadow: depthFactor > 0.6 
                    ? `0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px ${silo.color}35`
                    : '0 10px 30px rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(16px)',
                  position: 'relative',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${silo.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${silo.color}44`,
                      boxShadow: `0 0 12px ${silo.color}22`,
                    }}
                  >
                    {silo.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      color: silo.color,
                      background: `${silo.color}15`,
                      border: `1px solid ${silo.color}44`,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      fontWeight: 800,
                    }}
                  >
                    {silo.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.35rem' }}>
                  {silo.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#8E8E93', lineHeight: 1.45, margin: '0 0 1rem', minHeight: '48px' }}>
                  {silo.subtitle}
                </p>

                {/* Metrics Box */}
                <div
                  style={{
                    background: '#04060C',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  {silo.metrics.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                      <span style={{ color: '#8E8E93' }}>{m.label}:</span>
                      <strong style={{ color: m.isWarning ? '#EF4444' : '#FFFFFF' }}>{m.value}</strong>
                    </div>
                  ))}
                </div>

                {/* Front Focus Indicator */}
                {depthFactor > 0.8 && (
                  <div style={{ textAlign: 'center', marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: silo.color }}>
                    ● IN ORBITAL FOCUS
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Orbit Controls Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(8, 12, 24, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '0.6rem 1.25rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsRotating(!isRotating)}
            style={{
              background: isRotating ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${isRotating ? themeConfig.primaryAccent : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: '6px',
              padding: '0.35rem 0.75rem',
              color: isRotating ? themeConfig.primaryAccent : '#EDEDED',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {isRotating ? <Pause size={13} /> : <Play size={13} />}
            <span>{isRotating ? 'PAUSE ORBIT' : 'REVOLVE ORBIT'}</span>
          </button>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93' }}>
            CLICK ANY PLACARD TO SNAP INTO FOCUS (HOVER PAUSES)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {silos.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleSnapToFront(i)}
              style={{
                background: 'none',
                border: 'none',
                color: s.color,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                cursor: 'pointer',
                fontWeight: 800,
                textDecoration: 'underline',
              }}
            >
              [ {s.badge} ]
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SPREADSHEET BOTTLENECK SIMULATOR                                    */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(14, 18, 35, 0.95) 0%, rgba(6, 8, 16, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: themeConfig.primaryAccent, fontWeight: 800, letterSpacing: '0.1em' }}>
              INTERACTIVE DISCREPANCY STRESS TEST
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0.2rem 0 0' }}>
              Simulate How Variable Gateway Deductions Break Traditional Matching
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', padding: '0.35rem 0.75rem', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#EF4444' }}>
            <AlertTriangle size={14} /> SPREADSHEET VULNERABILITY LEVEL: CRITICAL
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Slider 1: Banking Clearing Lag */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.5rem' }}>
              <span>BANK SETTLEMENT LAG</span>
              <strong style={{ color: '#00D2FF' }}>T+{settlementLagDays} DAYS</strong>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={settlementLagDays}
              onChange={(e) => setSettlementLagDays(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: themeConfig.primaryAccent, cursor: 'pointer' }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93', marginTop: '0.4rem' }}>
              {settlementLagDays === 0 ? '✓ Real-time RTGS (Zero time skew)' : `⚠️ Cash arrives ${settlementLagDays * 24} hours after cart checkout`}
            </div>
          </div>

          {/* Slider 2: Gateway MDR Rate Variance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.5rem' }}>
              <span>GATEWAY MDR RATE</span>
              <strong style={{ color: '#EC4899' }}>{mdrRate.toFixed(1)}% FEE</strong>
            </div>
            <input
              type="range"
              min="1.5"
              max="3.5"
              step="0.1"
              value={mdrRate}
              onChange={(e) => setMdrRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#EC4899', cursor: 'pointer' }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93', marginTop: '0.4rem' }}>
              Deducted Fee: -₹{calculatedMDRFee} + 18% GST (-₹{calculatedGST})
            </div>
          </div>
        </div>

        {/* Live Calculation Output Strip */}
        <div
          style={{
            marginTop: '1.5rem',
            background: '#04060C',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <span style={{ color: '#8E8E93' }}>GROSS CART: </span>
            <strong style={{ color: '#FFFFFF' }}>₹52,000.00</strong>
          </div>
          <div>
            <span style={{ color: '#8E8E93' }}>GATEWAY DEDUCTIONS: </span>
            <strong style={{ color: '#EF4444' }}>-₹{(parseFloat(calculatedMDRFee) + parseFloat(calculatedGST)).toFixed(2)}</strong>
          </div>
          <div>
            <span style={{ color: '#8E8E93' }}>REFUNDS: </span>
            <strong style={{ color: '#EF4444' }}>-₹2,500.00</strong>
          </div>
          <div style={{ background: `${themeConfig.primaryAccent}15`, border: `1px solid ${themeConfig.primaryAccent}44`, padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
            <span style={{ color: '#8E8E93' }}>NET SETTLED CASH: </span>
            <strong style={{ color: themeConfig.primaryAccent }}>₹{calculatedNet} INR</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
