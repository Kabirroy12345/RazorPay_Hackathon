import React, { useEffect, useRef } from 'react';

interface SlabData {
  id: string;
  source: 'BANK' | 'GATEWAY' | 'ERP' | 'EXCEPTION';
  amount: string;
  ref: string;
  status: string;
  color: string;
  bgFill: string;
  baseX: number;
  baseY: number;
  baseZ: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  cluster: 0 | 1 | 2 | 3; // 0: Bank, 1: Gateway, 2: ERP, 3: Exception
}

export const FinancialMachine3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    // Smooth camera rotation driven by mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let camRotX = 0;
    let camRotY = 0;
    let scrollProgress = 0;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect ? rect.width : window.innerWidth;
      const h = rect ? rect.height : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = w;
      height = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX = nx;
      mouseY = ny;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Visibility and intersection observer to save power
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // =========================================================================
    // 3D FINANCIAL SLAB DEFINITIONS (STRUCTURED REAL OBJECTS)
    // =========================================================================
    const SLABS: SlabData[] = [
      // BANK CLUSTER (Electric Cyan)
      {
        id: 'B-01',
        source: 'BANK',
        amount: '₹48,272.80',
        ref: 'TXN-88412',
        status: 'SETTLED',
        color: '#00D2FF',
        bgFill: 'rgba(0, 30, 45, 0.92)',
        baseX: -160,
        baseY: -80,
        baseZ: 40,
        orbitRadius: 180,
        orbitSpeed: 0.007,
        orbitAngle: 0,
        cluster: 0,
      },
      {
        id: 'B-02',
        source: 'BANK',
        amount: '₹14,500.00',
        ref: 'TXN-99120',
        status: 'CLEARED',
        color: '#00D2FF',
        bgFill: 'rgba(0, 30, 45, 0.92)',
        baseX: -220,
        baseY: 90,
        baseZ: -50,
        orbitRadius: 210,
        orbitSpeed: -0.006,
        orbitAngle: 2.1,
        cluster: 0,
      },
      {
        id: 'B-03',
        source: 'BANK',
        amount: '₹62,100.00',
        ref: 'TXN-77301',
        status: 'SETTLED',
        color: '#00D2FF',
        bgFill: 'rgba(0, 30, 45, 0.92)',
        baseX: -190,
        baseY: -160,
        baseZ: -80,
        orbitRadius: 240,
        orbitSpeed: 0.005,
        orbitAngle: 4.2,
        cluster: 0,
      },

      // GATEWAY CLUSTER (Warm Amber / Gold)
      {
        id: 'G-01',
        source: 'GATEWAY',
        amount: '₹48,272.80',
        ref: 'SET-88412',
        status: '2.0% MDR',
        color: '#F59E0B',
        bgFill: 'rgba(40, 25, 0, 0.92)',
        baseX: 20,
        baseY: -20,
        baseZ: 80,
        orbitRadius: 190,
        orbitSpeed: 0.008,
        orbitAngle: 1.0,
        cluster: 1,
      },
      {
        id: 'G-02',
        source: 'GATEWAY',
        amount: '₹14,210.00',
        ref: 'PAY-44021',
        status: 'NET PAID',
        color: '#F59E0B',
        bgFill: 'rgba(40, 25, 0, 0.92)',
        baseX: 70,
        baseY: 130,
        baseZ: -20,
        orbitRadius: 220,
        orbitSpeed: -0.007,
        orbitAngle: 3.2,
        cluster: 1,
      },
      {
        id: 'G-03',
        source: 'GATEWAY',
        amount: '₹60,858.00',
        ref: 'SET-99140',
        status: '2.0% + GST',
        color: '#F59E0B',
        bgFill: 'rgba(40, 25, 0, 0.92)',
        baseX: 50,
        baseY: -140,
        baseZ: -60,
        orbitRadius: 250,
        orbitSpeed: 0.006,
        orbitAngle: 5.1,
        cluster: 1,
      },

      // ERP INVOICE CLUSTER (Violet / Electric Purple)
      {
        id: 'E-01',
        source: 'ERP',
        amount: '₹8,500.00',
        ref: 'INV-BUN-01',
        status: 'MATCHED',
        color: '#A855F7',
        bgFill: 'rgba(35, 10, 50, 0.92)',
        baseX: 220,
        baseY: -90,
        baseZ: 60,
        orbitRadius: 200,
        orbitSpeed: -0.008,
        orbitAngle: 0.5,
        cluster: 2,
      },
      {
        id: 'E-02',
        source: 'ERP',
        amount: '₹12,000.00',
        ref: 'INV-BUN-03',
        status: 'MATCHED',
        color: '#A855F7',
        bgFill: 'rgba(35, 10, 50, 0.92)',
        baseX: 250,
        baseY: 60,
        baseZ: 10,
        orbitRadius: 230,
        orbitSpeed: 0.007,
        orbitAngle: 2.8,
        cluster: 2,
      },
      {
        id: 'E-03',
        source: 'ERP',
        amount: '₹7,300.00',
        ref: 'INV-BUN-05',
        status: 'MATCHED',
        color: '#A855F7',
        bgFill: 'rgba(35, 10, 50, 0.92)',
        baseX: 200,
        baseY: 170,
        baseZ: -40,
        orbitRadius: 260,
        orbitSpeed: -0.006,
        orbitAngle: 4.6,
        cluster: 2,
      },
      {
        id: 'E-04',
        source: 'ERP',
        amount: '₹5,000.00',
        ref: 'INV-BUN-07',
        status: 'MATCHED',
        color: '#A855F7',
        bgFill: 'rgba(35, 10, 50, 0.92)',
        baseX: 260,
        baseY: -170,
        baseZ: -80,
        orbitRadius: 280,
        orbitSpeed: 0.005,
        orbitAngle: 5.9,
        cluster: 2,
      },

      // EXCEPTION OBJECTS (Warning Crimson Red)
      {
        id: 'X-01',
        source: 'EXCEPTION',
        amount: '₹142.50',
        ref: 'FEE-OVERCHARGE',
        status: 'DISPUTED',
        color: '#EF4444',
        bgFill: 'rgba(50, 10, 15, 0.95)',
        baseX: -50,
        baseY: 220,
        baseZ: 110,
        orbitRadius: 290,
        orbitSpeed: 0.009,
        orbitAngle: 1.8,
        cluster: 3,
      },
      {
        id: 'X-02',
        source: 'EXCEPTION',
        amount: '₹4,900.00',
        ref: 'DUP-DEDUCTION',
        status: 'QUARANTINE',
        color: '#EF4444',
        bgFill: 'rgba(50, 10, 15, 0.95)',
        baseX: 180,
        baseY: -220,
        baseZ: 130,
        orbitRadius: 310,
        orbitSpeed: -0.008,
        orbitAngle: 4.1,
        cluster: 3,
      },
    ];

    // Dimensional size of a standard 3D transaction card slab
    const SLAB_W = 120;
    const SLAB_H = 50;
    const SLAB_D = 12;

    const FOCAL = 650;
    let time = 0;

    // =========================================================================
    // RENDER LOOP WITH REAL 3D PROJECTION & DEPTH SORTING
    // =========================================================================
    const render = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(render);
        return;
      }

      time += 0.016;

      // Mouse camera orientation with damping
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
      camRotY += (targetRotY - camRotY) * 0.05;
      camRotX += (targetRotX - camRotX) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Camera center: in Hero, shift right so left column is clear for typography
      // On small screens, keep it centered
      const isMobile = width < 900;
      const centerOffsetX = isMobile ? 0 : width * 0.16 * (1 - scrollProgress * 0.8);
      const centerOffsetY = isMobile ? 0 : 0;
      const cx = width / 2 + centerOffsetX;
      const cy = height / 2 + centerOffsetY;

      // =======================================================================
      // SCROLL-DRIVEN STAGE INTERPOLATION (0.0 to 1.0)
      // =======================================================================
      // Stage 0 (0.0 - 0.15): Separated orbits
      // Stage 1 (0.15 - 0.35): Convergence toward central matching axis
      // Stage 2 (0.35 - 0.55): Active reconciliation bus connection
      // Stage 3 (0.55 - 0.72): Bundle constellation around ₹48,272.80
      // Stage 4 (0.72 - 0.86): Exception breakaway
      // Stage 5 (0.86 - 1.0): Stabilized verified ledger matrix & cash curve
      const convergenceFactor = Math.min(1, Math.max(0, (scrollProgress - 0.12) / 0.25));
      const bundleFactor = Math.min(1, Math.max(0, (scrollProgress - 0.45) / 0.25));
      const exceptionFactor = Math.min(1, Math.max(0, (scrollProgress - 0.68) / 0.18));
      const cashFlowFactor = Math.min(1, Math.max(0, (scrollProgress - 0.85) / 0.15));

      // Global machine slow rotation
      const machineGlobalAngle = time * 0.25;

      // Calculate current 3D world positions of all slabs
      interface TransformedSlab {
        slab: SlabData;
        x: number;
        y: number;
        z: number;
        rotX: number;
        rotY: number;
        rotZ: number;
        scale: number;
        px: number;
        py: number;
        depth: number;
      }

      const transformedSlabs: TransformedSlab[] = [];

      for (let i = 0; i < SLABS.length; i++) {
        const s = SLABS[i];

        // 1. Base orbital motion
        const ang = s.orbitAngle + s.orbitSpeed * time * 60 + machineGlobalAngle;
        let ox = Math.cos(ang) * s.orbitRadius;
        let oz = Math.sin(ang) * s.orbitRadius;
        let oy = s.baseY + Math.sin(time * 1.5 + i) * 15;

        // 2. Stage 1: Convergence (clusters pull in toward center)
        if (convergenceFactor > 0) {
          const targetX = (s.cluster === 0 ? -60 : s.cluster === 1 ? 0 : s.cluster === 2 ? 60 : 0);
          ox = ox * (1 - convergenceFactor * 0.65) + targetX * convergenceFactor;
          oy = oy * (1 - convergenceFactor * 0.4);
        }

        // 3. Stage 3: Bundle Solver constellation (ERP items orbit around B-01 and G-01)
        if (bundleFactor > 0) {
          if (s.id === 'B-01' || s.id === 'G-01') {
            ox = (s.id === 'B-01' ? -45 : 45) * bundleFactor + ox * (1 - bundleFactor);
            oy = oy * (1 - bundleFactor);
            oz = 30 * bundleFactor + oz * (1 - bundleFactor);
          } else if (s.source === 'ERP') {
            // Tight circular ring around B-01
            const bAng = (i * Math.PI * 2) / 4 + time * 0.8;
            const bRadius = 140;
            const bx = Math.cos(bAng) * bRadius;
            const by = Math.sin(bAng) * bRadius * 0.5;
            const bz = Math.sin(bAng) * bRadius;
            ox = ox * (1 - bundleFactor) + bx * bundleFactor;
            oy = oy * (1 - bundleFactor) + by * bundleFactor;
            oz = oz * (1 - bundleFactor) + bz * bundleFactor;
          }
        }

        // 4. Stage 4: Exception breakaway (red anomalies shoot outward)
        if (s.cluster === 3) {
          const pushDist = exceptionFactor * 240;
          ox += (s.id === 'X-01' ? -pushDist : pushDist);
          oy += pushDist * 0.6;
          oz += pushDist * 0.4;
        }

        // 5. Stage 6: Cash Forecaster curve
        if (cashFlowFactor > 0) {
          const flowX = ((i / SLABS.length) * 2 - 1) * 360;
          const flowY = Math.sin((i / SLABS.length) * Math.PI * 2 + time) * 70;
          const flowZ = Math.cos((i / SLABS.length) * Math.PI * 2) * 80;
          ox = ox * (1 - cashFlowFactor) + flowX * cashFlowFactor;
          oy = oy * (1 - cashFlowFactor) + flowY * cashFlowFactor;
          oz = oz * (1 - cashFlowFactor) + flowZ * cashFlowFactor;
        }

        // Apply 3D Camera Rotation (around Y axis then X axis)
        // Y-axis rotation (camRotY)
        const cosY = Math.cos(camRotY);
        const sinY = Math.sin(camRotY);
        const x1 = ox * cosY + oz * sinY;
        const z1 = -ox * sinY + oz * cosY;

        // X-axis rotation (camRotX)
        const cosX = Math.cos(camRotX);
        const sinX = Math.sin(camRotX);
        const y2 = oy * cosX - z1 * sinX;
        const z2 = oy * sinX + z1 * cosX;

        // Perspective camera projection
        const depth = z2 + FOCAL;
        if (depth > 60) {
          const scale = FOCAL / depth;
          const px = cx + x1 * scale;
          const py = cy + y2 * scale;

          transformedSlabs.push({
            slab: s,
            x: x1,
            y: y2,
            z: z2,
            rotX: camRotX,
            rotY: camRotY + ang * 0.3,
            rotZ: Math.sin(time + i) * 0.08,
            scale,
            px,
            py,
            depth,
          });
        }
      }

      // =======================================================================
      // DRAW 3D CONNECTION BUS BARS & VECTOR CONSTELLATION PATHS
      // =======================================================================
      // We connect matching records in 3D space with luminous structured conduits
      for (let i = 0; i < transformedSlabs.length; i++) {
        const s1 = transformedSlabs[i];
        for (let j = i + 1; j < transformedSlabs.length; j++) {
          const s2 = transformedSlabs[j];

          // Determine connection criteria
          const isMatchingPair = 
            (s1.slab.id === 'B-01' && s2.slab.id === 'G-01') ||
            (s1.slab.id === 'G-01' && s2.slab.source === 'ERP') ||
            (s1.slab.id === 'B-02' && s2.slab.id === 'G-02');

          const isExceptionPair = 
            (s1.slab.cluster === 3 && s2.slab.id === 'G-01');

          if (isMatchingPair || (isExceptionPair && exceptionFactor < 0.7)) {
            // Draw 3D segmented laser conduit
            const strokeColor = isExceptionPair
              ? `rgba(239, 68, 68, ${0.75 * (1 - exceptionFactor)})`
              : s1.slab.source === 'BANK' || s2.slab.source === 'BANK'
              ? 'rgba(0, 210, 255, 0.65)'
              : 'rgba(245, 158, 11, 0.6)';

            ctx.beginPath();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = Math.max(1, 2 * ((s1.scale + s2.scale) / 2));
            if (isExceptionPair) {
              ctx.setLineDash([4, 4]);
            } else {
              ctx.setLineDash([]);
            }
            ctx.moveTo(s1.px, s1.py);
            ctx.lineTo(s2.px, s2.py);
            ctx.stroke();
            ctx.setLineDash([]);

            // Traveling energy packet along the bus path
            const travelProgress = (time * 1.5 + i * 0.3) % 1;
            const pulseX = s1.px + (s2.px - s1.px) * travelProgress;
            const pulseY = s1.py + (s2.py - s1.py) * travelProgress;
            ctx.fillStyle = isExceptionPair ? '#EF4444' : '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, Math.max(2, 3.5 * s1.scale), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // =======================================================================
      // SORT SLABS BY DEPTH (PAINTER'S ALGORITHM)
      // =======================================================================
      transformedSlabs.sort((a, b) => b.depth - a.depth);

      // =======================================================================
      // DRAW 3D TRANSACTION SLABS (AUTHENTIC STRUCTURED OBJECTS)
      // =======================================================================
      for (let i = 0; i < transformedSlabs.length; i++) {
        const item = transformedSlabs[i];
        const { slab, scale, px, py, rotZ } = item;

        const w = SLAB_W * scale;
        const h = SLAB_H * scale;
        const d = SLAB_D * scale;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rotZ);

        // 1. 3D Bevel/Depth Shadow & Side Faces (giving genuine 3D block thickness)
        const sideOffsetX = Math.sin(camRotY) * d;
        const sideOffsetY = -Math.sin(camRotX) * d;

        // Draw side extrusion block
        ctx.fillStyle = 'rgba(10, 10, 14, 0.95)';
        ctx.beginPath();
        ctx.moveTo(-w / 2, -h / 2);
        ctx.lineTo(-w / 2 + sideOffsetX, -h / 2 + sideOffsetY);
        ctx.lineTo(w / 2 + sideOffsetX, -h / 2 + sideOffsetY);
        ctx.lineTo(w / 2 + sideOffsetX, h / 2 + sideOffsetY);
        ctx.lineTo(w / 2, h / 2);
        ctx.lineTo(-w / 2, h / 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = slab.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 2. Front Face of the 3D Slab
        ctx.fillStyle = slab.bgFill;
        ctx.strokeStyle = slab.color;
        ctx.lineWidth = Math.max(1, 1.5 * scale);
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, Math.max(2, 4 * scale));
        ctx.fill();
        ctx.stroke();

        // 3. Ambient specular edge highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 3, -h / 2 + 1);
        ctx.lineTo(w / 2 - 3, -h / 2 + 1);
        ctx.stroke();

        // 4. Rendered Financial Data on Slab Face
        if (scale > 0.45) {
          // Source Badge Pill
          const fontSizePill = Math.max(7, Math.round(8 * scale));
          ctx.font = `700 ${fontSizePill}px "JetBrains Mono", monospace`;
          ctx.fillStyle = slab.color;
          ctx.fillText(`[${slab.source}]`, -w / 2 + 8 * scale, -h / 2 + 15 * scale);

          // Ref ID
          const fontSizeRef = Math.max(6, Math.round(7.5 * scale));
          ctx.font = `500 ${fontSizeRef}px "JetBrains Mono", monospace`;
          ctx.fillStyle = '#8E8E93';
          ctx.fillText(slab.ref, w / 2 - (slab.ref.length * 5 * scale) - 6 * scale, -h / 2 + 15 * scale);

          // Main Transaction Amount (Monumental Monospace)
          const fontSizeAmt = Math.max(9, Math.round(13 * scale));
          ctx.font = `800 ${fontSizeAmt}px "JetBrains Mono", monospace`;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(slab.amount, -w / 2 + 8 * scale, h / 2 - 12 * scale);

          // Status Badge Pill
          const fontSizeStat = Math.max(6, Math.round(7 * scale));
          ctx.font = `700 ${fontSizeStat}px "JetBrains Mono", monospace`;
          ctx.fillStyle = slab.color;
          ctx.fillText(slab.status, w / 2 - (slab.status.length * 4.5 * scale) - 6 * scale, h / 2 - 12 * scale);
        }

        ctx.restore();
      }

      // =======================================================================
      // STAGE 6: UNDULATING 3D CASH FLOW RIBBONS (CASH FORECASTER PROJECTION)
      // =======================================================================
      if (cashFlowFactor > 0.1) {
        ctx.save();
        ctx.strokeStyle = `rgba(0, 210, 255, ${0.45 * cashFlowFactor})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = -width / 2; x < width / 2; x += 15) {
          const waveY = Math.sin((x + time * 80) * 0.015) * 45 * cashFlowFactor;
          const waveZ = Math.cos((x + time * 80) * 0.015) * 50 * cashFlowFactor;
          const d = waveZ + FOCAL;
          const sc = FOCAL / d;
          const px = cx + x * sc;
          const py = cy + (120 + waveY) * sc;
          if (x === -width / 2) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
