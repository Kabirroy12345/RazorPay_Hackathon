import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import type { MatchResult } from '../types/finance';

interface AdversarialSpotlightProps {
  bundleMatch?: MatchResult;
}

export const AdversarialSpotlight: React.FC<AdversarialSpotlightProps> = ({ bundleMatch }) => {
  const [showTrace, setShowTrace] = useState(true);

  if (!bundleMatch) return null;

  return (
    <div
      className="terminal-panel"
      style={{
        padding: '1.5rem',
        border: '1px solid var(--border-hairline)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', color: 'var(--text-primary)' }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                DEMO_SPOTLIGHT: 1-to-N Bundled Payout Resolution
              </span>
              <span className="badge badge-amber">AGENTIC_PROOFER</span>
            </div>
            <p className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.3rem' }}>
              1 Bank Payout Credit (₹48,272.80) ↔ 8 ERP Invoices (Gross ₹52,000) − 2% Gateway Fee − 18% GST − 1 Customer Refund
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTrace(!showTrace)}
          className="btn-terminal"
        >
          <Sparkles size={14} />
          {showTrace ? 'HIDE_REASONING_PATH' : 'INSPECT_REASONING_PATH'}
          {showTrace ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Visual Mathematical Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.75rem',
          marginTop: '1.25rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ background: 'var(--bg-root)', padding: '0.85rem', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            BANK_CREDIT_PAYOUT
          </span>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            ₹{bundleMatch.reconciledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            REF:{bundleMatch.bankRecordId || 'BANK-PAYOUT'}
          </span>
        </div>

        <div style={{ background: 'var(--bg-root)', padding: '0.85rem', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {bundleMatch.erpInvoiceIds.length}_ERP_INVOICES_GROSS
          </span>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            ₹52,000.00
          </div>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {bundleMatch.erpInvoiceIds.length > 1 
              ? `${bundleMatch.erpInvoiceIds[0]}..${bundleMatch.erpInvoiceIds[bundleMatch.erpInvoiceIds.length - 1]}`
              : (bundleMatch.erpInvoiceIds[0] || 'INV-SETTLE')}
          </span>
        </div>

        <div style={{ background: 'var(--bg-root)', padding: '0.85rem', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            GATEWAY_FEE_+_GST
          </span>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
            - ₹1,227.20
          </div>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {bundleMatch.feeRateBps ? `${bundleMatch.feeRateBps / 100}% MDR + 18% GST` : '₹1,040 + ₹187.20 GST'}
          </span>
        </div>

        <div style={{ background: 'var(--bg-root)', padding: '0.85rem', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            CUSTOMER_REFUND
          </span>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
            - ₹2,500.00
          </div>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ORD-BUN-04</span>
        </div>

        <div style={{ background: 'var(--bg-root)', padding: '0.85rem', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
            NET_DELTA_MATH
          </span>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            ₹{bundleMatch.discrepancyAmount.toFixed(2)} EXACT_MATCH
          </div>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            CONFIDENCE_{(bundleMatch.confidenceScore * 100).toFixed(0)}%_AI
          </span>
        </div>
      </div>

      {/* AI Reasoning Step-by-Step Log */}
      {showTrace && (
        <div
          style={{
            background: 'var(--bg-root)',
            padding: '1rem',
            border: '1px solid var(--border-hairline)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <Sparkles size={15} color="var(--text-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
              LIVE_AGENTIC_REASONING_TRACE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {bundleMatch.reasoningTrace.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>[{idx + 1}]</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
