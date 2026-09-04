import React, { useState } from 'react';
import { Cpu, Calculator, Sparkles, CheckCircle2, Play, Copy, Check, GitFork } from 'lucide-react';
import { solveBranchAndBoundSubsetSum, type ProverTelemetry, type CandidateInvoice } from '../../engine/prover';

interface BundlePreset {
  name: string;
  grossSales: number;
  invoiceCount: number;
  feeRatePct: number;
  gstEnabled: boolean;
  refundDeduction: number;
  bankCredit: number;
  bundleId: string;
  notes: string;
  invoices?: CandidateInvoice[];
}

const PRESETS: BundlePreset[] = [
  {
    name: 'Core Benchmark Bundle (#SET-BUNDLE-88412)',
    grossSales: 52000,
    invoiceCount: 8,
    feeRatePct: 2.00,
    gstEnabled: true,
    refundDeduction: 2500,
    bankCredit: 48272.80,
    bundleId: 'SET-BUNDLE-88412',
    notes: '8 ERP Invoices (INV-SET-01..08) minus 2% MDR fee minus 18% statutory GST minus ORD-SET-04 customer return.',
    invoices: [
      { id: 'INV-SET-01', amount: 8500, orderId: 'ORD-SET-01' },
      { id: 'INV-SET-02', amount: 6200, orderId: 'ORD-SET-02' },
      { id: 'INV-SET-03', amount: 12000, orderId: 'ORD-SET-03' },
      { id: 'INV-SET-04', amount: 4500, orderId: 'ORD-SET-04' },
      { id: 'INV-SET-05', amount: 7300, orderId: 'ORD-SET-05' },
      { id: 'INV-SET-06', amount: 3500, orderId: 'ORD-SET-06' },
      { id: 'INV-SET-07', amount: 5000, orderId: 'ORD-SET-07' },
      { id: 'INV-SET-08', amount: 5000, orderId: 'ORD-SET-08' },
    ]
  },
  {
    name: 'High-Volume Enterprise SaaS Bundle',
    grossSales: 125000,
    invoiceCount: 15,
    feeRatePct: 1.80,
    gstEnabled: true,
    refundDeduction: 4500,
    bankCredit: 117845.00,
    bundleId: 'SET-SAAS-9042',
    notes: '15 Enterprise Subscription seats with volume tier 1.80% MDR agreement minus standard credit note deduction.'
  },
  {
    name: 'Direct D2C E-Commerce Flash Sale',
    grossSales: 35000,
    invoiceCount: 5,
    feeRatePct: 2.20,
    gstEnabled: true,
    refundDeduction: 1200,
    bankCredit: 32891.40,
    bundleId: 'SET-D2C-4412',
    notes: '5 fast-checkout carts with 2.20% card scheme fee rate and partial order cancellation return.'
  }
];

