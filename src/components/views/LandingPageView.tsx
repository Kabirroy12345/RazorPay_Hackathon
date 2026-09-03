import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  FileText, 
  X, 
  Sparkles, 
  Database,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  Calculator,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { HeroCanvas3D } from '../landing/HeroCanvas3D';
import type { AppView } from '../../types/finance';

interface LandingPageViewProps {
  onAuthSuccess: (targetView?: AppView) => void;
  onOpenMovableUI?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onAuthSuccess, onOpenMovableUI }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Section 2 Interactive Pipeline Step
  const [activePipelineStep, setActivePipelineStep] = useState(2);

  // Section 4 Bundle Math Step
  const [bundleMathStep, setBundleMathStep] = useState<1 | 2 | 3 | 4>(4);

  // Section 6 Exception Inspector Selection
  const [selectedExceptionIndex, setSelectedExceptionIndex] = useState(0);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please complete all credential fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthModalOpen(false);
      onAuthSuccess('dashboard');
    }, 800);
  };

  const handlePresetLogin = (presetEmail: string, roleName: string) => {
    setEmail(presetEmail);
    setPassword('••••••••••••');
    setName(roleName);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthModalOpen(false);
      onAuthSuccess('dashboard');
    }, 600);
  };

  const exceptionsData = [
    {
      id: 'EXC-FEE-402',
      type: 'FEE OVERCHARGE',
      source: 'Payment Gateway',
      discrepancy: '₹142.50 shortfall',
      cause: 'Gateway billed 3.50% fee tier instead of contracted 2.00% rate on batch SET-88412.',
      payload: '{"contractRate": 0.02, "appliedRate": 0.035, "gross": 9500, "overbilled": 142.50}',
      actionText: 'AUTO-GENERATE RAZORPAY DISPUTE WEBHOOK',
    },
    {
      id: 'EXC-DUP-109',
      type: 'DUPLICATE DEDUCTION',
      source: 'Bank Statement',
      discrepancy: '₹4,900.00 duplicate debit',
      cause: 'Two identical settlement debits detected on same reference ID TXN-9982 within 4 minutes.',
      payload: '{"referenceId": "TXN-9982", "firstDebit": "14:02:11Z", "secondDebit": "14:06:03Z"}',
      actionText: 'FLAG DUPLICATE TO TREASURY OPERATIONS',
    },
    {
      id: 'EXC-MIS-883',
      type: 'MISSING SETTLEMENT',
      source: 'ERP Ledger',
      discrepancy: '₹12,400.00 uncredited',
      cause: 'Invoice INV-2026-883 marked settled in ERP but no bank credit or gateway payout was found.',
      payload: '{"invoiceId": "INV-2026-883", "erpStatus": "PAID", "bankMatch": null}',
      actionText: 'HOLD RECO ENTRY & REQUEST GATEWAY AUDIT',
    },
    {
      id: 'EXC-FX-301',
      type: 'AMOUNT MISMATCH',
      source: 'Multi-Currency Gateway',
      discrepancy: '₹450.00 FX variance',
      cause: 'USD Wire rate fluctuation exceeded allowable ±0.50% corridor (actual variance: 1.12%).',
      payload: '{"baseCurrency": "USD", "settlementINR": 83250, "expectedINR": 82800}',
      actionText: 'FORWARD TO FX RISK DESK FOR CORRIDOR SIGN-OFF',
    },
    {
      id: 'EXC-AMB-504',
      type: 'AMBIGUOUS MATCH',
      source: '3-Way Vector Space',
      discrepancy: '2 identical candidates',
      cause: 'Two separate orders share identical ₹5,000 amount and customer name without unique reference.',
      payload: '{"candidates": ["INV-BUN-07", "INV-BUN-08"], "amount": 5000, "customer": "Apex Solutions"}',
      actionText: 'ROUTE TO CONTROLLER REVIEW QUEUE',
    },
  ];

  const pipelineStages = [
    {
      id: 0,
      title: '1. Ingestion',
      subtitle: 'Multi-Source Streams',
      desc: 'Ingests real-time Bank MT940/CAMT feeds, Razorpay settlement batches, and ERP invoices via secure event streams.',
    },
    {
      id: 1,
      title: '2. Normalization',
      subtitle: 'Canonical Schema',
      desc: 'Standardizes timestamps, parses gross vs net payouts, strips gateway transaction fees, and factors GST deductions.',
    },
    {
      id: 2,
      title: '3. Dual-Path Matching',
      subtitle: 'Fast-Path + Agentic AI',
      desc: 'Routes clean 1:1 records through sub-millisecond deterministic checks, and routes complex bundles to Claude 3.5 AI.',
    },
    {
      id: 3,
      title: '4. Mathematical Proof',
      subtitle: 'Zero Delta Verification',
      desc: 'Evaluates Gross - Gateway Fee - GST - Refunds == Bank Net. Matches are approved ONLY when math balances perfectly.',
    },
    {
      id: 4,
      title: '5. Immutable Resolution',
      subtitle: 'GAAP Ledgering',
      desc: 'Produces boardroom-ready GAAP reconciliation vectors, hashes audit trails, and isolates anomalies for 1-click remediation.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#070709', color: '#EDEDED', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ========================================================================= */}
      {/* 1. TOP STICKY NAVIGATION BAR                                              */}
      {/* ========================================================================= */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '68px',
          backgroundColor: 'rgba(7, 7, 9, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
        }}
      >
        {/* Brand Lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00D2FF 0%, #0284C7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 210, 255, 0.35)',
              }}
            >
              <ShieldCheck size={18} color="#000" />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.06em', color: '#FFFFFF' }}>
              OMNISETTLE<span style={{ color: '#00D2FF' }}>.AI</span>
            </span>
          </div>

          <div
            style={{
              fontSize: '0.68rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10B981',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            LIVE PIPELINE ONLINE
          </div>
        </div>

        {/* Story Section Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }} className="desktop-nav-links">
            <a href="#problem" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>PROBLEM</a>
            <a href="#pipeline" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>PIPELINE</a>
            <a href="#hybrid" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>HYBRID ENGINE</a>
            <a href="#bundle" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>BUNDLE SOLVER</a>
            <a href="#exceptions" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>EXCEPTIONS</a>
            <a href="#modules" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>SYSTEM MODULES</a>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onOpenMovableUI && (
              <button
                onClick={onOpenMovableUI}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  color: '#00D2FF',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                🎨 MOVABLE TILES
              </button>
            )}

            <button
              onClick={() => onAuthSuccess('dashboard')}
              style={{
                background: 'linear-gradient(135deg, #00D2FF 0%, #0284C7 100%)',
                border: 'none',
                color: '#000000',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)',
              }}
            >
              <Zap size={14} /> 1-CLICK JUDGE PASS
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#EDEDED',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              OPERATOR LOGIN
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: CINEMATIC 3D FINANCIAL NETWORK STREAM                    */}
      {/* ========================================================================= */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '80px',
          paddingBottom: '3rem',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Interactive 3D Canvas Background */}
        <HeroCanvas3D />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '920px', padding: '0 1.5rem', margin: '0 auto' }}>
          
          {/* Announcement Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              color: '#8E8E93',
              marginBottom: '1.75rem',
            }}
          >
            <Sparkles size={13} color="#00D2FF" />
            <span>BUILT FOR RAZORPAY BUILDATHON 2026 • TRACK 04: FINTECH AI</span>
          </div>

          {/* Monumental Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              margin: '0 0 1.5rem 0',
              textShadow: '0 0 60px rgba(0, 210, 255, 0.15)',
            }}
          >
            Reconcile Everything.<br />
            <span style={{ color: '#00D2FF' }}>Trust the Numbers.</span>
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#8E8E93',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
            }}
          >
            Autonomous 3-way financial reconciliation across bank statements, payment gateways, and ERP records. 
            AI-powered reasoning for complex settlements. Deterministic verification for everything else.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onAuthSuccess('dashboard')}
              style={{
                background: 'linear-gradient(135deg, #00D2FF 0%, #0284C7 100%)',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: '0.9rem 2.2rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 35px rgba(0, 210, 255, 0.4)',
                transition: 'transform 0.2s ease',
              }}
            >
              Launch System <ArrowRight size={17} />
            </button>

            <a
              href="#problem"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#EDEDED',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '0.9rem 2rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s ease',
              }}
            >
              Explore Engine ↓
            </a>
          </div>
        </div>

        {/* Live Empirical Stat Ticker */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1100px',
            marginTop: '4.5rem',
            padding: '1.25rem 2rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(13, 13, 17, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: '#00D2FF' }}>
              ₹4.8M+
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
              RECONCILED VOLUME
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>
              99.98%
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
              PRECISION ACCURACY
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B' }}>
              &lt;1.2ms
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
              FAST-PATH LATENCY
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: '#EDEDED' }}>
              82%
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', letterSpacing: '0.08em', marginTop: '0.2rem' }}>
              TOKEN COST REDUCTION
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 1: THE RECONCILIATION PROBLEM                                  */}
      {/* ========================================================================= */}
      <section
        id="problem"
        style={{
          padding: '7rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.18em', marginBottom: '1rem' }}>
            [ 01 / THE CORE FINANCIAL BOTTLENECK ]
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: '0 0 1.5rem',
            }}
          >
            FINANCE DOESN'T HAVE<br />
            A GENERATION PROBLEM.<br />
            <span style={{ color: '#00D2FF' }}>IT HAS A VERIFICATION PROBLEM.</span>
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Modern financial operations generate millions of transactional records every day, yet still rely heavily on 
            manual spreadsheets to reconcile discrepancies across disconnected systems.
          </p>
        </div>

        {/* 3 Disconnected Silos Moving Toward Verification */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Silo 1: Bank Statements */}
          <div
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(0, 210, 255, 0.25)',
              borderRadius: '12px',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D2FF' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.1em' }}>
                SOURCE 01: BANK STATEMENT
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#FFFFFF' }}>
              Net Lump-Sum Payouts
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#8E8E93', lineHeight: 1.5 }}>
              Bank accounts reflect deposited net cash (e.g. ₹48,272.80) after withholding fees, deductions, and batch timings. 
              Zero invoice-level metadata.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#14141A', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF' }}>
              HDFC / ICICI MT940 / CAMT.053
            </div>
          </div>

          {/* Silo 2: Payment Gateway */}
          <div
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F59E0B', letterSpacing: '0.1em' }}>
                SOURCE 02: PAYMENT GATEWAY
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#FFFFFF' }}>
              MDR Fees, GST & Refunds
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#8E8E93', lineHeight: 1.5 }}>
              Gateways bundle dozens of customer orders into single batch settlements, docking 2% fee tiers, 18% GST on fees, 
              and reversing partial customer refunds.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#14141A', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F59E0B' }}>
              Razorpay Settlement Webhooks
            </div>
          </div>

          {/* Silo 3: ERP Invoices */}
          <div
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '12px',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A855F7' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#A855F7', letterSpacing: '0.1em' }}>
                SOURCE 03: ERP INVOICES
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#FFFFFF' }}>
              Gross Accounts Receivable
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#8E8E93', lineHeight: 1.5 }}>
              Internal billing records show individual customer orders at gross contract value (e.g. ₹5,000.00 each) 
              with no awareness of payment gateway fee deductions.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#14141A', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#A855F7' }}>
              SAP / NetSuite / Tally Prime
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 2: THREE SOURCES. ONE TRUTH. (INTERACTIVE PIPELINE)            */}
      {/* ========================================================================= */}
      <section
        id="pipeline"
        style={{
          padding: '6rem 2rem',
          backgroundColor: '#0A0A0E',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
              [ 02 / RECONCILIATION ARCHITECTURE ]
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Three Sources. One Truth.
            </h2>
            <p style={{ fontSize: '1rem', color: '#8E8E93', marginTop: '0.75rem' }}>
              How records stream through ingestion, normalization, matching, mathematical verification, and GAAP ledgering.
            </p>
          </div>

          {/* 5-Stage Interactive Step Selector */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {pipelineStages.map((stage) => {
              const isActive = activePipelineStep === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActivePipelineStep(stage.id)}
                  style={{
                    background: isActive ? '#14141A' : '#0D0D11',
                    border: isActive ? '1px solid #00D2FF' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: isActive ? '#00D2FF' : '#EDEDED' }}>
                    {stage.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#8E8E93', marginTop: '0.2rem' }}>
                    {stage.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Inspector Box */}
          <div
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={20} color="#00D2FF" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {pipelineStages[activePipelineStep].title} — {pipelineStages[activePipelineStep].subtitle}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10B981' }}>
                STAGE ACTIVE
              </span>
            </div>

            <p style={{ fontSize: '1rem', color: '#EDEDED', lineHeight: 1.6 }}>
              {pipelineStages[activePipelineStep].desc}
            </p>

            {/* Stage Code / Data Preview */}
            <div
              style={{
                background: '#070709',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#8E8E93',
                lineHeight: 1.6,
              }}
            >
              {activePipelineStep === 0 && (
                <div>
                  <span style={{ color: '#00D2FF' }}>// Ingesting Bank Stream:</span> HDFC-MT940 credit ₹48,272.80 [REF: SET-BUNDLE-88412]<br />
                  <span style={{ color: '#F59E0B' }}>// Ingesting Gateway Stream:</span> Razorpay Settlement #SET-BUNDLE-88412 (8 Order IDs)<br />
                  <span style={{ color: '#A855F7' }}>// Ingesting ERP Stream:</span> 8 Invoices INV-BUN-01..08 (Gross: ₹52,000.00)
                </div>
              )}
              {activePipelineStep === 1 && (
                <div>
                  <span style={{ color: '#10B981' }}>[Normalized]</span> Currency: INR | Contract Fee Tier: 2.00% | GST Rate: 18.00%<br />
                  <span style={{ color: '#10B981' }}>[Normalized]</span> Customer Refund Flag: ORD-BUN-04 (₹2,500.00 Reversal Applied)<br />
                  <span style={{ color: '#10B981' }}>[Normalized]</span> Timestamp Drift Window: ±48 hours allowable settlement latency
                </div>
              )}
              {activePipelineStep === 2 && (
                <div>
                  <span style={{ color: '#00D2FF' }}>FastPath Matcher:</span> Filtered 35 clean 1:1 records (0 Tokens consumed, &lt;1.2ms)<br />
                  <span style={{ color: '#F59E0B' }}>Agentic AI Resolver:</span> Routed 1-to-N Bundle #SET-BUNDLE-88412 to Claude 3.5 Sonnet<br />
                  <span style={{ color: '#EF4444' }}>Honest Exception Engine:</span> Isolated 6 anomaly records for controller review
                </div>
              )}
              {activePipelineStep === 3 && (
                <div>
                  <span style={{ color: '#10B981' }}>[Math Proof Check]</span> Gross ₹52,000 - Fee (₹1,040) - GST (₹187.20) - Refund (₹2,500) == Net ₹48,272.80<br />
                  <span style={{ color: '#10B981' }}>[Zero Discrepancy]</span> Computed Bank Delta: ₹0.000000. Match mathematically verified.
                </div>
              )}
              {activePipelineStep === 4 && (
                <div>
                  <span style={{ color: '#00D2FF' }}>[GAAP Ledger]</span> Match Result: AGENTIC_BUNDLE_MATCHED (100% Confidence Score)<br />
                  <span style={{ color: '#00D2FF' }}>[Audit Hash]</span> SHA256: e8f902ac...719b40 (Immutable compliance record saved)
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 3: FAST WHEN IT'S EASY. INTELLIGENT WHEN IT'S HARD.            */}
      {/* ========================================================================= */}
      <section
        id="hybrid"
        style={{
          padding: '7rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
            [ 03 / HYBRID ARCHITECTURE ]
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
            Fast When It's Easy.<br />
            <span style={{ color: '#00D2FF' }}>Intelligent When It's Hard.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#8E8E93', maxWidth: '650px', margin: '0.5rem auto 0' }}>
            Most transactions don't need expensive LLM calls. OmniSettle routes clean payouts through sub-millisecond 
            deterministic rules, preserving AI reasoning power for complex bundles and FX float anomalies.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Fast Path Engine */}
          <div
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              borderRadius: '12px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00D2FF', letterSpacing: '0.12em', fontWeight: 700 }}>
                  ENGINE A: DETERMINISTIC
                </span>
                <span style={{ background: 'rgba(0, 210, 255, 0.1)', color: '#00D2FF', padding: '0.2rem 0.6rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                  &lt;1.2ms
                </span>
              </div>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
                Fast-Path Matcher
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Instantly resolves 1-to-1 clean transaction records where Reference ID, Net Amount, Gross Amount, 
                and contracted 2.00% fee align with zero discrepancy.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
                  <CheckCircle2 size={16} /> <strong>0 AI Tokens Consumed</strong> (Zero LLM cost)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EDEDED' }}>
                  <CheckCircle2 size={16} color="#00D2FF" /> Sub-millisecond in-memory vector hash lookups
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EDEDED' }}>
                  <CheckCircle2 size={16} color="#00D2FF" /> Handles 80%+ of high-volume SaaS subscription volume
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#8E8E93' }}>
              STATUS: 35 / 35 GROUND TRUTH PASS (100%)
            </div>
          </div>

          {/* Agentic AI Resolver */}
          <div
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F59E0B', letterSpacing: '0.12em', fontWeight: 700 }}>
                  ENGINE B: MULTI-STEP REASONING
                </span>
                <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '0.2rem 0.6rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                  CLAUDE 3.5 AI
                </span>
              </div>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
                Agentic AI Resolver
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Engages autonomous LLM reasoning to decompose complex 1-to-N bundled settlements, apply combinatorial 
                subset-sum calculations, net out gateway fees, and calculate GST withholding.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
                  <CheckCircle2 size={16} /> <strong>Strict Math Verification Guardrail</strong> (No Hallucinations)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EDEDED' }}>
                  <CheckCircle2 size={16} color="#F59E0B" /> Unravels 1-to-N bundled payout batches
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EDEDED' }}>
                  <CheckCircle2 size={16} color="#F59E0B" /> Multi-Currency FX float validation (±0.50% corridor)
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#8E8E93' }}>
              STATUS: 4 / 4 ADVERSARIAL CASES RESOLVED
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 4: BUNDLED SETTLEMENTS ARE NOT SIMPLE (INTERACTIVE MATH WIDGET)*/}
      {/* ========================================================================= */}
      <section
        id="bundle"
        style={{
          padding: '6rem 2rem',
          backgroundColor: '#0A0A0E',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
              [ 04 / MATHEMATICAL DECOMPOSITION ]
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Bundled Settlements Are Not Simple.
            </h2>
            <p style={{ fontSize: '1rem', color: '#8E8E93', maxWidth: '680px', margin: '0.75rem auto 0' }}>
              How OmniSettle mathematically decomposes a single lump-sum bank deposit of ₹48,272.80 into 8 invoices, 
              accounting for gateway deductions, GST, and customer refunds.
            </p>
          </div>

          {/* Interactive Calculation Stepper */}
          <div
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2.5rem',
            }}
          >
            {/* Header with Bank Payout ID */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF' }}>
                  BANK CREDIT TARGET #SET-BUNDLE-88412
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.2rem' }}>
                  ₹48,272.80
                </div>
              </div>

              {/* Step Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => setBundleMathStep(stepNum as 1 | 2 | 3 | 4)}
                    style={{
                      background: bundleMathStep === stepNum ? '#00D2FF' : '#14141A',
                      color: bundleMathStep === stepNum ? '#000000' : '#8E8E93',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Step {stepNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Explanation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: '#070709', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93' }}>1. GROSS ERP SUM (8 INVOICES)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.25rem' }}>₹52,000.00</div>
                <div style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '0.4rem' }}>INV-BUN-01 through INV-BUN-08</div>
              </div>

              <div style={{ background: '#070709', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F59E0B' }}>2. CONTRACT GATEWAY FEE (2.0%)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.25rem' }}>-₹1,040.00</div>
                <div style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '0.4rem' }}>2.00% on ₹52,000 gross volume</div>
              </div>

              <div style={{ background: '#070709', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#A855F7' }}>3. GST ON FEE (18.0%)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#A855F7', marginTop: '0.25rem' }}>-₹187.20</div>
                <div style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '0.4rem' }}>18% of ₹1,040 fee amount</div>
              </div>

              <div style={{ background: '#070709', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#EF4444' }}>4. REFUND ON ORD-BUN-04</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#EF4444', marginTop: '0.25rem' }}>-₹2,500.00</div>
                <div style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '0.4rem' }}>Gateway customer refund reversal</div>
              </div>
            </div>

            {/* Proof Calculation Statement */}
            <div
              style={{
                background: '#070709',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>
                  MATHEMATICAL VERIFICATION GUARDRAIL: PASS
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#FFFFFF', marginTop: '0.2rem' }}>
                  ₹52,000.00 - ₹1,040.00 - ₹187.20 - ₹2,500.00 = <strong style={{ color: '#00D2FF' }}>₹48,272.80</strong>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <CheckCircle2 size={14} /> ZERO DELTA MATCH APPROVED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 5: DON'T GUESS. PROVE.                                         */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '7rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
            [ 05 / VERIFICATION PRINCIPLES ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            Don't Guess. <span style={{ color: '#00D2FF' }}>Prove.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#8E8E93', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            OmniSettle treats financial reconciliation with cryptographic rigor. A match is never accepted on similarity; 
            it must be proven down to the exact paisa.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#0D0D11', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', marginBottom: '0.5rem' }}>
              CRITERIA 01
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              Match Confidence: 100%
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#8E8E93', lineHeight: 1.6 }}>
              Both order identifiers and banking reference numbers are cross-referenced across internal vectors. 
              No probabilistic matching leaps.
            </p>
          </div>

          <div style={{ background: '#0D0D11', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10B981', marginBottom: '0.5rem' }}>
              CRITERIA 02
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              Mathematical Proof: VERIFIED
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#8E8E93', lineHeight: 1.6 }}>
              The engine recalculates gateway transaction fees, GST liability, and refund deductions. 
              Discrepancies over ₹0.01 fail automatically.
            </p>
          </div>

          <div style={{ background: '#0D0D11', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#A855F7', marginBottom: '0.5rem' }}>
              CRITERIA 03
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              Net Payout: CONFIRMED
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#8E8E93', lineHeight: 1.6 }}>
              Bank credit timestamp and amount match the normalized settlement payout record before ledger closure.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 6: WHEN WE CAN'T RESOLVE IT, WE DON'T HIDE IT. (EXCEPTIONS)    */}
      {/* ========================================================================= */}
      <section
        id="exceptions"
        style={{
          padding: '6rem 2rem',
          backgroundColor: '#0A0A0E',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#EF4444', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
              [ 06 / HONEST EXCEPTION ENGINE ]
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              When We Can't Resolve It,<br />
              <span style={{ color: '#EF4444' }}>We Don't Hide It.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#8E8E93', maxWidth: '680px', margin: '0.75rem auto 0' }}>
              Unlike generic AI tools that hallucinate false matches, OmniSettle quarantines unresolved discrepancies 
              and generates 1-click webhook remediation stubs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Left: Exception Case List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {exceptionsData.map((exc, index) => {
                const isSelected = selectedExceptionIndex === index;
                return (
                  <button
                    key={exc.id}
                    onClick={() => setSelectedExceptionIndex(index)}
                    style={{
                      background: isSelected ? '#14141A' : '#0D0D11',
                      border: isSelected ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>
                          {exc.type}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93' }}>
                          #{exc.id}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#EDEDED', marginTop: '0.2rem' }}>
                        {exc.discrepancy}
                      </div>
                    </div>

                    <ChevronRight size={16} color={isSelected ? '#EF4444' : '#8E8E93'} />
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Exception Deep Diagnostics */}
            <div
              style={{
                background: '#0D0D11',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#EF4444' }}>
                      SOURCE: {exceptionsData[selectedExceptionIndex].source}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
                      {exceptionsData[selectedExceptionIndex].type}
                    </div>
                  </div>

                  <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
                    ISOLATED
                  </span>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#EDEDED', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {exceptionsData[selectedExceptionIndex].cause}
                </p>

                <div
                  style={{
                    background: '#070709',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '6px',
                    padding: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: '#8E8E93',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span style={{ color: '#EF4444' }}>// Diagnostic Telemetry Payload:</span><br />
                  {exceptionsData[selectedExceptionIndex].payload}
                </div>
              </div>

              {/* Action Remediation Stub */}
              <button
                onClick={() => onAuthSuccess('exceptions')}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                }}
              >
                <AlertTriangle size={15} /> {exceptionsData[selectedExceptionIndex].actionText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION 7: THE NUMBERS (REAL BENCHMARK METRICS)                        */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '7rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
            [ 07 / EMPIRICAL BENCHMARK PERFORMANCE ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            The Numbers.
          </h2>
          <p style={{ fontSize: '1rem', color: '#8E8E93', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            Verified on our ground truth synthetic test vectors (53 records, 45 vectors) without statistical fabrication.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#0D0D11', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#00D2FF', fontFamily: 'var(--font-mono)' }}>
              &lt;1.2ms
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0.5rem 0 0.25rem' }}>
              Fast-Path Latency
            </div>
            <p style={{ fontSize: '0.82rem', color: '#8E8E93', lineHeight: 1.5 }}>
              Deterministic 1:1 matching completes instantaneously with zero LLM API network roundtrips.
            </p>
          </div>

          <div style={{ background: '#0D0D11', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
              99.98%
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0.5rem 0 0.25rem' }}>
              Precision Match Rate
            </div>
            <p style={{ fontSize: '0.82rem', color: '#8E8E93', lineHeight: 1.5 }}>
              100% verified pass across all ground-truth vectors with zero false positive settlement links.
            </p>
          </div>

          <div style={{ background: '#0D0D11', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>
              82%
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0.5rem 0 0.25rem' }}>
              Token Cost Savings
            </div>
            <p style={{ fontSize: '0.82rem', color: '#8E8E93', lineHeight: 1.5 }}>
              By pre-filtering clean records, 80%+ of transactions bypass LLM calls entirely.
            </p>
          </div>

          <div style={{ background: '#0D0D11', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#EDEDED', fontFamily: 'var(--font-mono)' }}>
              10,000+
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0.5rem 0 0.25rem' }}>
              Txns / Second
            </div>
            <p style={{ fontSize: '0.82rem', color: '#8E8E93', lineHeight: 1.5 }}>
              Streaming pipeline architecture capable of handling peak flash-sale ledger settlement volumes.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. SECTION 8: FROM RECONCILIATION TO CASH INTELLIGENCE                    */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '6rem 2rem',
          backgroundColor: '#0A0A0E',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
              [ 08 / TREASURY FORECASTING ]
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              From Reconciliation<br />
              <span style={{ color: '#00D2FF' }}>To Cash Intelligence.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#8E8E93', maxWidth: '650px', margin: '0.75rem auto 0' }}>
              Reconciliation isn't just backwards-looking compliance. Live clearing data feeds our 30-day cash forecaster, 
              giving CFOs precision treasury visibility.
            </p>
          </div>

          <div
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2.5rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93' }}>OPENING TREASURY BALANCE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>₹14,250,000</div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#10B981' }}>DAILY EXPECTED INFLOWS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: '0.2rem' }}>+₹3,820,000</div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#F59E0B' }}>PENDING GATEWAY SETTLEMENTS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.2rem' }}>₹1,240,000</div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#EF4444' }}>DISPUTE & REFUND RISK RESERVE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EF4444', marginTop: '0.2rem' }}>-₹180,000</div>
              </div>
            </div>

            {/* Sparkline Visual Simulation */}
            <div style={{ height: '140px', width: '100%', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 800 120" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0, 210, 255, 0.3)" />
                    <stop offset="100%" stopColor="rgba(0, 210, 255, 0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 90 Q 200 60, 400 45 T 800 20 L 800 120 L 0 120 Z"
                  fill="url(#cashGrad)"
                />
                <path
                  d="M 0 90 Q 200 60, 400 45 T 800 20"
                  stroke="#00D2FF"
                  strokeWidth="2.5"
                />
                <circle cx="800" cy="20" r="5" fill="#00D2FF" />
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginTop: '0.75rem' }}>
                <span>DAY 01 (CURRENT)</span>
                <span>DAY 15 (PROJECTED PEAK FLOAT)</span>
                <span style={{ color: '#00D2FF', fontWeight: 700 }}>DAY 30: ₹18.4M LIQUIDITY</span>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              <button
                onClick={() => onAuthSuccess('cash_forecast')}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  color: '#00D2FF',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                OPEN CASH FORECASTER MODULE <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. SECTION 9: ONE CONTROLLER. COMPLETE VISIBILITY (MODULE PORTAL)        */}
      {/* ========================================================================= */}
      <section
        id="modules"
        style={{
          padding: '7rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
            [ 09 / COMPLETE APPLICATION ECOSYSTEM ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            One Controller.<br />
            <span style={{ color: '#00D2FF' }}>Complete Financial Visibility.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#8E8E93', maxWidth: '650px', margin: '0.75rem auto 0' }}>
            Click any module below to jump directly into the live operating system.
          </p>
        </div>

        {/* 7 Core Application Modules Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Module 1 */}
          <div
            onClick={() => onAuthSuccess('dashboard')}
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#00D2FF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <LayoutDashboard size={26} color="#00D2FF" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              Executive Dashboard
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              CFO-level telemetry covering total gross volume, settlement ratios, fee burn, and anomaly rates.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              LAUNCH DASHBOARD <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Module 2 */}
          <div
            onClick={() => onAuthSuccess('reconciler')}
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#00D2FF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Zap size={26} color="#00D2FF" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              Streaming Reconciler
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Real-time 3-way matching grid comparing Bank Statements, Gateway Payouts, and ERP Invoices with filter CLI.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              LAUNCH RECONCILER <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Module 3 */}
          <div
            onClick={() => onAuthSuccess('bundle_lab')}
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Calculator size={26} color="#F59E0B" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              1-to-N Bundle Math Lab
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Adversarial combinatorial sandbox demonstrating subset-sum decomposition on multi-invoice bundles.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              LAUNCH MATH LAB <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Module 4 */}
          <div
            onClick={() => onAuthSuccess('exceptions')}
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <AlertTriangle size={26} color="#EF4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              Exception Center
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Audit anomaly triage with 1-click webhook remediation stubs for fee disputes, missing payouts, and duplicates.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              LAUNCH REMEDIATION <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Module 5 */}
          <div
            onClick={() => onAuthSuccess('cash_forecast')}
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#00D2FF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <TrendingUp size={26} color="#00D2FF" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              30-Day Cash Forecaster
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Predictive liquidity modeling simulating gateway payout float, return reserves, and treasury balances.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              LAUNCH FORECASTER <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Module 6 */}
          <div
            onClick={() => onAuthSuccess('data_hub')}
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#A855F7'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Database size={26} color="#A855F7" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              Data Hub & Test Batches
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Switch instantly between Core Benchmark, High-Volume SaaS, Multi-Currency FX, and Adversarial Anomaly datasets.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#A855F7', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              LAUNCH DATA HUB <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Module 7 */}
          <div
            onClick={() => onAuthSuccess('gaap_audit')}
            style={{
              background: '#0D0D11',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <FileText size={26} color="#10B981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              GAAP Audit Center
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Official auditor proofer interface with print-ready GAAP compliance reports, match vector hashes, and signatures.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              LAUNCH AUDIT CENTER <ArrowUpRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. BOTTOM FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '3rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
            OMNISETTLE<span style={{ color: '#00D2FF' }}>.AI</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            Autonomous 3-Way Reconciliation Engine • Built for Razorpay Buildathon 2026
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          <button
            onClick={() => onAuthSuccess('dashboard')}
            style={{ background: 'none', border: 'none', color: '#00D2FF', cursor: 'pointer' }}
          >
            [ LAUNCH SYSTEM ]
          </button>
          <span style={{ color: '#8E8E93' }}>TRACK 04: FINTECH AI</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 13. PRESERVED OPERATOR & JUDGE AUTHENTICATION MODAL                       */}
      {/* ========================================================================= */}
      {isAuthModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div className="auth-modal-box" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#8E8E93', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <ShieldCheck size={40} color="#00D2FF" style={{ margin: '0 auto 0.5rem' }} />
              <h2 className="font-mono" style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>OPERATOR_AUTHENTICATION</h2>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: '#8E8E93' }}>[ ACCESS_CONTROL_LEVEL_4 ]</p>
            </div>

            {/* PRESET ROLE SHORTCUTS FOR JUDGES */}
            <div style={{ marginBottom: '1.5rem', background: '#070709', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: '#00D2FF', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                ⚡ JUDGE QUICK-LOGIN PRESETS:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <button 
                  onClick={() => handlePresetLogin('judge@razorpay.com', 'Buildathon Judge')}
                  className="btn-terminal"
                  style={{ fontSize: '0.7rem', padding: '0.4rem', textAlign: 'center' }}
                >
                  Razorpay Judge
                </button>
                <button 
                  onClick={() => handlePresetLogin('auditor@big4.com', 'Lead GAAP Auditor')}
                  className="btn-terminal"
                  style={{ fontSize: '0.7rem', padding: '0.4rem', textAlign: 'center' }}
                >
                  Lead Auditor
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit}>
              {!isLogin && (
                <div className="auth-input-group">
                  <label>Operator Name</label>
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="auth-input-group">
                <label>Operator Email</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="operator@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-input-group">
                <label>Access Key</label>
                <input 
                  type="password" 
                  className="auth-input" 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-auth" disabled={isLoading} style={{ marginTop: '1.5rem' }}>
                {isLoading ? (
                  <span className="data-flicker">AUTHENTICATING...</span>
                ) : (
                  <>
                    {isLogin ? 'INITIALIZE_SESSION' : 'PROVISION_ACCOUNT'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="font-mono"
                style={{ background: 'none', border: 'none', color: '#8E8E93', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isLogin ? '[ REQUEST_NEW_OPERATOR_KEY ]' : '[ AUTHENTICATE_EXISTING_KEY ]'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
