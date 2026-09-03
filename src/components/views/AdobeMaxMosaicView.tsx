import React, { useState, useRef } from 'react';
import { ArrowRight, RotateCcw, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface AdobeMaxMosaicViewProps {
  onEnter: () => void;
}

interface TileData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'razorpay-brand' | 'concentric' | 'cubes' | 'ribbon' | 'clover' | 'frame' | 'star' | 'launch' | 'metrics' | 'pills';
  colSpan?: number;
  rowSpan?: number;
  color?: string;
}

const INITIAL_TILES: TileData[] = [
  { id: 't1', title: 'LOOP_RIBBON', type: 'ribbon' },
  { id: 't2', title: 'CONCENTRIC_FLOW', type: 'concentric' },
  { id: 't3', title: 'WAVE_ACCORDION', type: 'pills' },
  { id: 't4', title: 'ISOMETRIC_BLOCKS', type: 'cubes' },
  { id: 't5', title: '4_LEAF_CLOVER', type: 'clover' },
  { id: 't-brand', title: 'RAZORPAY_OMNISETTLE', type: 'razorpay-brand', colSpan: 2, rowSpan: 2 },
  { id: 't6', title: 'BEVELED_FRAME', type: 'frame' },
  { id: 't7', title: 'DIAMOND_STAR', type: 'star' },
  { id: 't8', title: 'LIVE_METRICS', type: 'metrics' },
  { id: 't-launch', title: 'ENTER_TERMINAL', type: 'launch', colSpan: 2 },
];

