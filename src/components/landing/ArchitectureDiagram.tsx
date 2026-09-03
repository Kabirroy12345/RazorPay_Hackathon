import React from 'react';
import { Building2, CreditCard, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '5rem auto 0',
        padding: '0 2.5rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(12, 17, 32, 0.95) 0%, rgba(7, 9, 18, 0.95) 100%)',
          border: '1px solid rgba(0, 210, 255, 0.25)',
          borderRadius: '16px',
          padding: '2.5rem 3rem',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 210, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header Strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D2FF', boxShadow: '0 0 10px #00D2FF' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00D2FF', fontWeight: 800, letterSpacing: '0.12em' }}>
                TECHNICAL BLUEPRINT // MULTI-CORRIDOR 3-WAY TOPOLOGY
              </span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              End-to-End Autonomous Reconciliation Matrix
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93' }}>
            <span>INGESTION: <strong style={{ color: '#10B981' }}>STREAMING SFTP/API</strong></span>
            <span>ENCRYPTION: <strong style={{ color: '#00D2FF' }}>TLS 1.3 / AES-256</strong></span>
            <span>CONSISTENCY: <strong style={{ color: '#F59E0B' }}>STRICT ACID</strong></span>
          </div>
        </div>

        {/* Blueprint Flow Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', alignItems: 'center', position: 'relative' }}>
          {/* Column 1: Multi-Source Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', fontWeight: 800, marginBottom: '0.2rem' }}>
              PHASE 01: RAW FINANCIAL FEEDS
            </div>

            {/* Bank Card */}
            <div style={{ background: '#07080E', border: '1px solid rgba(0, 210, 255, 0.3)', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building2 size={20} color="#00D2FF" />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF' }}>BANK STATEMENTS</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93' }}>MT940 / CAMT.053 / SFTP</div>
              </div>
            </div>

            {/* Gateway Card */}
            <div style={{ background: '#07080E', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CreditCard size={20} color="#EC4899" />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF' }}>RAZORPAY GATEWAY</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93' }}>Settlement Batches & Webhooks</div>
              </div>
            </div>

            {/* ERP Card */}
            <div style={{ background: '#07080E', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileSpreadsheet size={20} color="#10B981" />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF' }}>ERP GENERAL LEDGER</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93' }}>SAP / NetSuite REST Invoices</div>
              </div>
            </div>
          </div>

          {/* Column 2: Ingestion & Canonical Schema */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', fontWeight: 800, marginBottom: '0.6rem' }}>
              PHASE 02: VECTOR PARSER
            </div>
            <div style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.35)', borderRadius: '10px', padding: '1.4rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: '#A855F7', marginBottom: '0.5rem' }}>
                  CANONICAL NORMALIZATION
                </div>
                <p style={{ fontSize: '0.75rem', color: '#8E8E93', lineHeight: 1.5, margin: 0 }}>
                  Extracts raw metadata, harmonizes timestamps into UTC, separates MDR fees, and computes tax baselines.
                </p>
              </div>

              <div style={{ background: '#07080E', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#10B981' }}>
                ✓ 100% INGESTION COVERAGE
              </div>
            </div>
          </div>

          {/* Column 3: Dual-Track Resolution Core */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', fontWeight: 800, marginBottom: '0.6rem' }}>
              PHASE 03: MATCHING CORE
            </div>
            <div style={{ background: 'rgba(0, 210, 255, 0.08)', border: '1px solid rgba(0, 210, 255, 0.35)', borderRadius: '10px', padding: '1.4rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: '#00D2FF', marginBottom: '0.5rem' }}>
                  DUAL-PATH ARBITER
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93' }}>
                  <div style={{ color: '#00D2FF' }}>⚡ Fast-Path (&lt;1.2ms)</div>
                  <div style={{ color: '#A855F7' }}>🧠 Claude 3.5 Sonnet (43ms)</div>
                  <div style={{ color: '#F59E0B' }}>⚖ Zero-Delta Guardrail</div>
                </div>
              </div>

              <div style={{ background: '#07080E', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#00D2FF' }}>
                PRECISION: 99.98%
              </div>
            </div>
          </div>

          {/* Column 4: GAAP Immutable Hash Output */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', fontWeight: 800, marginBottom: '0.6rem' }}>
              PHASE 04: AUDIT LEDGER
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '10px', padding: '1.4rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: '#10B981', marginBottom: '0.5rem' }}>
                  IMMUTABLE PROOF
                </div>
                <p style={{ fontSize: '0.75rem', color: '#8E8E93', lineHeight: 1.5, margin: 0 }}>
                  Cryptographically signed audit trail with SHA-256 hash chaining for Big 4 auditor validation.
                </p>
              </div>

              <div style={{ background: '#07080E', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={13} /> GAAP AUDIT READY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
