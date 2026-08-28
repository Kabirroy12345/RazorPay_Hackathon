import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, Wrench } from 'lucide-react';
import type { MatchResult, BankTransaction, GatewayRecord, ERPInvoice } from '../types/finance';

interface ExceptionDrawerProps {
  selectedMatch: MatchResult | null;
  bankTxns: BankTransaction[];
  gatewayRecords: GatewayRecord[];
  erpInvoices: ERPInvoice[];
  onClose: () => void;
}

export const ExceptionDrawer: React.FC<ExceptionDrawerProps> = ({
  selectedMatch,
  bankTxns,
  gatewayRecords,
  erpInvoices,
  onClose,
}) => {
  const [remediationExecuted, setRemediationExecuted] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!selectedMatch) return;
    setVisibleLines(0);
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= selectedMatch.reasoningTrace.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [selectedMatch]);

  if (!selectedMatch) return null;

  const bRecord = bankTxns.find(b => b.id === selectedMatch.bankRecordId);
  const gRecords = gatewayRecords.filter(g => selectedMatch.gatewayRecordIds.includes(g.id));
  const erpRecords = erpInvoices.filter(e => selectedMatch.erpInvoiceIds.includes(e.id));
  const isException = selectedMatch.status.startsWith('EXCEPTION') || selectedMatch.status === 'AMBIGUOUS_HUMAN_REVIEW';

  const handleExecuteRemediation = () => {
    setRemediationExecuted(true);
  };

  return (
    <div
      className="terminal-panel drawer-slide-in"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '540px',
        maxWidth: '100vw',
        borderLeft: '1px solid var(--border-hairline)',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
        zIndex: 1000,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1rem' }}>
        <div>
          <span className={`badge ${isException ? 'badge-red' : 'badge-amber'}`} style={{ marginBottom: '0.4rem' }}>
            {selectedMatch.status}
          </span>
          <h2 className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {isException ? 'EXCEPTION_DEEP_DIVE' : 'RECONCILIATION_AUDIT'}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            MATCH_VECTOR_ID: {selectedMatch.id}
          </span>
        </div>

        <button
          onClick={onClose}
          className="btn-terminal"
          style={{ padding: '0.4rem' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Discrepancy Amount Banner */}
      {isException && selectedMatch.discrepancyAmount > 0 && (
        <div className="glitch-shake" style={{ background: 'var(--bg-root)', border: '1px solid var(--accent-red)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={24} color="var(--accent-red)" className="pulse-indicator" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: 700, textTransform: 'uppercase' }}>
              QUANTIFIED_VARIANCE_IMPACT
            </div>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{selectedMatch.discrepancyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      )}

      {/* Linked Identifiers */}
      <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          LINKED_3WAY_IDENTIFIERS
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>1. BANK_CREDIT:</span>
          <span className="font-mono" style={{ fontWeight: 700, color: bRecord ? 'var(--text-primary)' : 'var(--accent-red)' }}>
            {bRecord ? `${bRecord.id} (₹${bRecord.amount})` : 'MISSING_IN_BANK'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>2. GATEWAY_SETTLEMENT:</span>
          <span className="font-mono" style={{ fontWeight: 700, color: gRecords.length > 0 ? 'var(--text-primary)' : 'var(--accent-red)' }}>
            {gRecords.length > 0 ? `${gRecords[0].id} (${gRecords.length} items)` : 'UNLINKED_IN_GATEWAY'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>3. ERP_SALES_INVOICE:</span>
          <span className="font-mono" style={{ fontWeight: 700, color: erpRecords.length > 0 ? 'var(--text-primary)' : 'var(--accent-amber)' }}>
            {erpRecords.length > 0 ? `${erpRecords[0].id} (₹${erpRecords[0].amount})` : '0_SALES_INVOICES'}
          </span>
        </div>
      </div>

      {/* AI Reasoning Trace */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
          <Sparkles size={15} color="var(--text-primary)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            AI_ROOT_CAUSE_REASONING_TRACE
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-root)', padding: '0.85rem', border: '1px solid var(--border-hairline)' }}>
          {selectedMatch.reasoningTrace.slice(0, visibleLines).map((step, idx) => (
            <div key={idx} className="data-flicker" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              <span style={{ color: 'var(--text-primary)' }}>[{idx + 1}]</span> {step}
            </div>
          ))}
          {visibleLines < selectedMatch.reasoningTrace.length && (
            <div className="pulse-indicator" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              █
            </div>
          )}
        </div>
      </div>

      {/* Mock Remediation Action Stub */}
      {selectedMatch.remediationStub && (
        <div style={{ background: 'var(--bg-root)', border: '1px solid var(--text-primary)', padding: '1.15rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Wrench size={16} color="var(--text-primary)" />
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              1-CLICK_REMEDIATION_ACTION [STUB]
            </h3>
          </div>

          <p className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            {selectedMatch.remediationStub.title}
          </p>

          <button
            onClick={handleExecuteRemediation}
            disabled={remediationExecuted}
            className={remediationExecuted ? 'btn-terminal' : 'btn-terminal primary'}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {remediationExecuted ? (
              <>
                <CheckCircle2 size={16} />
                REMEDIATION_STUBBED_READY_FOR_WEBHOOK
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                {selectedMatch.remediationStub.actionLabel}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