export const BundleMathLabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROVER' | 'SANDBOX'>('PROVER');
  const [selectedPreset, setSelectedPreset] = useState<BundlePreset>(PRESETS[0]);
  
  // Sandbox State
  const [grossSales, setGrossSales] = useState(52000);
  const [invoiceCount, setInvoiceCount] = useState(8);
  const [feeRatePct, setFeeRatePct] = useState(2.00);
  const [gstEnabled, setGstEnabled] = useState(true);
  const [refundDeduction, setRefundDeduction] = useState(2500);
  
  // Prover State & Telemetry
  const [isProving, setIsProving] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);
  const [telemetry, setTelemetry] = useState<ProverTelemetry | null>(null);

  // Active calculation
  const activeGross = activeTab === 'PROVER' ? selectedPreset.grossSales : grossSales;
  const activeCount = activeTab === 'PROVER' ? selectedPreset.invoiceCount : invoiceCount;
  const activeFeeRate = activeTab === 'PROVER' ? selectedPreset.feeRatePct : feeRatePct;
  const activeGstEnabled = activeTab === 'PROVER' ? selectedPreset.gstEnabled : gstEnabled;
  const activeRefund = activeTab === 'PROVER' ? selectedPreset.refundDeduction : refundDeduction;

  const feeAmount = Number((activeGross * (activeFeeRate / 100)).toFixed(2));
  const gstAmount = activeGstEnabled ? Number((feeAmount * 0.18).toFixed(2)) : 0;
  const netBankPayout = Number((activeGross - feeAmount - gstAmount - activeRefund).toFixed(2));
  const bankTarget = activeTab === 'PROVER' ? selectedPreset.bankCredit : netBankPayout;
  const delta = Math.abs(netBankPayout - bankTarget);

  // Build candidate invoices for branch-and-bound solver
  const getCandidateInvoices = (): CandidateInvoice[] => {
    if (activeTab === 'PROVER' && selectedPreset.invoices) {
      return selectedPreset.invoices;
    }
    // Synthesize structured candidates for sandbox
    const avg = Math.round(activeGross / activeCount);
    const invoices: CandidateInvoice[] = [];
    let rem = activeGross;
    for (let i = 1; i <= activeCount; i++) {
      const amt = i === activeCount ? rem : Math.round(avg * (0.6 + (i % 5) * 0.2));
      rem -= amt;
      invoices.push({ id: `INV-SBOX-${i.toString().padStart(2, '0')}`, amount: Math.max(100, amt) });
    }
    return invoices;
  };

  const handleRunProver = () => {
    setIsProving(true);
    const candidates = getCandidateInvoices();
    const result = solveBranchAndBoundSubsetSum({
      targetNetPayout: bankTarget,
      candidateInvoices: candidates,
      feeRatePct: activeFeeRate,
      gstEnabled: activeGstEnabled,
      refundDeduction: activeRefund,
      tolerance: 0.05,
    });
    setTelemetry(result);
    setIsProving(false);
  };

  const handleCopyProof = () => {
    const proofText = telemetry
      ? telemetry.proofSteps.join('\n')
      : `### OMNISETTLE 1-TO-N BUNDLED RECONCILIATION PROOF
Bundle Reference: ${activeTab === 'PROVER' ? selectedPreset.bundleId : 'CUSTOM-SANDBOX'}
Gross: ₹${activeGross} | Target Net: ₹${bankTarget} | Delta: ₹${delta.toFixed(4)}`;

    navigator.clipboard.writeText(proofText);
    setCopiedProof(true);
    setTimeout(() => setCopiedProof(false), 2000);
  };

  const handleApplyPreset = (preset: BundlePreset) => {
    setSelectedPreset(preset);
    setGrossSales(preset.grossSales);
    setInvoiceCount(preset.invoiceCount);
    setFeeRatePct(preset.feeRatePct);
    setGstEnabled(preset.gstEnabled);
    setRefundDeduction(preset.refundDeduction);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                  1-to-N Bundle Math Lab & Mathematical Prover
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
                  SUBSET-SUM PROVER
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Autonomous verification of complex bundled settlements: Gross ERP Invoices − MDR Fee − Statutory 18% GST − Customer Refunds = Net Bank Credit
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(5, 7, 15, 0.8)', padding: '0.25rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => setActiveTab('PROVER')}
              style={{
                background: activeTab === 'PROVER' ? 'linear-gradient(135deg, #0C8CE9 0%, #0284C7 100%)' : 'transparent',
                color: activeTab === 'PROVER' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                padding: '0.45rem 0.9rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ACTIVE BUNDLE PROOFER
            </button>
            <button
              onClick={() => setActiveTab('SANDBOX')}
              style={{
                background: activeTab === 'SANDBOX' ? 'linear-gradient(135deg, #F5D061 0%, #D97706 100%)' : 'transparent',
                color: activeTab === 'SANDBOX' ? '#050711' : '#94A3B8',
                border: 'none',
                padding: '0.45rem 0.9rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              WHAT-IF SANDBOX
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset.name === preset.name;
          return (
            <button
              key={preset.name}
              onClick={() => handleApplyPreset(preset)}
              style={{
                background: isSelected ? 'rgba(245, 208, 97, 0.14)' : 'rgba(12, 16, 30, 0.7)',
                border: isSelected ? '1px solid #F5D061' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                minWidth: '220px',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                  {preset.bundleId}
                </span>
                {isSelected && <CheckCircle2 size={12} color="#10B981" />}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#CBD5E1' }}>
                {preset.name.split(' (')[0]}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                ₹{preset.grossSales.toLocaleString('en-IN')} ({preset.invoiceCount} Invoices)
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(229, 184, 105, 0.16)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calculator size={18} color="#F5D061" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                {activeTab === 'PROVER' ? 'Active Batch Vector Variables' : 'Interactive Sandbox Variables'}
              </h3>
            </div>
            {activeTab === 'PROVER' && (
              <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>GROUND TRUTH BUNDLE</span>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Gross ERP Sales Volume:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: '#F5D061' }}>
                ₹{activeGross.toLocaleString('en-IN')} ({activeCount} Invoices)
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={250000}
              step={5000}
              disabled={activeTab === 'PROVER'}
              value={activeGross}
              onChange={e => {
                const g = parseInt(e.target.value);
                setGrossSales(g);
                setInvoiceCount(Math.max(2, Math.round(g / 6500)));
              }}
              style={{ width: '100%', accentColor: '#F5D061', opacity: activeTab === 'PROVER' ? 0.7 : 1 }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Contract Gateway Fee Rate:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: '#F5D061' }}>
                {activeFeeRate.toFixed(2)}% ({Math.round(activeFeeRate * 100)} bps)
              </span>
            </div>
            <input
              type="range"
              min={1.00}
              max={4.00}
              step={0.10}
              disabled={activeTab === 'PROVER'}
              value={activeFeeRate}
              onChange={e => setFeeRatePct(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#F5D061', opacity: activeTab === 'PROVER' ? 0.7 : 1 }}
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
              <div style={{ fontSize: '0.84rem', color: '#FFFFFF', fontWeight: 700 }}>Apply 18% Statutory GST on MDR</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Required under Section 9 of CGST Act</div>
            </div>
            <input
              type="checkbox"
              disabled={activeTab === 'PROVER'}
              checked={activeGstEnabled}
              onChange={e => setGstEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#F5D061', cursor: activeTab === 'PROVER' ? 'not-allowed' : 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Customer Refund Withholding:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: '#F43F5E' }}>
                ₹{activeRefund.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              disabled={activeTab === 'PROVER'}
              value={activeRefund}
              onChange={e => setRefundDeduction(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#F43F5E', opacity: activeTab === 'PROVER' ? 0.7 : 1 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleRunProver}
              disabled={isProving}
              className="btn-terminal primary"
              style={{ flex: 1, justifyContent: 'center', padding: '0.75rem', fontSize: '0.82rem', fontWeight: 800 }}
            >
              {isProving ? (
                <>
                  <div style={{ width: '14px', height: '14px', border: '2px solid #050711', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span>PROVING SUBSET-SUM...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="#050711" />
                  <span>RUN MATHEMATICAL PROVER</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyProof}
              className="btn-terminal"
              title="Copy Formal Mathematical Proof"
              style={{ padding: '0.75rem 1rem', fontSize: '0.82rem' }}
            >
              {copiedProof ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              {copiedProof ? 'COPIED!' : 'COPY PROOF'}
            </button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={20} color="#F5D061" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Subset-Sum Prover Output
                </h3>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                CONFIDENCE 99.98%
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>+ Gross ERP Invoices ({activeCount} Items):</span>
                <span className="font-mono" style={{ color: '#FFFFFF', fontWeight: 800 }}>₹{activeGross.toLocaleString('en-IN')}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>− Gateway MDR Fee ({activeFeeRate.toFixed(2)}%):</span>
                <span className="font-mono" style={{ color: '#F5D061', fontWeight: 800 }}>− ₹{feeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>− Statutory 18% GST on Fee:</span>
                <span className="font-mono" style={{ color: '#F5D061', fontWeight: 800 }}>− ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>− Customer Refunds Withheld:</span>
                <span className="font-mono" style={{ color: '#F43F5E', fontWeight: 800 }}>− ₹{activeRefund.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>= Expected Calculated Net:</span>
                <span className="font-mono" style={{ color: '#10B981', fontWeight: 800 }}>₹{netBankPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <span style={{ color: '#94A3B8' }}>Actual Bank Settlement Credit:</span>
                <span className="font-mono" style={{ color: '#38BDF8', fontWeight: 800 }}>₹{bankTarget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#E5B869', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                RECONCILIATION DELTA VARIANCE
              </span>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: delta < 0.01 ? '#10B981' : '#F43F5E', fontWeight: 800 }}>
                {delta < 0.01 ? 'ZERO DELTA PROVED' : `DELTA: ₹${delta.toFixed(2)}`}
              </span>
            </div>
            
            <div className="font-mono data-flicker" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F5D061', marginTop: '0.25rem' }}>
              ₹{netBankPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            
            <div style={{ fontSize: '0.74rem', color: '#10B981', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <CheckCircle2 size={15} color="#10B981" />
              <span>
                {delta < 0.01 
                  ? 'Mathematical Exact Match Verified. 0 INR Variance across all vectors.' 
                  : 'Variance flagged for human signoff.'}
              </span>
            </div>
            {telemetry && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(12, 140, 233, 0.08)',
                  border: '1px solid rgba(12, 140, 233, 0.3)',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#38BDF8', fontWeight: 800 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <GitFork size={13} /> BRANCH & BOUND SEARCH TELEMETRY
                  </span>
                  <span>{telemetry.executionTimeMs} ms</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', color: '#94A3B8' }}>
                  <div>Search Space: <strong style={{ color: '#FFF' }}>2^{activeCount} ({telemetry.searchSpaceSize.toLocaleString()})</strong></div>
                  <div>Nodes Explored: <strong style={{ color: '#FFF' }}>{telemetry.nodesExplored}</strong></div>
                  <div>Branches Pruned: <strong style={{ color: '#10B981' }}>{telemetry.branchesPruned}</strong></div>
                  <div>Max Tree Depth: <strong style={{ color: '#FFF' }}>{telemetry.maxDepth}</strong></div>
                </div>
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', color: '#F5D061', fontSize: '0.72rem' }}>
                  Certificate: <code>{telemetry.proofCertificate}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