export const AdobeMaxMosaicView: React.FC<AdobeMaxMosaicViewProps> = ({ onEnter }) => {
  // Store dynamic positions for draggable tiles
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent drag on launch button click
    if ((e.target as HTMLElement).closest('button')) return;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingId(id);

    const currentPos = positions[id] || { x: 0, y: 0 };
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentPos.x,
      initY: currentPos.y,
    };
  };

  const handlePointerMove = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingId !== id) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    setPositions(prev => ({
      ...prev,
      [id]: {
        x: dragStartRef.current.initX + deltaX,
        y: dragStartRef.current.initY + deltaY,
      },
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingId) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe release fallback
      }
      setDraggingId(null);
    }
  };

  const handleResetPositions = () => {
    setPositions({});
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#070709',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#FFFFFF',
        userSelect: 'none',
      }}
    >
      {/* Top Banner Navigation */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 7, 9, 0.85)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Razorpay + OmniSettle Brand Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#FFFFFF',
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.25)',
            }}
          >
            <img
              src="/razorpay-logo.png"
              alt="Razorpay"
              style={{ height: '22px', width: 'auto', display: 'block' }}
            />
          </div>

          <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.9rem' }}>✕</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#00D2FF" />
            <span style={{ fontWeight: 800, letterSpacing: '0.08em', fontSize: '1.05rem', color: '#FFFFFF' }}>
              OMNISETTLE<span style={{ color: '#00D2FF' }}>.AI</span>
            </span>
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid rgba(2, 132, 199, 0.4)',
              color: '#38BDF8',
              letterSpacing: '0.05em',
            }}
          >
            RAZORPAY BUILDATHON 2026 • TRACK 04
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleResetPositions}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94A3B8',
              fontSize: '0.78rem',
              padding: '0.5rem 0.9rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <RotateCcw size={13} /> RESET TILES
          </button>

          <button
            onClick={onEnter}
            style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #0C83FD 50%, #2563EB 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.55rem 1.4rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 20px rgba(12, 131, 253, 0.4)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(12, 131, 253, 0.65)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(12, 131, 253, 0.4)';
            }}
          >
            ENTER PROJECT <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* Hero Headline & Instructions */}
      <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem 1.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#38BDF8',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={13} /> INTERACTIVE MODULAR RECONCILIATION ENGINE
        </div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '0 0 0.5rem',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #38BDF8 70%, #A855F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Explore. Rearrange. Reconcile.
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: '#94A3B8',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          Inspired by Adobe MAX modular interactive walls. Click, drag, and move any box to customize your ledger portal, or launch directly into the main terminal.
        </p>
      </div>

      {/* ADOBE MAX MODULAR MOSAIC GRID */}
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '1.5rem 2rem 5rem',
        }}
      >
        {INITIAL_TILES.map(tile => {
          const pos = positions[tile.id] || { x: 0, y: 0 };
          const isDragging = draggingId === tile.id;

          return (
            <div
              key={tile.id}
              onPointerDown={e => handlePointerDown(tile.id, e)}
              onPointerMove={e => handlePointerMove(tile.id, e)}
              onPointerUp={handlePointerUp}
              style={{
                position: 'relative',
                gridColumn: tile.colSpan ? `span ${tile.colSpan}` : 'span 1',
                gridRow: tile.rowSpan ? `span ${tile.rowSpan}` : 'span 1',
                minHeight: tile.rowSpan ? '460px' : '220px',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#111116',
                border: isDragging ? '2px solid #00D2FF' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isDragging
                  ? '0 30px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 210, 255, 0.4)'
                  : '0 10px 30px rgba(0, 0, 0, 0.5)',
                cursor: isDragging ? 'grabbing' : 'grab',
                transform: `translate(${pos.x}px, ${pos.y}px) ${isDragging ? 'scale(1.04)' : 'scale(1)'}`,
                zIndex: isDragging ? 50 : 1,
                transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
                touchAction: 'none',
              }}
            >
              {/* TILE CONTENT BY TYPE */}

              {/* 1. RAZORPAY × OMNISETTLE HERO BRAND BOX (Inspired by the MAX red block) */}
              {tile.type === 'razorpay-brand' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(145deg, #0284C7 0%, #0369A1 50%, #0C2340 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Glowing background geometric watermark */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '-10%',
                      bottom: '-10%',
                      width: '320px',
                      height: '320px',
                      background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
                      filter: 'blur(35px)',
                    }}
                  />

                  {/* Top Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        letterSpacing: '0.1em',
                        fontWeight: 700,
                        color: '#FFFFFF',
                      }}
                    >
                      OFFICIAL SETTLEMENT PARTNER
                    </div>

                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Layers size={14} /> DRAGGABLE TILE
                    </div>
                  </div>

                  {/* BIG OFFICIAL RAZORPAY LOGO CARD */}
                  <div style={{ margin: '1.5rem 0' }}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        padding: '1.1rem 2.2rem',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <img
                        src="/razorpay-logo.png"
                        alt="Razorpay"
                        style={{ height: '42px', width: 'auto', display: 'block' }}
                      />
                    </div>

                    <h2
                      style={{
                        fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                        margin: 0,
                        lineHeight: 1,
                        color: '#FFFFFF',
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      OMNISETTLE<span style={{ color: '#7DD3FC' }}>.AI</span>
                    </h2>

                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: '#E0F2FE',
                        margin: '0.75rem 0 0',
                        lineHeight: 1.5,
                        maxWidth: '420px',
                      }}
                    >
                      Autonomous 3-Way Reconciliation Engine for high-volume Razorpay settlements, proving the math behind every rupee.
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                      paddingTop: '1.25rem',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: '#BAE6FD', letterSpacing: '0.08em' }}>
                      TRACK 04: FINTECH AI & AUTOMATION
                    </span>

                    <button
                      onClick={onEnter}
                      style={{
                        background: '#FFFFFF',
                        color: '#0369A1',
                        border: 'none',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      LAUNCH TERMINAL <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* 2. CONCENTRIC RIPPLE RINGS (Adobe MAX Style) */}
              {tile.type === 'concentric' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    background: '#0D0D12',
                  }}
                >
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="80" fill="url(#gradConc1)" />
                    <circle cx="90" cy="90" r="62" fill="url(#gradConc2)" />
                    <circle cx="90" cy="90" r="44" fill="url(#gradConc3)" />
                    <circle cx="90" cy="90" r="26" fill="url(#gradConc4)" />
                    <circle cx="90" cy="90" r="10" fill="#0D0D12" />
                    <defs>
                      <linearGradient id="gradConc1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                      <linearGradient id="gradConc2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                      <linearGradient id="gradConc3" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                      <linearGradient id="gradConc4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#EF4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span style={{ position: 'absolute', bottom: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#94A3B8' }}>
                    3-WAY LEDGER SYNC
                  </span>
                </div>
              )}

              {/* 3. ISOMETRIC 3D CUBES (Adobe MAX Style) */}
              {tile.type === 'cubes' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0C0C10',
                    position: 'relative',
                  }}
                >
                  <svg width="190" height="150" viewBox="0 0 190 150">
                    <defs>
                      <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                      <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#E11D48" />
                      </linearGradient>
                      <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                    </defs>
                    {/* Cube 1 */}
                    <g transform="translate(45, 30)">
                      <polygon points="50,0 100,28 50,56 0,28" fill="url(#cubeTop)" />
                      <polygon points="0,28 50,56 50,105 0,77" fill="url(#cubeLeft)" />
                      <polygon points="50,56 100,28 100,77 50,105" fill="url(#cubeRight)" />
                    </g>
                  </svg>
                  <span style={{ position: 'absolute', bottom: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#94A3B8' }}>
                    NP-HARD SUBSET-SUM
                  </span>
                </div>
              )}

              {/* 4. LOOP RIBBON TUBE */}
              {tile.type === 'ribbon' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0B0B0F',
                    position: 'relative',
                  }}
                >
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00D2FF" />
                        <stop offset="50%" stopColor="#3A7BD5" />
                        <stop offset="100%" stopColor="#00F260" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 30 130 C 10 90, 40 30, 80 30 C 120 30, 150 90, 130 130 C 110 170, 50 170, 30 130 Z"
                      fill="none"
                      stroke="url(#ribbonGrad)"
                      strokeWidth="24"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span style={{ position: 'absolute', bottom: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#94A3B8' }}>
                    1-TO-N REASONING
                  </span>
                </div>
              )}

              {/* 5. 4-LEAF DISK CLOVER */}
              {tile.type === 'clover' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0D0D12',
                    position: 'relative',
                  }}
                >
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <defs>
                      <linearGradient id="cloverTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                      <linearGradient id="cloverBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                    <circle cx="75" cy="45" r="32" fill="url(#cloverTop)" />
                    <circle cx="45" cy="75" r="32" fill="url(#cloverTop)" />
                    <circle cx="105" cy="75" r="32" fill="url(#cloverBottom)" />
                    <circle cx="75" cy="105" r="32" fill="url(#cloverBottom)" />
                    <circle cx="75" cy="75" r="16" fill="#0D0D12" />
                  </svg>
                  <span style={{ position: 'absolute', bottom: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#94A3B8' }}>
                    ZERO TOKEN CLEARING
                  </span>
                </div>
              )}

              {/* 6. BEVELED FRAME */}
              {tile.type === 'frame' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0E0E14',
                    position: 'relative',
                  }}
                >
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                    <rect x="25" y="25" width="110" height="110" fill="none" stroke="url(#frameGrad)" strokeWidth="26" />
                    <polygon points="25,25 135,135 135,25" fill="rgba(245, 158, 11, 0.4)" />
                  </svg>
                  <span style={{ position: 'absolute', bottom: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#94A3B8' }}>
                    IMMUTABLE LEDGER
                  </span>
                </div>
              )}

              {/* 7. DIAMOND KALEIDOSCOPE STAR */}
              {tile.type === 'star' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0A0A0E',
                    position: 'relative',
                  }}
                >
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="starGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                      <linearGradient id="starGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                    <polygon points="80,20 140,80 80,140 20,80" fill="url(#starGrad1)" />
                    <polygon points="80,38 122,80 80,122 38,80" fill="url(#starGrad2)" />
                    <circle cx="80" cy="80" r="14" fill="#0A0A0E" />
                  </svg>
                  <span style={{ position: 'absolute', bottom: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#94A3B8' }}>
                    GAAP COMPLIANCE
                  </span>
                </div>
              )}

              {/* 8. LIVE BENCHMARK METRICS */}
              {tile.type === 'metrics' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '1.75rem',
                    background: '#13131A',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#38BDF8', letterSpacing: '0.15em', fontWeight: 700 }}>
                    ENGINE BENCHMARK
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', margin: '0.25rem 0' }}>
                    99.98%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.4 }}>
                    Precision match rate across 53 ground truth synthetic vectors.
                  </div>
                  <div style={{ marginTop: '1rem', height: '4px', width: '100%', background: '#1E293B', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '99.98%', height: '100%', background: 'linear-gradient(90deg, #10B981, #38BDF8)' }} />
                  </div>
                </div>
              )}

              {/* 9. VERTICAL EQUALIZER PILLS */}
              {tile.type === 'pills' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0D0D12',
                    position: 'relative',
                  }}
                >
                  <svg width="150" height="140" viewBox="0 0 150 140">
                    <defs>
                      <linearGradient id="pillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                      <linearGradient id="pillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                    <rect x="25" y="20" width="22" height="100" rx="11" fill="url(#pillGrad1)" />
                    <rect x="64" y="35" width="22" height="85" rx="11" fill="url(#pillGrad2)" />
                    <rect x="103" y="10" width="22" height="110" rx="11" fill="url(#pillGrad1)" />
                  </svg>
                  <span style={{ position: 'absolute', bottom: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#94A3B8' }}>
                    STREAMING RECONCILER
                  </span>
                </div>
              )}

              {/* 10. LAUNCH CALL-TO-ACTION TILE */}
              {tile.type === 'launch' && (
                <div
                  onClick={onEnter}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2rem 2.5rem',
                    background: 'linear-gradient(90deg, #181822 0%, #1F1F2E 100%)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #1E1E2C 0%, #29293D 100%)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #181822 0%, #1F1F2E 100%)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#00D2FF', fontWeight: 700 }}>
                      READY TO RECONCILE?
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.2rem' }}>
                      Launch OmniSettle AI Terminal
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                      Direct pass to 3-Way Grid, Math Sandbox, and GAAP Compliance.
                    </div>
                  </div>

                  <button
                    onClick={onEnter}
                    style={{
                      backgroundColor: '#0284C7',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.9rem 1.8rem',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 25px rgba(2, 132, 199, 0.45)',
                    }}
                  >
                    ENTER <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};
