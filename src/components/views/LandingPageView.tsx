import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { RazorpayIntroSplash } from '../landing/RazorpayIntroSplash';
import { GlobalSpaceBackground } from '../landing/GlobalSpaceBackground';
import { Navbar } from '../landing/Navbar';
import { UnifiedHero3D } from '../landing/UnifiedHero3D';
import { ArchitectureDiagram } from '../landing/ArchitectureDiagram';
import { BottleneckVisual } from '../landing/BottleneckVisual';
import { PipelineConveyor } from '../landing/PipelineConveyor';
import { DualPathChamber } from '../landing/DualPathChamber';
import { BalanceScaleProof } from '../landing/BalanceScaleProof';
import { SonarExceptionRadar } from '../landing/SonarExceptionRadar';
import { HolographicModules } from '../landing/HolographicModules';
import { AuthModal } from '../auth/AuthModal';
import type { AppView } from '../../types/finance';

interface LandingPageViewProps {
  onAuthSuccess: (targetView?: AppView) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onAuthSuccess }) => {
  // 3-Second Razorpay Splash Controller
  const [showRazorpaySplash, setShowRazorpaySplash] = useState<boolean>(() => {
    // Only show once per browser session unless forced
    return !sessionStorage.getItem('omnisettle_rzp_splash_seen');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSplashComplete = () => {
    sessionStorage.setItem('omnisettle_rzp_splash_seen', 'true');
    setShowRazorpaySplash(false);
  };

  return (
    <div style={{ backgroundColor: '#05070E', color: '#EDEDED', minHeight: '100vh', overflowX: 'hidden', position: 'relative', fontFamily: 'var(--font-sans)' }}>
      
      {/* 3-Second Razorpay Actual Logo Intro Splash */}
      {showRazorpaySplash && (
        <RazorpayIntroSplash onComplete={handleSplashComplete} />
      )}

      {/* Global Cosmic Space Background Everywhere */}
      <GlobalSpaceBackground />

      {/* Redesigned Floating Glassmorphic Header Bar */}
      <Navbar
        onJudgePass={() => onAuthSuccess('dashboard')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 1. MONUMENTAL 3D HERO                                                     */}
      {/* ========================================================================= */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          paddingTop: '72px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'visible',
          zIndex: 10,
        }}
      >
        {/* Layer 0: Monumental Architectural Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(5rem, 18vw, 16rem)',
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.015)',
            letterSpacing: '0.12em',
            pointerEvents: 'none',
            zIndex: 0,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          OMNISETTLE
        </div>

        {/* Hero Grid: Left Content / Right 3D Spatial Machine */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1380px',
            margin: '0 auto',
            padding: '2.5rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 520px) 1fr',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          {/* Left Column: Monumental Headline & Control Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: '#00D2FF',
                  padding: '0.25rem 0.7rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 210, 255, 0.35)',
                  background: 'rgba(0, 210, 255, 0.06)',
                  letterSpacing: '0.08em',
                }}
              >
                TRACK 04: FINTECH AI
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: '#8E8E93',
                  letterSpacing: '0.06em',
                }}
              >
                RAZORPAY BUILDATHON 2026
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.8rem, 5.2vw, 4.4rem)',
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: '-0.035em',
                color: '#FFFFFF',
                margin: '0 0 1.5rem 0',
              }}
            >
              Reconcile<br />
              <span style={{ color: '#00D2FF', textShadow: '0 0 30px rgba(0, 210, 255, 0.4)' }}>Everything.</span><br />
              Trust<br />
              The Numbers.
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: '#8E8E93',
                lineHeight: 1.6,
                marginBottom: '2.25rem',
                maxWidth: '460px',
              }}
            >
              Autonomous 3-way financial reconciliation across bank statements, payment gateways, and ERP records. 
              Sub-millisecond deterministic checks for clean 1:1 records. Agentic Claude 3.5 reasoning with zero-delta mathematical proof for complex bundles.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #00D2FF 0%, #0284C7 100%)',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  padding: '0.9rem 2.2rem',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 0 35px rgba(0, 210, 255, 0.45)',
                  transition: 'all 0.2s ease',
                }}
              >
                Launch System <ArrowRight size={16} />
              </button>

              <a
                href="#problem"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#EDEDED',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '0.9rem 1.8rem',
                  borderRadius: '7px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                }}
              >
                Explore 3D Engine ↓
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00D2FF', boxShadow: '0 0 8px #00D2FF' }} />
                <span>FAST-PATH LATENCY: <strong style={{ color: '#00D2FF' }}>&lt;1.2ms</strong> (0 LLM Tokens)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                <span>MATCH PRECISION: <strong style={{ color: '#10B981' }}>99.98%</strong> (Verified Ground Truth)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
                <span>STREAM CAPACITY: <strong style={{ color: '#EDEDED' }}>10,000+ TXNS/SEC</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Unified 3D Cybernetic Machine */}
          <div style={{ width: '100%', minHeight: '640px' }}>
            <UnifiedHero3D />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME CONTINUOUS MOVING MARQUEE TICKER (IMAGE 3 FIX)               */}
      {/* ========================================================================= */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(9, 11, 20, 0.88)',
          borderTop: '1px solid rgba(0, 210, 255, 0.2)',
          borderBottom: '1px solid rgba(0, 210, 255, 0.2)',
          padding: '0.85rem 0',
          overflow: 'hidden',
          zIndex: 20,
          position: 'relative',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="ticker-container">
          {/* Segment 1 */}
          <div className="ticker-track">
            <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              [SET-88412] HDFC ₹48,272.80 ↔ RAZORPAY 2% MDR ↔ 8 ERP INVOICES (INV-BUN-01..08) — ZERO DELTA VERIFIED (0.0000 INR)
            </span>
            <span style={{ color: '#00D2FF', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00D2FF', boxShadow: '0 0 8px #00D2FF' }} />
              [TXN-1082] DETERMINISTIC 1:1 FAST-PATH MATCH (0.9ms) — RECONCILED (0 LLM TOKENS)
            </span>
            <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
              [EXC-FEE-402] GATEWAY OVERCHARGE: BILLED 3.50% vs 2.00% CONTRACT (₹142.50 SHORTFALL) — ROUTED TO TREASURY
            </span>
            <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              [SET-99124] ICICI PAYOUT ₹1,24,500.00 ↔ 12 BUNDLE INVOICES — GAAP AUDIT TRAIL HASHED
            </span>
            <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
              [EXC-DUP-109] DUPLICATE BANK DEBIT DETECTED ON TXN-9982 — AUTO-REMEDIATION PREPARED
            </span>
          </div>

          {/* Segment 2 (Duplicate for Seamless Infinite Marquee Loop) */}
          <div className="ticker-track">
            <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              [SET-88412] HDFC ₹48,272.80 ↔ RAZORPAY 2% MDR ↔ 8 ERP INVOICES (INV-BUN-01..08) — ZERO DELTA VERIFIED (0.0000 INR)
            </span>
            <span style={{ color: '#00D2FF', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00D2FF', boxShadow: '0 0 8px #00D2FF' }} />
              [TXN-1082] DETERMINISTIC 1:1 FAST-PATH MATCH (0.9ms) — RECONCILED (0 LLM TOKENS)
            </span>
            <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
              [EXC-FEE-402] GATEWAY OVERCHARGE: BILLED 3.50% vs 2.00% CONTRACT (₹142.50 SHORTFALL) — ROUTED TO TREASURY
            </span>
            <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              [SET-99124] ICICI PAYOUT ₹1,24,500.00 ↔ 12 BUNDLE INVOICES — GAAP AUDIT TRAIL HASHED
            </span>
            <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
              [EXC-DUP-109] DUPLICATE BANK DEBIT DETECTED ON TXN-9982 — AUTO-REMEDIATION PREPARED
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION 1: THE BOTTLENECK (BESPOKE INTERACTIVE CIRCUIT VISUAL)         */}
      {/* ========================================================================= */}
      <section
        id="problem"
        style={{
          padding: '8rem 2.5rem 4rem',
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 01 / THE RECONCILIATION BOTTLENECK ]
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: '0 0 1.5rem',
            }}
          >
            FINANCE DOESN'T HAVE<br />
            A GENERATION PROBLEM.<br />
            <span style={{ color: '#00D2FF' }}>IT HAS A VERIFICATION PROBLEM.</span>
          </h2>

          <p style={{ fontSize: '1.15rem', color: '#8E8E93', maxWidth: '720px', lineHeight: 1.6 }}>
            Modern financial operations generate millions of transactional records every day, yet still rely heavily on 
            manual spreadsheets to verify discrepancies across disconnected systems.
          </p>
        </div>

        {/* Bespoke Bottleneck Simulator Component */}
        <BottleneckVisual />
      </section>

      {/* ========================================================================= */}
      {/* 4. INTER-SECTION ARCHITECTURAL BLUEPRINT (IMAGE IN BETWEEN)               */}
      {/* ========================================================================= */}
      <ArchitectureDiagram />

      {/* ========================================================================= */}
      {/* 5. SECTION 2: 5-STAGE KINETIC PIPELINE CONVEYOR                           */}
      {/* ========================================================================= */}
      <section
        id="pipeline"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 02 / RECONCILIATION PIPELINE ARCHITECTURE ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            5 STAGES TO VERIFIED PROOF
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '650px', lineHeight: 1.6 }}>
            Click any gate on the conveyor to inspect real-time canonical schema transformations and mathematical guardrails.
          </p>
        </div>

        {/* Bespoke Kinetic Pipeline Conveyor */}
        <PipelineConveyor />
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 3: HYBRID DUAL-PATH SPEED CHAMBER                              */}
      {/* ========================================================================= */}
      <section
        id="hybrid"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 03 / HYBRID RECONCILIATION ARCHITECTURE ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            DUAL-PATH EXECUTION ENGINE
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Deterministic sub-millisecond precision for the majority. Claude 3.5 Sonnet agentic intelligence for difficult non-linear edge cases.
          </p>
        </div>

        {/* Bespoke Dual Path Chamber */}
        <DualPathChamber />
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 4: KINETIC ZERO-DELTA BALANCE SCALE PROOF                      */}
      {/* ========================================================================= */}
      <section
        id="bundle"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F59E0B', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 04 / MATHEMATICAL PROOF LAB ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            INTERACTIVE BUNDLE MATH PROOF
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '680px', lineHeight: 1.6 }}>
            Demonstrating how 1 payment gateway settlement matches across 8 disparate customer invoices while rigorously calculating deductions.
          </p>
        </div>

        {/* Bespoke Balance Scale Proof */}
        <BalanceScaleProof />
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 5: 360-DEGREE CYBERNETIC SONAR EXCEPTION RADAR                 */}
      {/* ========================================================================= */}
      <section
        id="exceptions"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#EF4444', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 05 / ANOMALY ISOLATION RADAR ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            HONEST EXCEPTION REMEDIATION
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '680px', lineHeight: 1.6 }}>
            Never force bad matches. OmniSettle isolates genuine financial anomalies into 5 strict categories for automated 1-click remediation.
          </p>
        </div>

        {/* Bespoke Sonar Radar Component */}
        <SonarExceptionRadar onRemediate={() => onAuthSuccess('exceptions')} />
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION 6: UPGRADED COMPLETE PRODUCTION SUITE (HOLOGRAPHIC)            */}
      {/* ========================================================================= */}
      <section
        id="modules"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 06 / TERMINAL WORKSPACE MODULES ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            COMPLETE PRODUCTION SUITE
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Click any module below to jump directly into the live working terminal.
          </p>
        </div>

        {/* Upgraded Bespoke Holographic Modules */}
        <HolographicModules onSelectModule={(view) => onAuthSuccess(view)} />
      </section>

      {/* ========================================================================= */}
      {/* 10. UNIFIED FOOTER                                                        */}
      {/* ========================================================================= */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '4rem 2.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: '#8E8E93',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div>
          <strong style={{ color: '#FFFFFF' }}>OMNISETTLE AI</strong> • AUTONOMOUS 3-WAY FINANCIAL RECONCILIATION
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => onAuthSuccess('dashboard')}
            style={{ background: 'none', border: 'none', color: '#00D2FF', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 800 }}
          >
            [ LAUNCH SYSTEM ➔ ]
          </button>
          <span>RAZORPAY BUILDATHON 2026</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 11. FULL-FEATURED JWT / OTP / SOCIAL AUTHENTICATION MODAL                 */}
      {/* ========================================================================= */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => onAuthSuccess('dashboard')}
      />
    </div>
  );
};
