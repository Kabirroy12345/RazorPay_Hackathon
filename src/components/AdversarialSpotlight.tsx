import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Cpu, Crown, CheckCircle2 } from 'lucide-react';
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
        padding: '1.5rem 1.75rem',
        background: 'linear-gradient(135deg, rgba(19, 26, 48, 0.75) 0%, rgba(8, 11, 22, 0.85) 100%)',
        border: '1px solid rgba(245, 208, 97, 0.28)',
        borderLeft: '4px solid #F5D061',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.15) 0%, rgba(245, 208, 97, 0.03) 100%)',
              border: '1px solid rgba(245, 208, 97, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F5D061',
              boxShadow: '0 0 14px rgba(245, 208, 97, 0.25)',
            }}
          >
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                DEMO_SPOTLIGHT: 1-to-N Bundled Payout Resolution
              </span>
              <span
                className="badge"
                style={{
                  background: 'rgba(245, 208, 97, 0.12)',
                  border: '1px solid rgba(245, 208, 97, 0.4)',
                  color: '#F5D061',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                }}
              >
                <Crown size={11} style={{ marginRight: '0.3rem' }} />
                AGENTIC PROOFER
              </span>
            </div>
            <p className="font-mono" style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.3rem' }}>
              1 Bank Payout Credit (₹48,272.80) ↔ 8 ERP Invoices (Gross ₹52,000) − 2% Gateway Fee − 18% GST − 1 Customer Refund
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTrace(!showTrace)}
          className="btn-terminal"
          style={{
            borderColor: 'rgba(245, 208, 97, 0.3)',
            color: '#F5D061',
            background: 'rgba(245, 208, 97, 0.06)',
            fontSize: '0.78rem',
            padding: '0.5rem 0.9rem',
          }}
        >
          <Sparkles size={13} color="#F5D061" />
          {showTrace ? 'HIDE_REASONING_PATH' : 'INSPECT_REASONING_PATH'}
          {showTrace ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Visual Mathematical Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.85rem',
          marginTop: '1.35rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
            padding: '0.95rem',
            border: '1px solid rgba(245, 208, 97, 0.2)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: '#E5B869', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            BANK_CREDIT_PAYOUT
          </span>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.25rem' }}>
            ₹{bundleMatch.reconciledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: '#64748B' }}>
            REF:{bundleMatch.bankRecordId || 'BANK-PAYOUT'}
          </span>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
            padding: '0.95rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            {bundleMatch.erpInvoiceIds.length}_ERP_INVOICES_GROSS
          </span>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginTop: '0.25rem' }}>
            ₹52,000.00
          </div>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: '#64748B' }}>
            {bundleMatch.erpInvoiceIds.length > 1 
              ? `${bundleMatch.erpInvoiceIds[0]}..${bundleMatch.erpInvoiceIds[bundleMatch.erpInvoiceIds.length - 1]}`
              : (bundleMatch.erpInvoiceIds[0] || 'INV-SETTLE')}
          </span>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
            padding: '0.95rem',
            border: '1px solid rgba(245, 208, 97, 0.2)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: '#E5B869', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            GATEWAY_FEE_+_GST
          </span>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F5D061', marginTop: '0.25rem' }}>
            - ₹1,227.20
          </div>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: '#64748B' }}>
            {bundleMatch.feeRateBps ? `${bundleMatch.feeRateBps / 100}% MDR + 18% GST` : '₹1,040 + ₹187.20 GST'}
          </span>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
            padding: '0.95rem',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: '#F43F5E', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            CUSTOMER_REFUND
          </span>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F43F5E', marginTop: '0.25rem' }}>
            - ₹2,500.00
          </div>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: '#64748B' }}>ORD-BUN-04 DEDUCTED</span>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.12) 0%, rgba(12, 16, 30, 0.95) 100%)',
            padding: '0.95rem',
            border: '1px solid rgba(245, 208, 97, 0.4)',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(245, 208, 97, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: '#F5D061', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
              NET_DELTA_MATH
            </span>
            <CheckCircle2 size={13} color="#F5D061" />
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.25rem' }}>
            ₹{bundleMatch.discrepancyAmount.toFixed(2)} <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>EXACT</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: '#E5B869' }}>
            CONFIDENCE_{(bundleMatch.confidenceScore * 100).toFixed(0)}%_AI
          </span>
        </div>
      </div>

      {/* Live AI Reasoning Step-by-Step Log */}
      {showTrace && (
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(8, 11, 20, 0.95) 0%, rgba(4, 6, 12, 0.98) 100%)',
            padding: '1.15rem 1.35rem',
            border: '1px solid rgba(245, 208, 97, 0.2)',
            borderRadius: '6px',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Sparkles size={14} color="#F5D061" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F5D061', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              LIVE_AGENTIC_REASONING_TRACE (AUTONOMOUS FINANCIAL LOGIC)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {bundleMatch.reasoningTrace.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#CBD5E1',
                  lineHeight: '1.5',
                }}
              >
                <span
                  style={{
                    background: 'rgba(245, 208, 97, 0.12)',
                    border: '1px solid rgba(245, 208, 97, 0.3)',
                    color: '#F5D061',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '3px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
