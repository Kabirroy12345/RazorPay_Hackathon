import confetti from 'canvas-confetti';

/**
 * Triggers a vibrant 5-10 firecracker fireworks burst animation
 * across the screen with authentic explosive spreads, sparks, and colors.
 * Perfect for celebrating batch reconciliation and audit achievements.
 */
export function triggerFirecrackers() {
  // Firecracker celebratory color palettes
  const palettes = [
    ['#FF2A6D', '#FF5E00', '#FFAA00', '#FFEA00', '#FFFFFF'], // Firecracker Crimson & Gold
    ['#00F5D4', '#00BBF9', '#7B2CBF', '#F72585', '#FFFFFF'], // Neon Cyber Sparks
    ['#F5D061', '#E5A93C', '#FFE082', '#FFF59D', '#FFFFFF'], // Royal Sovereign Gold
    ['#10B981', '#34D399', '#065F46', '#6EE7B7', '#FFFFFF'], // Emerald Cash Sparks
    ['#0C8CE9', '#38BDF8', '#60A5FA', '#93C5FD', '#FFFFFF'], // Razorpay Electric Cyan
  ];

  // 9-10 distinct firecracker explosions staggered across screen coordinates (0 to 1600ms)
  const firecrackers = [
    // 1. First immediate burst near center/button (t = 0ms)
    { delay: 0, x: 0.5, y: 0.42, count: 75, spread: 360, startVelocity: 46, paletteIdx: 0 },
    // 2. High left firecracker pop (t = 160ms)
    { delay: 160, x: 0.22, y: 0.28, count: 85, spread: 360, startVelocity: 50, paletteIdx: 1 },
    // 3. High right firecracker pop (t = 340ms)
    { delay: 340, x: 0.78, y: 0.25, count: 85, spread: 360, startVelocity: 52, paletteIdx: 2 },
    // 4. Mid-left firecracker burst (t = 530ms)
    { delay: 530, x: 0.35, y: 0.48, count: 70, spread: 360, startVelocity: 42, paletteIdx: 3 },
    // 5. High-center golden flower blast (t = 720ms)
    { delay: 720, x: 0.52, y: 0.20, count: 100, spread: 360, startVelocity: 55, paletteIdx: 2 },
    // 6. Far right aerial blast (t = 920ms)
    { delay: 920, x: 0.85, y: 0.38, count: 80, spread: 360, startVelocity: 48, paletteIdx: 4 },
    // 7. Far left aerial blast (t = 1120ms)
    { delay: 1120, x: 0.15, y: 0.36, count: 80, spread: 360, startVelocity: 48, paletteIdx: 0 },
    // 8. Dual corner mortars launching upwards (t = 1320ms, t = 1350ms)
    { delay: 1320, x: 0.12, y: 0.82, count: 90, spread: 65, startVelocity: 65, angle: 60, paletteIdx: 1 },
    { delay: 1350, x: 0.88, y: 0.82, count: 90, spread: 65, startVelocity: 65, angle: 120, paletteIdx: 4 },
    // 9. Grand finale center firework explosion (t = 1560ms)
    { delay: 1560, x: 0.50, y: 0.30, count: 130, spread: 360, startVelocity: 60, paletteIdx: 2 },
  ];

  firecrackers.forEach((fc) => {
    setTimeout(() => {
      // Primary explosive blast
      confetti({
        particleCount: fc.count,
        spread: fc.spread,
        angle: fc.angle ?? 90,
        origin: { x: fc.x, y: fc.y },
        colors: palettes[fc.paletteIdx % palettes.length],
        startVelocity: fc.startVelocity,
        gravity: 1.15,
        decay: 0.92,
        ticks: 220,
        shapes: ['circle', 'square'],
        scalar: 1.1,
        disableForReducedMotion: false,
      });

      // Secondary crackle sparkles (golden/white micro sparks that pop with the firecracker)
      confetti({
        particleCount: Math.floor(fc.count * 0.35),
        spread: 360,
        origin: { x: fc.x, y: fc.y },
        colors: ['#FFFFFF', '#FFE875', '#FFF176', '#FFA726'],
        startVelocity: 22,
        gravity: 0.7,
        decay: 0.90,
        ticks: 100,
        shapes: ['circle'],
        scalar: 0.65,
        disableForReducedMotion: false,
      });
    }, fc.delay);
  });
}
