import React, { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const GlobalSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for subtle cosmic parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate 220 depth-sorted stars
    const starColors = ['#FFFFFF', '#C5E6FF', '#00D2FF', '#D8B4FE', '#FDE047'];
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 3 + 1, // 1 to 4 depth
      radius: Math.random() * 1.5 + 0.5,
      baseAlpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // Shooting stars
    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    };

    const spawnShootingStar = () => {
      shootingStar.x = Math.random() * width * 0.8;
      shootingStar.y = Math.random() * height * 0.4;
      shootingStar.length = Math.random() * 80 + 50;
      shootingStar.speed = Math.random() * 8 + 12;
      shootingStar.angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // roughly 45 degrees
      shootingStar.alpha = 1;
      shootingStar.active = true;
    };

    let timeSinceLastShootingStar = 0;

    const render = () => {
      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const offsetX = (mouseX - width / 2) * 0.015;
      const offsetY = (mouseY - height / 2) * 0.015;

      ctx.clearRect(0, 0, width, height);

      // Deep Space Base Fill
      ctx.fillStyle = '#05070E';
      ctx.fillRect(0, 0, width, height);

      // Multiple Ambient Cosmic Nebulae
      // Nebula 1: Electric Cyan (top right)
      const gradCyan = ctx.createRadialGradient(
        width * 0.8 + offsetX * 2,
        height * 0.2 + offsetY * 2,
        40,
        width * 0.8,
        height * 0.2,
        width * 0.45
      );
      gradCyan.addColorStop(0, 'rgba(0, 210, 255, 0.08)');
      gradCyan.addColorStop(0.6, 'rgba(0, 210, 255, 0.02)');
      gradCyan.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradCyan;
      ctx.fillRect(0, 0, width, height);

      // Nebula 2: Deep Violet / Magenta (bottom left)
      const gradViolet = ctx.createRadialGradient(
        width * 0.15 - offsetX * 2,
        height * 0.8 - offsetY * 2,
        50,
        width * 0.15,
        height * 0.8,
        width * 0.5
      );
      gradViolet.addColorStop(0, 'rgba(124, 58, 237, 0.07)');
      gradViolet.addColorStop(0.5, 'rgba(236, 72, 153, 0.03)');
      gradViolet.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradViolet;
      ctx.fillRect(0, 0, width, height);

      // Render Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = Math.max(0.1, star.baseAlpha + Math.sin(star.twinklePhase) * 0.35);

        // Parallax position calculation based on star depth (z)
        const renderX = (star.x + offsetX * star.z + width) % width;
        const renderY = (star.y + offsetY * star.z + height) % height;

        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        if (star.z > 2.5) {
          ctx.shadowColor = star.color;
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1.0;

      // Render Shooting Star
      timeSinceLastShootingStar++;
      if (!shootingStar.active && timeSinceLastShootingStar > 240 && Math.random() < 0.02) {
        spawnShootingStar();
        timeSinceLastShootingStar = 0;
      }

      if (shootingStar.active) {
        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        starGrad.addColorStop(0, 'rgba(0, 210, 255, 0)');
        starGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.015;

        if (
          shootingStar.alpha <= 0 ||
          shootingStar.x > width ||
          shootingStar.y > height
        ) {
          shootingStar.active = false;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
