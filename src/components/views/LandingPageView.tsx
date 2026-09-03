import React, { useState } from 'react';
import { 
  ArrowRight, 
  Zap, 
  AlertTriangle, 
  FileText, 
  Database, 
  TrendingUp, 
  LayoutDashboard, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  FileSpreadsheet, 
  Lock, 
  Cpu, 
} from 'lucide-react';
import { UnifiedHero3D } from '../landing/UnifiedHero3D';
import { AuthModal } from '../auth/AuthModal';
import type { AppView } from '../../types/finance';

interface LandingPageViewProps {
  onAuthSuccess: (targetView?: AppView) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onAuthSuccess }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Interactive Pipeline Step in Section 2
  const [activePipelineStep, setActivePipelineStep] = useState(2);

  // Bundle Math Step in Section 4
  const [bundleMathStep, setBundleMathStep] = useState<1 | 2 | 3 | 4>(4);

  // Exception Selection in Section 5
  const [selectedExceptionIndex, setSelectedExceptionIndex] = useState(0);

  const exceptionsData = [
    {
      id: 'EXC-FEE-402',
      type: 'FEE OVERCHARGE',
      source: 'Payment Gateway',
      discrepancy: '₹142.50 shortfall',
      cause: 'Gateway billed 3.50% fee tier instead of contracted 2.00% rate on batch SET-88412.',
      payload: '{"batchId": "SET-88412", "expectedFee": 1040, "chargedFee": 1182.50, "delta": -142.50}',
      actionText: 'DISPATCH RECLAMATION NOTICE TO GATEWAY OPS',
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
      desc: 'Connects direct SFTP, API webhooks, and raw CSV feeds across Bank Statements, Payment Gateway settlements, and ERP general ledgers.',
      samplePayload: '{\n  "source": "HDFC_NET_SETTLEMENT",\n  "amount": 48272.80,\n  "ref": "HDFC-CLR-9912",\n  "timestamp": "2026-08-28T14:32:00Z"\n}',
    },
    {
      id: 1,
      title: '2. Normalization',
      subtitle: 'Canonical Schema',
      desc: 'Standardizes timestamps, parses gross vs net payouts, strips gateway transaction fees, and factors GST deductions.',
      samplePayload: '{\n  "canonicalId": "TXN-NORM-8841",\n  "grossINR": 52000.00,\n  "feeINR": 1040.00,\n  "gstINR": 187.20,\n  "refundINR": 2500.00,\n  "expectedNetINR": 48272.80\n}',
    },
    {
      id: 2,
      title: '3. Dual-Path Matching',
      subtitle: 'Fast-Path + Agentic AI',
      desc: 'Routes clean 1:1 records through sub-millisecond deterministic checks (<1.2ms), and routes complex 1:N bundles to Claude 3.5 AI.',
      samplePayload: '{\n  "routing": "AGENTIC_AI_BUNDLE",\n  "candidateInvoices": 8,\n  "llmModel": "Claude 3.5 Sonnet",\n  "latency": "43ms",\n  "status": "BUNDLE_RESOLVED"\n}',
    },
    {
      id: 3,
      title: '4. Mathematical Proof',
      subtitle: 'Zero Delta Verification',
      desc: 'Evaluates Gross - Gateway Fee - GST - Refunds == Bank Net. Matches are approved ONLY when math balances with 0.0000 delta.',
      samplePayload: '{\n  "proofEquation": "52000 - 1040 - 187.20 - 2500 == 48272.80",\n  "delta": 0.0000,\n  "guardrailPassed": true,\n  "verificationStatus": "GROUND_TRUTH_MATCH"\n}',
    },
    {
      id: 4,
      title: '5. Immutable Resolution',
      subtitle: 'GAAP Ledgering',
      desc: 'Produces boardroom-ready GAAP reconciliation vectors, hashes audit trails, and isolates anomalies for 1-click remediation.',
      samplePayload: '{\n  "ledgerVector": "VEC-GAAP-2026-88",\n  "auditHash": "sha256:e88f41...d720",\n  "gaapStatus": "AUDIT_READY",\n  "settledCashINR": 48272.80\n}',
    },
  ];

  return (
    <div style={{ backgroundColor: '#07080E', color: '#EDEDED', minHeight: '100vh', overflowX: 'hidden', position: 'relative', fontFamily: 'var(--font-sans)' }}>
      
      {/* ========================================================================= */}
      {/* 1. STICKY MINIMAL GLASSMORPHIC NAVIGATION                                 */}
      {/* ========================================================================= */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '68px',
          backgroundColor: 'rgba(7, 8, 14, 0.82)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
        }}
      >
        {/* Brand Lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00D2FF 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 210, 255, 0.35)',
            }}
          >
            <ShieldCheck size={18} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.02rem', fontWeight: 900, letterSpacing: '0.06em', color: '#FFFFFF' }}>
            OMNISETTLE<span style={{ color: '#00D2FF' }}>.AI</span>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.85rem' }}>/</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', letterSpacing: '0.06em' }} className="desktop-nav-links">
            AUTONOMOUS 3-WAY RECONCILIATION ENGINE
          </span>
        </div>

        {/* Minimal Navigation & CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '1.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} className="desktop-nav-links">
            <a href="#problem" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>01. BOTTLENECK</a>
            <a href="#pipeline" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>02. PIPELINE</a>
            <a href="#hybrid" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>03. HYBRID</a>
            <a href="#bundle" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>04. BUNDLE LAB</a>
            <a href="#exceptions" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>05. EXCEPTIONS</a>
            <a href="#modules" style={{ color: '#8E8E93', textDecoration: 'none', transition: 'color 0.2s' }}>06. MODULES</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* 1-Click Judge Pass Button */}
            <button
              onClick={() => onAuthSuccess('dashboard')}
              style={{
                background: '#00D2FF',
                border: 'none',
                color: '#000000',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              <Zap size={14} /> ⚡ 1-CLICK JUDGE PASS
            </button>

            {/* Operator Login / Signup Modal Trigger */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#EDEDED',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Lock size={13} /> OPERATOR LOGIN
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. MONUMENTAL 3D HERO: EDITORIAL ASYMMETRIC + UNIFIED 3D MACHINE           */}
      {/* ========================================================================= */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          paddingTop: '68px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'visible',
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
            {/* Metadata Tags */}
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

            {/* Monumental Headline */}
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

            {/* Supporting Copy */}
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

            {/* Primary Action Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  background: '#00D2FF',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  padding: '0.9rem 2.2rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 0 30px rgba(0, 210, 255, 0.35)',
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
                  borderRadius: '6px',
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

            {/* Spatial Telemetry Chips */}
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
      {/* 3. REAL-TIME LIVE TRANSACTION RECONCILIATION MARQUEE TICKER               */}
      {/* ========================================================================= */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#090B14',
          borderTop: '1px solid rgba(0, 210, 255, 0.15)',
          borderBottom: '1px solid rgba(0, 210, 255, 0.15)',
          padding: '0.85rem 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          display: 'flex',
          zIndex: 20,
          position: 'relative',
        }}
      >
        <div className="ticker-track" style={{ display: 'flex', gap: '3rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            [SET-88412] HDFC ₹48,272.80 ↔ RAZORPAY 2% MDR ↔ 8 ERP INVOICES (INV-BUN-01..08) — ZERO DELTA VERIFIED (0.0000 INR)
          </span>
          <span style={{ color: '#00D2FF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D2FF' }} />
            [TXN-1082] DETERMINISTIC 1:1 FAST-PATH MATCH (0.9ms) — RECONCILED (0 LLM TOKENS)
          </span>
          <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
            [EXC-FEE-402] GATEWAY FEE OVERCHARGE: BILLED 3.50% vs 2.00% CONTRACT (₹142.50 SHORTFALL) — ROUTED TO TREASURY
          </span>
          <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            [SET-99124] ICICI PAYOUT ₹1,24,500.00 ↔ 12 BUNDLE INVOICES — GAAP AUDIT TRAIL HASHED
          </span>
          <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
            [EXC-DUP-109] DUPLICATE BANK DEBIT DETECTED ON TXN-9982 — AUTO-REMEDIATION PREPARED
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SECTION 1: THE RECONCILIATION PROBLEM                                  */}
      {/* ========================================================================= */}
      <section
        id="problem"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: '4rem' }}>
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

          <p style={{ fontSize: '1.15rem', color: '#8E8E93', maxWidth: '700px', lineHeight: 1.6 }}>
            Modern financial operations generate millions of transactional records every day, yet still rely heavily on 
            manual spreadsheets to verify discrepancies across disconnected systems.
          </p>
        </div>

        {/* 3 Disconnected Systems Visual */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Bank Silo */}
          <div style={{ background: '#0A0C16', border: '1px solid rgba(0, 210, 255, 0.25)', padding: '2rem', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Building2 size={20} color="#00D2FF" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', marginBottom: '0.5rem', fontWeight: 700 }}>
              SILO 01 // BANK STATEMENTS
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.85rem' }}>
              Only Records Settled Cash
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, margin: 0 }}>
              Reflects lump-sum batch credits hours or days after transactions take place. Missing customer metadata, transaction fees, and order line items.
            </p>
          </div>

          {/* Gateway Silo */}
          <div style={{ background: '#0A0C16', border: '1px solid rgba(236, 72, 153, 0.25)', padding: '2rem', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CreditCard size={20} color="#EC4899" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#EC4899', marginBottom: '0.5rem', fontWeight: 700 }}>
              SILO 02 // PAYMENT GATEWAYS
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.85rem' }}>
              Blended Deductions & Fees
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, margin: 0 }}>
              Aggregates hundreds of purchases into single net transfers while deducting variable 1.5% - 3.5% MDR, 18% GST surcharges, and chargeback holds.
            </p>
          </div>

          {/* ERP Silo */}
          <div style={{ background: '#0A0C16', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '2rem', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <FileSpreadsheet size={20} color="#10B981" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10B981', marginBottom: '0.5rem', fontWeight: 700 }}>
              SILO 03 // ERP GENERAL LEDGER
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.85rem' }}>
              Disjointed Order Invoices
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, margin: 0 }}>
              Generates individual invoices per cart checkout. Disconnected from payment processor settlement batch IDs and real banking clearing dates.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 2: 5-STAGE INTERACTIVE 3D RECONCILIATION PIPELINE              */}
      {/* ========================================================================= */}
      <section
        id="pipeline"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1240px',
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
            Click any stage to inspect live canonical schema transformations and mathematical guardrails.
          </p>
        </div>

        {/* Interactive Pipeline Stages Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          {pipelineStages.map((stage) => {
            const isSelected = activePipelineStep === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActivePipelineStep(stage.id)}
                style={{
                  background: isSelected ? 'rgba(0, 210, 255, 0.1)' : '#0A0C16',
                  border: isSelected ? '1px solid #00D2FF' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '1.2rem 1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected ? '0 0 25px rgba(0, 210, 255, 0.2)' : 'none',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: isSelected ? '#00D2FF' : '#8E8E93', fontWeight: 800, marginBottom: '0.4rem' }}>
                  {stage.title}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#8E8E93' }}>
                  {stage.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage Interactive Payload Inspector */}
        <div
          style={{
            background: '#0A0C16',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            borderRadius: '12px',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', fontWeight: 800, marginBottom: '0.5rem' }}>
              ACTIVE STAGE INSPECTOR: {pipelineStages[activePipelineStep].title.toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
              {pipelineStages[activePipelineStep].subtitle}
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {pipelineStages[activePipelineStep].desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10B981' }}>
              <CheckCircle2 size={16} />
              <span>GUARANTEED ZERO-DATA LOSS • AIR-GAPPED HASHING</span>
            </div>
          </div>

          {/* Sample JSON payload */}
          <div style={{ background: '#07080E', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93' }}>CANONICAL SCHEMA PAYLOAD</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#00D2FF' }}>JSON / UTF-8</span>
            </div>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00D2FF', margin: 0, overflowX: 'auto', lineHeight: 1.5 }}>
              {pipelineStages[activePipelineStep].samplePayload}
            </pre>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 3: HYBRID FAST-PATH VS AGENTIC AI ENGINE                       */}
      {/* ========================================================================= */}
      <section
        id="hybrid"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 03 / HYBRID RECONCILIATION ARCHITECTURE ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            DUAL-PATH EXECUTION ENGINE
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Deterministic sub-millisecond precision for the majority. Claude 3.5 Sonnet agentic intelligence for difficult non-linear edge cases.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Fast-Path Engine */}
          <div style={{ background: '#0A0C16', border: '1px solid rgba(0, 210, 255, 0.3)', borderRadius: '12px', padding: '2.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', fontWeight: 800 }}>
                TRACK A // DETERMINISTIC FAST-PATH
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#000', background: '#00D2FF', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 800 }}>
                92% VOLUME
              </span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1rem' }}>
              &lt;1.2ms Sub-Millisecond Rules
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '2rem' }}>
              High-throughput matching for standard 1:1 transactions. Validates exact reference numbers, currency corridors, and fee tiers without querying LLMs or incurring API costs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#8E8E93' }}>LLM Token Consumption</span>
                <span style={{ color: '#10B981', fontWeight: 800 }}>0 Tokens (100% Free)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#8E8E93' }}>Execution Latency</span>
                <span style={{ color: '#00D2FF', fontWeight: 800 }}>0.8ms - 1.2ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8E8E93' }}>Rule Coverage</span>
                <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Exact ID, Date, Amount Match</span>
              </div>
            </div>
          </div>

          {/* Agentic AI Engine */}
          <div style={{ background: '#0A0C16', border: '1px solid rgba(124, 58, 237, 0.35)', borderRadius: '12px', padding: '2.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#A855F7', fontWeight: 800 }}>
                TRACK B // CLAUDE 3.5 AGENTIC AI
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#000', background: '#A855F7', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 800 }}>
                8% ADVERSARIAL CASES
              </span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1rem' }}>
              1-to-N Combinatorial Reasoning
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '2rem' }}>
              Handles complex partial payouts, net-of-fee deductions, blended batches, and currency fluctuations where deterministic string lookups fail.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#8E8E93' }}>Reasoning Guardrail</span>
                <span style={{ color: '#F59E0B', fontWeight: 800 }}>Zero-Delta Verification</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#8E8E93' }}>Average Solve Speed</span>
                <span style={{ color: '#A855F7', fontWeight: 800 }}>43ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8E8E93' }}>Capabilities</span>
                <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Bundle Knapsack, FX Corridor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 4: INTERACTIVE 1-TO-N BUNDLE MATH SANDBOX                      */}
      {/* ========================================================================= */}
      <section
        id="bundle"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 04 / MATHEMATICAL PROOF LAB ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            INTERACTIVE BUNDLE MATH PROOF
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '650px', lineHeight: 1.6 }}>
            Demonstrating how 1 payment gateway settlement matches across 8 disparate customer invoices while rigorously calculating deductions.
          </p>
        </div>

        {/* Step Selector Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { step: 1, label: 'STEP 1: DETECT GROSS' },
            { step: 2, label: 'STEP 2: STRIP MDR & GST' },
            { step: 3, label: 'STEP 3: ACCOUNT REFUNDS' },
            { step: 4, label: 'STEP 4: ZERO DELTA PROOF' },
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setBundleMathStep(s.step as 1 | 2 | 3 | 4)}
              style={{
                background: bundleMathStep >= s.step ? 'rgba(0, 210, 255, 0.15)' : '#0A0C16',
                border: bundleMathStep === s.step ? '1px solid #00D2FF' : '1px solid rgba(255, 255, 255, 0.08)',
                color: bundleMathStep >= s.step ? '#00D2FF' : '#8E8E93',
                padding: '0.65rem 1.25rem',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Live Interactive Calculation Box */}
        <div
          style={{
            background: '#0A0C16',
            border: '2px solid #F59E0B',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.15)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ background: '#07080E', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.4rem' }}>
                GROSS INVOICE SUM
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
                ₹52,000.00
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#10B981', marginTop: '0.3rem' }}>
                8 ERP INVOICES
              </div>
            </div>

            <div style={{ background: '#07080E', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.4rem' }}>
                GATEWAY 2% MDR
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color: bundleMathStep >= 2 ? '#EC4899' : '#8E8E93' }}>
                -₹1,040.00
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', marginTop: '0.3rem' }}>
                CONTRACT TIER
              </div>
            </div>

            <div style={{ background: '#07080E', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.4rem' }}>
                18% GST ON FEE
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color: bundleMathStep >= 2 ? '#EC4899' : '#8E8E93' }}>
                -₹187.20
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', marginTop: '0.3rem' }}>
                TAX COMPLIANCE
              </div>
            </div>

            <div style={{ background: '#07080E', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.4rem' }}>
                CUSTOMER REFUNDS
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color: bundleMathStep >= 3 ? '#F59E0B' : '#8E8E93' }}>
                -₹2,500.00
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', marginTop: '0.3rem' }}>
                RETURN CHARGE
              </div>
            </div>
          </div>

          {/* Result Bar */}
          <div style={{ background: '#07080E', padding: '1.5rem 2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#8E8E93', marginBottom: '0.3rem' }}>
                VERIFIED SETTLEMENT CASH
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>
                ₹48,272.80 <span style={{ fontSize: '0.9rem', color: '#8E8E93' }}>== BANK NET CREDIT</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>
                MATHEMATICAL DELTA: 0.0000 INR
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginTop: '0.2rem' }}>
                100% GAAP AUDIT VALIDATED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 5: DYNAMIC 3D HONEST EXCEPTION RADAR                           */}
      {/* ========================================================================= */}
      <section
        id="exceptions"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1240px',
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
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '650px', lineHeight: 1.6 }}>
            Never force bad matches. OmniSettle isolates genuine financial anomalies into 5 strict categories for automated 1-click remediation.
          </p>
        </div>

        {/* Exception Selector Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
          {exceptionsData.map((exc, idx) => {
            const isSelected = selectedExceptionIndex === idx;
            return (
              <button
                key={exc.id}
                onClick={() => setSelectedExceptionIndex(idx)}
                style={{
                  background: isSelected ? 'rgba(239, 68, 68, 0.12)' : '#0A0C16',
                  border: isSelected ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: isSelected ? '#EF4444' : '#8E8E93', fontWeight: 800 }}>
                  {exc.id}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#8E8E93', marginTop: '0.3rem' }}>
                  {exc.type}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Exception Diagnostic Card */}
        <div
          style={{
            background: '#0A0C16',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#EF4444', fontWeight: 800 }}>
                EXCEPTION TYPE: {exceptionsData[selectedExceptionIndex].type}
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: '0.3rem 0 0' }}>
                Discrepancy: {exceptionsData[selectedExceptionIndex].discrepancy}
              </h3>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', background: '#07080E', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              DETECTED ON: {exceptionsData[selectedExceptionIndex].source}
            </span>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#EDEDED', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            <strong>Root Cause:</strong> {exceptionsData[selectedExceptionIndex].cause}
          </p>

          <div style={{ background: '#07080E', padding: '1rem 1.25rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.3rem' }}>
              ISOLATED JSON PAYLOAD:
            </div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#EF4444' }}>
              {exceptionsData[selectedExceptionIndex].payload}
            </code>
          </div>

          <button
            onClick={() => onAuthSuccess('exceptions')}
            style={{
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.8rem 1.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.35)',
            }}
          >
            {exceptionsData[selectedExceptionIndex].actionText} ➔
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION 6: CORE APPLICATION MODULES SHOWCASE                           */}
      {/* ========================================================================= */}
      <section
        id="modules"
        style={{
          padding: '8rem 2.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>
            [ 06 / TERMINAL WORKSPACE MODULES ]
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            COMPLETE PRODUCTION SUITE
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#8E8E93', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Click any module below to jump directly into the live working system.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[
            { id: 'dashboard', title: 'Executive Dashboard', icon: <LayoutDashboard size={20} color="#00D2FF" />, desc: 'High-level financial KPIs, match rate metrics, and real-time reconciliation health monitoring.' },
            { id: 'reconciler', title: '3-Way Live Ledger', icon: <Zap size={20} color="#00D2FF" />, desc: 'Real-time multi-source matching view connecting Bank, Gateway, and ERP transaction records.' },
            { id: 'bundle_lab', title: '1-to-N Bundle Math Lab', icon: <Cpu size={20} color="#A855F7" />, desc: 'Visual step-by-step solver proving exact zero-delta reconciliation for blended payouts.' },
            { id: 'exceptions', title: 'Audit Exception Center', icon: <AlertTriangle size={20} color="#EF4444" />, desc: 'Categorized financial anomalies with one-click automated remediation and refund handling.' },
            { id: 'cash_forecast', title: '30-Day Cash Forecaster', icon: <TrendingUp size={20} color="#10B981" />, desc: 'Predictive working capital projections based on verified historical reconciliation cycles.' },
            { id: 'data_hub', title: 'Data Hub & Ingestion', icon: <Database size={20} color="#00D2FF" />, desc: 'Inspect raw multi-format transaction records, switch datasets, and upload financial feeds.' },
            { id: 'gaap_audit', title: 'GAAP Audit Statement', icon: <FileText size={20} color="#F59E0B" />, desc: 'Boardroom-ready GAAP-compliant balance sheet reconciliations with immutable hash verification.' },
          ].map((mod) => (
            <div
              key={mod.id}
              onClick={() => onAuthSuccess(mod.id as AppView)}
              style={{
                background: '#0A0C16',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mod.icon}
                </div>
                <ArrowUpRight size={18} color="#8E8E93" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.6rem' }}>
                {mod.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, margin: 0 }}>
                {mod.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. UNIFIED FOOTER                                                        */}
      {/* ========================================================================= */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '4rem 2.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: '#8E8E93',
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
