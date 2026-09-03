import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './HeroSection.css';

export interface HeroSectionProps {
  onGetStarted?: () => void;
  onSeeAction?: () => void;
  onOpenMovableUI?: () => void;
  onOperatorLogin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onSeeAction,
  onOpenMovableUI,
  onOperatorLogin,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ---------------------------------------------------------------------------
  // MOUSE PARALLAX TILT (3D Scene Orientation)
  // ---------------------------------------------------------------------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Subtle 3D tilt angles (max 4-5 degrees)
  const sceneRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [4, -4]);
  const sceneRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

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
  // FRAMER MOTION VARIANTS (STAGGERED TYPOGRAPHY & ENTRANCES)
  // ---------------------------------------------------------------------------
  const CUBIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const navVariants = {
    hidden: { opacity: 0, y: -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: CUBIC_EASE },
    },
  };

  const lineVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: CUBIC_EASE,
        delay: 0.12 * custom,
      },
    }),
  };

  const subtextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: CUBIC_EASE, delay: 0.55 },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: CUBIC_EASE, delay: 0.72 },
    },
  };

  const headlineLines = [
    'The Smarter,',
    'AI-Powered',
    'Reconciliation',
    'Terminal',
  ];

  return (
    <div
      className="aura-hero-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ===================================================================== */}
      {/* BACKGROUND TEXTURE: SCATTERED PARTICLES & ISOMETRIC FLOOR LINES       */}
      {/* ===================================================================== */}
      <svg className="aura-bg-texture" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Subtle diagonal line gradient */}
          <linearGradient id="gridLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A1B2E" stopOpacity="0.01" />
            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#1A1B2E" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* 2-3 Ultra-Thin Diagonal Light Seam Lines */}
        <line x1="20%" y1="-10%" x2="110%" y2="80%" stroke="url(#gridLineGrad)" strokeWidth="1.2" strokeDasharray="6 8" />
        <line x1="45%" y1="-20%" x2="135%" y2="70%" stroke="url(#gridLineGrad)" strokeWidth="1" />
        <line x1="-5%" y1="35%" x2="85%" y2="115%" stroke="url(#gridLineGrad)" strokeWidth="1" />

        {/* Faint scattered particle dots */}
        <circle cx="8%" cy="18%" r="1.5" fill="#7C3AED" fillOpacity="0.18" />
        <circle cx="16%" cy="42%" r="1.2" fill="#1A1B2E" fillOpacity="0.12" />
        <circle cx="28%" cy="24%" r="1.8" fill="#EC4899" fillOpacity="0.15" />
        <circle cx="34%" cy="68%" r="1.3" fill="#7C3AED" fillOpacity="0.14" />
        <circle cx="48%" cy="15%" r="1.6" fill="#1A1B2E" fillOpacity="0.1" />
        <circle cx="52%" cy="85%" r="1.4" fill="#7C3AED" fillOpacity="0.16" />
        <circle cx="68%" cy="30%" r="2" fill="#EC4899" fillOpacity="0.12" />
        <circle cx="78%" cy="75%" r="1.5" fill="#1A1B2E" fillOpacity="0.15" />
        <circle cx="88%" cy="18%" r="1.8" fill="#7C3AED" fillOpacity="0.18" />
        <circle cx="94%" cy="52%" r="1.4" fill="#EC4899" fillOpacity="0.14" />
      </svg>

      {/* ===================================================================== */}
      {/* 1. TOP TRANSPARENT NAVIGATION BAR                                     */}
      {/* ===================================================================== */}
      <motion.nav
        className="aura-navbar"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        {/* Brand Mark: Violet-to-Pink Droplet + Navy Wordmark */}
        <a href="#hero" className="aura-brand-group">
          <div className="aura-logo-mark">
            <div className="aura-logo-inner-dot" />
          </div>
          <span className="aura-brand-name">aura ledger</span>
        </a>

        {/* Center-Right Navigation Links */}
        <div className="aura-nav-center-links">
          <a href="#reconciliation" className="aura-nav-link">Reconciliation</a>
          <a href="#agentic-ai" className="aura-nav-link">Agentic AI</a>
          <a href="#sandbox" className="aura-nav-link">Sandbox</a>
          <a href="#about" className="aura-nav-link">About</a>
        </div>

        {/* Far Right Pill Button & Optional Movable Tiles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onOpenMovableUI && (
            <button
              onClick={onOpenMovableUI}
              className="aura-nav-btn-pill"
              style={{ background: 'transparent', borderColor: 'rgba(124, 58, 237, 0.3)', color: '#7C3AED' }}
            >
              🎨 Movable Tiles
            </button>
          )}
          <button 
            onClick={onOperatorLogin || onGetStarted}
            className="aura-nav-btn-pill"
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* ===================================================================== */}
      {/* 2. HERO CONTENT GRID (45% LEFT / 55% RIGHT)                          */}
      {/* ===================================================================== */}
      <div className="aura-hero-grid">
        
        {/* LEFT COLUMN: MASSIVE 4-LINE HEADLINE & ACTION BUTTONS */}
        <div className="aura-left-column">
          <h1 className="aura-headline">
            {headlineLines.map((line, idx) => (
              <span key={line} className="aura-headline-line">
                <motion.span
                  style={{ display: 'inline-block' }}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={lineVariants}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="aura-subtext"
            initial="hidden"
            animate="visible"
            variants={subtextVariants}
          >
            Harness agentic AI to reconcile bank, gateway, and ERP data automatically with Aura Ledger.
          </motion.p>

          <motion.div
            className="aura-cta-row"
            initial="hidden"
            animate="visible"
            variants={ctaVariants}
          >
            <button 
              onClick={onGetStarted}
              className="aura-btn-primary"
            >
              Get Started ➔
            </button>
            <a 
              href="#problem" 
              onClick={(e) => {
                if (onSeeAction) {
                  e.preventDefault();
                  onSeeAction();
                }
              }}
              className="aura-btn-ghost"
            >
              See it in action
            </a>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: PURE CSS/SVG 3D ISOMETRIC ARCHITECTURE */}
        <div className="aura-right-column">
          <motion.div
            className="aura-3d-scene-container"
            style={{
              rotateX: isMobile ? 0 : sceneRotateX,
              rotateY: isMobile ? 0 : sceneRotateY,
            }}
          >
            {/* --------------------------------------------------------------- */}
            {/* PLATFORM BLOCK 01 (LOWER BASE ISOMETRIC BLOCK)                  */}
            {/* --------------------------------------------------------------- */}
            <motion.div
              className="aura-iso-block"
              style={{
                top: '44%',
                left: '26%',
                width: '360px',
                height: '240px',
                zIndex: 5,
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 360 240" fill="none">
                <defs>
                  {/* Top face smooth ambient gradient */}
                  <linearGradient id="topFaceGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="60%" stopColor="#F9F7FC" />
                    <stop offset="100%" stopColor="#F1ECF8" />
                  </linearGradient>

                  {/* Left extrusion shaded face */}
                  <linearGradient id="leftFaceGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E5DFEF" />
                    <stop offset="100%" stopColor="#D5CDDF" />
                  </linearGradient>

                  {/* Right extrusion shaded face */}
                  <linearGradient id="rightFaceGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#DDD4E8" />
                    <stop offset="100%" stopColor="#C8BDD7" />
                  </linearGradient>

                  {/* Diffuse Under-Block Glow Filter */}
                  <filter id="blockGlowFilter1" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="14" result="blur" />
                    <feColorMatrix type="matrix" values="
                      1 0 0 0 0.92
                      0 0.3 0 0 0.28
                      0 0 0.9 0 0.85
                      0 0 0 0.55 0" />
                  </filter>
                </defs>

                {/* Ambient Floor Shadow under Block */}
                <ellipse cx="180" cy="205" rx="150" ry="24" fill="rgba(26, 27, 46, 0.08)" />

                {/* Glowing Neon Light Strip under edge */}
                <path d="M 30 170 L 180 230 L 330 170" stroke="#EC4899" strokeWidth="6" opacity="0.6" filter="url(#blockGlowFilter1)" />
                <path d="M 30 170 L 180 230 L 330 170" stroke="#7C3AED" strokeWidth="2.5" opacity="0.9" />

                {/* Left Side Extrusion Face */}
                <polygon points="30,120 180,180 180,230 30,170" fill="url(#leftFaceGrad1)" />

                {/* Right Side Extrusion Face */}
                <polygon points="180,180 330,120 330,170 180,230" fill="url(#rightFaceGrad1)" />

                {/* Top Isometric Face with carved ribbon guide */}
                <polygon points="180,60 330,120 180,180 30,120" fill="url(#topFaceGrad1)" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Carved Cylindrical Groove / Scoop (Matching Dribbble Shot) */}
                <path
                  d="M 120 135 C 150 145, 175 145, 205 125 C 230 110, 250 95, 270 95"
                  stroke="#E8E1F3"
                  strokeWidth="28"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 120 135 C 150 145, 175 145, 205 125 C 230 110, 250 95, 270 95"
                  stroke="#DDD4EA"
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </motion.div>

            {/* --------------------------------------------------------------- */}
            {/* PLATFORM BLOCK 02 (UPPER ELEVATED FLOATING STEP)                */}
            {/* --------------------------------------------------------------- */}
            <motion.div
              className="aura-iso-block"
              style={{
                top: '16%',
                left: '48%',
                width: '280px',
                height: '190px',
                zIndex: 8,
              }}
              animate={{ y: [0, -7, 0] }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 280 190" fill="none">
                <defs>
                  <linearGradient id="topFaceGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F5F1FB" />
                  </linearGradient>
                  <linearGradient id="leftFaceGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E4DCEF" />
                    <stop offset="100%" stopColor="#D4C9DF" />
                  </linearGradient>
                  <linearGradient id="rightFaceGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#DBD0E8" />
                    <stop offset="100%" stopColor="#C4B7D5" />
                  </linearGradient>
                </defs>

                {/* Soft ambient occlusion shadow */}
                <ellipse cx="140" cy="165" rx="110" ry="18" fill="rgba(26, 27, 46, 0.07)" />

                {/* Glow Strip peeking out underneath */}
                <path d="M 25 135 L 140 180 L 255 135" stroke="#EC4899" strokeWidth="4" opacity="0.4" filter="drop-shadow(0 4px 10px #EC4899)" />

                {/* Left Side Extrusion */}
                <polygon points="25,95 140,140 140,180 25,135" fill="url(#leftFaceGrad2)" />

                {/* Right Side Extrusion */}
                <polygon points="140,140 255,95 255,135 140,180" fill="url(#rightFaceGrad2)" />

                {/* Top Isometric Face */}
                <polygon points="140,50 255,95 140,140 25,95" fill="url(#topFaceGrad2)" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
            </motion.div>

            {/* --------------------------------------------------------------- */}
            {/* PLATFORM BLOCK 03 (LOWER BACKGROUND STEP BLEEDING OFF RIGHT)    */}
            {/* --------------------------------------------------------------- */}
            <motion.div
              className="aura-iso-block"
              style={{
                top: '60%',
                left: '62%',
                width: '320px',
                height: '210px',
                zIndex: 3,
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.2,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 320 210" fill="none">
                <defs>
                  <linearGradient id="topFaceGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FAF8FD" />
                    <stop offset="100%" stopColor="#EFE8F7" />
                  </linearGradient>
                </defs>
                <polygon points="20,105 160,150 160,195 20,150" fill="#DDD5E8" />
                <polygon points="160,150 300,105 300,150 160,195" fill="#CFC3DE" />
                <polygon points="160,60 300,105 160,150 20,105" fill="url(#topFaceGrad3)" stroke="#FFFFFF" strokeWidth="1" />
              </svg>
            </motion.div>

            {/* --------------------------------------------------------------- */}
            {/* 3D CURVED SHADED RIBBON / TUBE SNAKING THROUGH THE BLOCKS       */}
            {/* --------------------------------------------------------------- */}
            <svg
              style={{
                position: 'absolute',
                top: '4%',
                left: '18%',
                width: '560px',
                height: '520px',
                pointerEvents: 'none',
                zIndex: 12,
                overflow: 'visible',
              }}
              viewBox="0 0 560 520"
              fill="none"
            >
              <defs>
                {/* 3D Tube Specular Lighting Gradient */}
                <linearGradient id="tubeVolumetricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#FAF8FD" />
                  <stop offset="70%" stopColor="#E4DCF0" />
                  <stop offset="100%" stopColor="#C9BCD8" />
                </linearGradient>

                {/* Soft Ribbon Ambient Drop Shadow */}
                <filter id="ribbonShadow" x="-20%" y="-20%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#1A1B2E" floodOpacity="0.1" />
                </filter>
              </defs>

              {/* Underlying Ambient Shadow Curve */}
              <path
                d="M 280 -20 C 310 80, 240 140, 230 210 C 220 280, 290 320, 310 380"
                stroke="rgba(26, 27, 46, 0.08)"
                strokeWidth="48"
                strokeLinecap="round"
                fill="none"
              />

              {/* Outer Volume of 3D Tube */}
              <path
                d="M 280 -20 C 310 80, 240 140, 230 210 C 220 280, 290 320, 310 380"
                stroke="url(#tubeVolumetricGrad)"
                strokeWidth="38"
                strokeLinecap="round"
                fill="none"
                filter="url(#ribbonShadow)"
              />

              {/* Specular Core Highlight on Tube */}
              <path
                d="M 280 -20 C 310 80, 240 140, 230 210 C 220 280, 290 320, 310 380"
                stroke="#FFFFFF"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
            </svg>

            {/* --------------------------------------------------------------- */}
            {/* SMALL GOLD COIN WITH Y-AXIS SPIN & ALONG-RIBBON TRAVEL ANIMATION */}
            {/* --------------------------------------------------------------- */}
            <motion.div
              className="aura-gold-coin"
              style={{
                top: '71%',
                left: '67%',
              }}
              animate={{
                // Travel gently back and forth along the ribbon's end trajectory
                x: [0, -18, -28, -12, 0],
                y: [0, -8, -14, -4, 0],
                // Gentle Y-axis tilt/spin (scaleX oscillation between 0.85 and 1.0)
                scaleX: [1, 0.86, 0.98, 0.88, 1],
                rotateZ: [-12, -8, -14, -10, -12],
              }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="aura-coin-inner-ring">
                ◈
              </div>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};
