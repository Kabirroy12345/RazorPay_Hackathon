import React, { useEffect, useRef } from 'react';

interface FinancialNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  type: 'bank' | 'gateway' | 'erp' | 'exception';
  amount: number;
  label: string;
  matchedWith?: number; // index of paired node
  matchedTimer?: number;
  isAnomaly?: boolean;
  pulsePhase: number;
}

export const HeroCanvas3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    // Mouse tracking with smooth lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0;
    let currentCamX = 0;
    let currentCamY = 0;

    const isMobile = window.innerWidth < 768;
    const NODE_COUNT = isMobile ? 22 : 46;

    const nodes: FinancialNode[] = [];
    const nodeTypes: Array<'bank' | 'gateway' | 'erp'> = ['bank', 'gateway', 'erp'];

    // Initialize nodes across 3D space
    for (let i = 0; i < NODE_COUNT; i++) {
      const type = nodeTypes[i % 3];
      const isAnomaly = i % 7 === 0;
      nodes.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 500,
        z: Math.random() * 600 + 100,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.5,
        type: isAnomaly ? 'exception' : type,
        amount: Math.round(Math.random() * 15000 + 1000),
        label: isAnomaly 
          ? `EXC-${100 + i}` 
          : type === 'bank' ? `BNK-${100 + i}` : type === 'gateway' ? `RZP-${200 + i}` : `INV-${300 + i}`,
        isAnomaly,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

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
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / height) * 2 - 1;
      mouseX = nx;
      mouseY = ny;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Pause when off-screen or tab hidden
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Render loop
    const focalLength = 400;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth camera interpolation
      targetCamX = mouseX * 45;
      targetCamY = mouseY * 30;
      currentCamX += (targetCamX - currentCamX) * 0.05;
      currentCamY += (targetCamY - currentCamY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw subtle spatial perspective grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -width; x < width * 2; x += 120) {
        ctx.moveTo(x - currentCamX * 0.2, 0);
        ctx.lineTo(x + currentCamX * 0.2, height);
      }
      for (let y = 0; y < height; y += 80) {
        ctx.moveTo(0, y - currentCamY * 0.2);
        ctx.lineTo(width, y + currentCamY * 0.2);
      }
      ctx.stroke();

      // Project 3D nodes to 2D
      interface ProjectedNode {
        node: FinancialNode;
        px: number;
        py: number;
        scale: number;
        alpha: number;
        index: number;
      }

      const projected: ProjectedNode[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Motion update
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        n.pulsePhase += 0.03;

        // Boundary bounce / wrap
        if (n.x < -450) n.x = 450;
        if (n.x > 450) n.x = -450;
        if (n.y < -300) n.y = 300;
        if (n.y > 300) n.y = -300;
        if (n.z < 60) n.z = 700;
        if (n.z > 700) n.z = 60;

        // Apply camera offset
        const relX = n.x - currentCamX;
        const relY = n.y - currentCamY;
        const relZ = n.z;

        if (relZ > 20) {
          const scale = focalLength / relZ;
          const px = cx + relX * scale;
          const py = cy + relY * scale;
          const alpha = Math.max(0.1, Math.min(1, (700 - relZ) / 600));

          projected.push({ node: n, px, py, scale, alpha, index: i });
        }
      }

      // Sort by Z for proper depth rendering
      projected.sort((a, b) => b.node.z - a.node.z);

      // Draw connection vectors between proximity nodes (3-way matching simulation)
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];

          // Check 3D distance
          const dx = p1.node.x - p2.node.x;
          const dy = p1.node.y - p2.node.y;
          const dz = p1.node.z - p2.node.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.45 * Math.min(p1.alpha, p2.alpha);

            if (p1.node.isAnomaly || p2.node.isAnomaly) {
              // Exception path (controlled warning red dashed vector)
              ctx.setLineDash([4, 4]);
              ctx.strokeStyle = `rgba(239, 68, 68, ${lineAlpha * 0.8})`;
            } else if (
              (p1.node.type === 'bank' && p2.node.type === 'gateway') ||
              (p1.node.type === 'gateway' && p2.node.type === 'erp')
            ) {
              // Valid multi-source reconciliation vector
              ctx.setLineDash([]);
              ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
            } else {
              // General network thread
              ctx.setLineDash([]);
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha * 0.35})`;
            }

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);

      // Draw individual 3D nodes
      for (let i = 0; i < projected.length; i++) {
        const { node, px, py, scale, alpha } = projected[i];
        const radius = Math.max(2, Math.min(8, 4.5 * scale));

        // Color by stream type
        let mainColor = '#00D2FF'; // Bank: Cyan
        let glowColor = 'rgba(0, 210, 255, 0.4)';

        if (node.type === 'gateway') {
          mainColor = '#F59E0B'; // Gateway: Amber
          glowColor = 'rgba(245, 158, 11, 0.4)';
        } else if (node.type === 'erp') {
          mainColor = '#A855F7'; // ERP: Violet
          glowColor = 'rgba(168, 85, 247, 0.4)';
        } else if (node.type === 'exception') {
          mainColor = '#EF4444'; // Anomaly: Red
          glowColor = 'rgba(239, 68, 68, 0.5)';
        }

        // Ambient radial glow
        const pulse = Math.sin(node.pulsePhase) * 1.5;
        const glowRadius = Math.max(4, (radius + 6 + pulse) * scale);
        const grad = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
        grad.addColorStop(0, glowColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = mainColor;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        // Technical monospace label for near nodes
        if (scale > 0.85 && !isMobile) {
          ctx.fillStyle = `rgba(244, 244, 246, ${alpha * 0.75})`;
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(node.label, px + radius + 5, py + 3);
          ctx.fillStyle = `rgba(142, 142, 147, ${alpha * 0.6})`;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText(`₹${node.amount.toLocaleString('en-IN')}`, px + radius + 5, py + 13);
        }

        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
        zIndex: 0,
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
      {/* Subtle bottom vignette gradient to blend seamlessly into next sections */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to top, #070709 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
