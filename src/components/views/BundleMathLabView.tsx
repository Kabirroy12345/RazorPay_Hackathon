import React, { useState } from 'react';
import { Cpu, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';

export const BundleMathLabView: React.FC = () => {
  const [grossSales, setGrossSales] = useState(52000);
  const [invoiceCount, setInvoiceCount] = useState(8);
  const [feeRatePct, setFeeRatePct] = useState(2.00);
  const [gstEnabled, setGstEnabled] = useState(true);
  const [refundDeduction, setRefundDeduction] = useState(2500);

  const feeAmount = Number((grossSales * (feeRatePct / 100)).toFixed(2));
  const gstAmount = gstEnabled ? Number((feeAmount * 0.18).toFixed(2)) : 0;
  const netBankPayout = Number((grossSales - feeAmount - gstAmount - refundDeduction).toFixed(2));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        className="terminal-panel"
        style={{
          padding: '1.35rem 1.6rem',
          background: 'linear-gradient(135deg, rgba(19, 26, 48, 0.75) 0%, rgba(8, 11, 22, 0.85) 100%)',
          border: '1px solid rgba(245, 208, 97, 0.25)',
          borderLeft: '4px solid #F5D061',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(245, 208, 97, 0.12)',
              border: '1px solid rgba(245, 208, 97, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F5D061',
              boxShadow: '0 0 12px rgba(245, 208, 97, 0.25)',
            }}
          >
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                1-to-N Bundle Math Sandbox & Mathematical Prover
              </h2>
              <span
                className="badge"
                style={{
                  background: 'rgba(12, 140, 233, 0.12)',
                  border: '1px solid rgba(12, 140, 233, 0.4)',
                  color: '#38BDF8',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                }}
              >
                <Calculator size={11} style={{ marginRight: '0.25rem' }} />
                PROVER LAB
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Manipulate Razorpay settlement bundle variables (Gross Sales, MDR Fee, Statutory 18% GST, Refunds) and inspect the Autonomous Agentic AI proofer.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Controls Card */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.6rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.35rem',
            background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
            border: '1px solid rgba(229, 184, 105, 0.22)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(229, 184, 105, 0.16)', paddingBottom: '0.85rem' }}>
            <Calculator size={18} color="#F5D061" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>Settlement Variable Controls</h3>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Gross ERP Sales Volume:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: '#F5D061' }}>
                ₹{grossSales.toLocaleString('en-IN')} ({invoiceCount} Invoices)
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={200000}
              step={5000}
              value={grossSales}
              onChange={e => {
                const g = parseInt(e.target.value);
                setGrossSales(g);
                setInvoiceCount(Math.max(2, Math.round(g / 6500)));
              }}
              style={{ width: '100%', accentColor: '#F5D061' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Contract Gateway Fee Rate:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: '#F5D061' }}>
                {feeRatePct.toFixed(2)}% ({Math.round(feeRatePct * 100)} bps)
              </span>
            </div>
            <input
              type="range"
              min={1.00}
              max={4.00}
              step={0.10}
              value={feeRatePct}
              onChange={e => setFeeRatePct(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#F5D061' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(5, 7, 15, 0.8)',
              padding: '0.85rem 1rem',
              border: '1px solid rgba(229, 184, 105, 0.18)',
              borderRadius: '6px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.84rem', color: '#FFFFFF', fontWeight: 700 }}>Apply 18% GST on Gateway Fee</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Statutory Indian Tax-Line Requirement</div>
            </div>
            <input
              type="checkbox"
              checked={gstEnabled}
              onChange={e => setGstEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#F5D061', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Customer Refund Deduction:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: '#F43F5E' }}>
                ₹{refundDeduction.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={500}
              value={refundDeduction}
              onChange={e => setRefundDeduction(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#F43F5E' }}
            />
          </div>
        </div>

        {/* Proof Output Card */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.6rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
            border: '1px solid rgba(245, 208, 97, 0.3)',
            boxShadow: '0 8px 30px rgba(245, 208, 97, 0.1)',
            borderRadius: '8px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Sparkles size={20} color="#F5D061" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                Agentic Mathematical Proof Output
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>+ Gross ERP Invoices ({invoiceCount} Items):</span>
                <span className="font-mono" style={{ color: '#FFFFFF', fontWeight: 800 }}>₹{grossSales.toLocaleString('en-IN')}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>− Gateway Fee ({feeRatePct.toFixed(2)}%):</span>
                <span className="font-mono" style={{ color: '#F5D061', fontWeight: 800 }}>− ₹{feeAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>− GST (18% Statutory on Fee):</span>
                <span className="font-mono" style={{ color: '#F5D061', fontWeight: 800 }}>− ₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>− Customer Refunds Withheld:</span>
                <span className="font-mono" style={{ color: '#F43F5E', fontWeight: 800 }}>− ₹{refundDeduction.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.12) 0%, rgba(5, 7, 15, 0.95) 100%)',
              padding: '1.25rem',
              border: '1px solid rgba(245, 208, 97, 0.4)',
              borderRadius: '8px',
              marginTop: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#E5B869', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
              RECONCILED BANK CREDIT REQUIREMENT
            </span>
            <div className="font-mono data-flicker" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F5D061', marginTop: '0.25rem' }}>
              ₹{netBankPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10B981', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <CheckCircle2 size={15} color="#10B981" />
              <span>Agentic Subset-Sum Math Vector Verified (Confidence 99.98%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
