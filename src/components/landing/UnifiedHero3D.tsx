import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Building2, 
  CreditCard, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
} from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export const UnifiedHero3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ---------------------------------------------------------------------------
  // INTERACTIVE 3D PERSPECTIVE PARALLAX
  // ---------------------------------------------------------------------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Dynamic 3D rotation angles
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // ---------------------------------------------------------------------------
  // 3D KINETIC BACKGROUND CANVAS (Laser Particle Constellation)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D laser particles
    const colors = ['#00D2FF', '#7C3AED', '#EC4899', '#10B981', '#F59E0B'];
    const particles: Particle[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 400 + 50,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial glowing background ambient spotlights
      const grad1 = ctx.createRadialGradient(width * 0.45, height * 0.4, 20, width * 0.45, height * 0.4, 380);
      grad1.addColorStop(0, 'rgba(0, 210, 255, 0.14)');
      grad1.addColorStop(0.5, 'rgba(124, 58, 237, 0.08)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.75, height * 0.65, 10, width * 0.75, height * 0.65, 300);
      grad2.addColorStop(0, 'rgba(236, 72, 153, 0.12)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Render & connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Connect nearby particles with laser filaments
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 90) * 0.22;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '660px',
        perspective: '1400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      {/* Dynamic Laser Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ------------------------------------------------------------------- */}
      {/* 3D SPATIAL PERSPECTIVE CONTAINER                                    */}
      {/* ------------------------------------------------------------------- */}
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          zIndex: 10,
        }}
      >
        {/* ================================================================= */}
        {/* SLAB 1: BANK STATEMENT (ELECTRIC CYAN HIGHLIGHT)                  */}
        {/* ================================================================= */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotateZ: [-2, -1, -2],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '8%',
            left: '6%',
            width: '320px',
            background: 'rgba(11, 15, 25, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 210, 255, 0.4)',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 20px 45px -10px rgba(0, 210, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            transform: 'translateZ(90px)',
            zIndex: 15,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0, 210, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={16} color="#00D2FF" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: '#00D2FF' }}>
                  SOURCE_01 // BANK STATEMENT
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93' }}>
                  HDFC CORP • ACCT #9921
                </div>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              CLEARED
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.4rem' }}>
            ₹48,272.80
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', display: 'flex', justifyContent: 'space-between' }}>
            <span>NET SETTLEMENT CREDIT</span>
            <span style={{ color: '#00D2FF' }}>T+1 CORRIDOR</span>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* SLAB 2: PAYMENT GATEWAY MDR (NEON VIOLET/PINK HIGHLIGHT)          */}
        {/* ================================================================= */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotateZ: [2, 1, 2],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.6,
          }}
          style={{
            position: 'absolute',
            top: '26%',
            right: '4%',
            width: '330px',
            background: 'rgba(15, 12, 28, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(236, 72, 153, 0.45)',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 25px 50px -10px rgba(236, 72, 153, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            transform: 'translateZ(130px)',
            zIndex: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={16} color="#EC4899" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: '#EC4899' }}>
                  SOURCE_02 // RAZORPAY GATEWAY
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93' }}>
                  BATCH #SET-88412
                </div>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#EC4899', background: 'rgba(236, 72, 153, 0.12)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              2% MDR
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            Gross ₹52,000 <span style={{ fontSize: '0.85rem', color: '#EC4899' }}>- 2% MDR - GST</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', lineHeight: 1.4 }}>
            Fee: ₹1,040.00 • GST (18%): ₹187.20 • Refund: ₹2,500.00
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* SLAB 3: ERP 1-TO-N BUNDLE INVOICES (NEON EMERALD HIGHLIGHT)       */}
        {/* ================================================================= */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotateZ: [-1, 0, -1],
          }}
          transition={{
            duration: 5.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
          style={{
            position: 'absolute',
            bottom: '22%',
            left: '8%',
            width: '320px',
            background: 'rgba(10, 22, 18, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '10px',
            padding: '1.25rem 1.4rem',
            boxShadow: '0 20px 45px -10px rgba(16, 185, 129, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            transform: 'translateZ(100px)',
            zIndex: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSpreadsheet size={16} color="#10B981" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: '#10B981' }}>
                  SOURCE_03 // ERP INVOICES
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93' }}>
                  SAP / NETSUITE LEDGER
                </div>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              8 INVOICES
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            INV-BUN-01 → INV-BUN-08
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', display: 'flex', justifyContent: 'space-between' }}>
            <span>BUNDLE AGGREGATE</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>₹52,000.00 GROSS</span>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* SLAB 4: ZERO-DELTA MATHEMATICAL VERIFICATION CORE (GOLD RADIANCE) */}
        {/* ================================================================= */}
        <motion.div
          animate={{
            y: [0, -14, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            bottom: '8%',
            right: '10%',
            width: '370px',
            background: 'linear-gradient(135deg, rgba(20, 18, 10, 0.94) 0%, rgba(12, 14, 25, 0.94) 100%)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            border: '2px solid #F59E0B',
            borderRadius: '12px',
            padding: '1.4rem 1.6rem',
            boxShadow: '0 30px 65px -10px rgba(245, 158, 11, 0.38), 0 0 35px rgba(0, 210, 255, 0.22)',
            transform: 'translateZ(180px)',
            zIndex: 25,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#000" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.04em' }}>
                  AUTONOMOUS ZERO-DELTA PROOF
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93' }}>
                  DUAL-PATH MATCHING ENGINE
                </div>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 800, color: '#000000', background: '#10B981', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
              VERIFIED
            </span>
          </div>

          {/* Equation */}
          <div style={{ background: '#070709', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.2rem' }}>
              MATHEMATICAL GUARDRAIL EQUATION:
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#EDEDED', fontWeight: 700 }}>
              ₹52,000 - ₹1,040 - ₹187.20 - ₹2,500 == <span style={{ color: '#10B981' }}>₹48,272.80</span>
            </div>
          </div>

          {/* Zero Delta Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981' }}>
              <CheckCircle2 size={15} />
              <strong style={{ letterSpacing: '0.05em' }}>DELTA: 0.0000 INR</strong>
            </div>
            <span style={{ color: '#00D2FF', fontSize: '0.68rem' }}>
              LATENCY: 43ms (Claude 3.5)
            </span>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* SVG LASER LIGHT BEAMS CONNECTING SLABS TO RESOLUTION CORE         */}
        {/* ================================================================= */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 12,
            overflow: 'visible',
          }}
        >
          <defs>
            <linearGradient id="beamCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="beamMagenta" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="beamEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>

            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Beam from Bank to Resolution Core */}
          <path
            d="M 220 120 C 350 200, 420 350, 480 480"
            stroke="url(#beamCyan)"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            fill="none"
            filter="url(#laserGlow)"
            opacity="0.75"
          />

          {/* Beam from Gateway to Resolution Core */}
          <path
            d="M 520 230 C 510 320, 500 400, 480 480"
            stroke="url(#beamMagenta)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            fill="none"
            filter="url(#laserGlow)"
            opacity="0.75"
          />

          {/* Beam from ERP to Resolution Core */}
          <path
            d="M 240 450 C 340 460, 400 470, 480 480"
            stroke="url(#beamEmerald)"
            strokeWidth="2.5"
            strokeDasharray="5 7"
            fill="none"
            filter="url(#laserGlow)"
            opacity="0.75"
          />
        </svg>

        {/* 3D Floating Hologram Ring */}
        <motion.div
          animate={{
            rotateZ: [0, 360],
            rotateX: [60, 60],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            bottom: '-4%',
            right: '4%',
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(0, 210, 255, 0.35)',
            boxShadow: '0 0 30px rgba(0, 210, 255, 0.15)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />

      </motion.div>
    </div>
  );
};
