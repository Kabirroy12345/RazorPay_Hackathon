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
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= selectedMatch.reasoningTrace.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 150);
    return () => {
      clearInterval(interval);
      setVisibleLines(0);
    };
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
        width: '560px',
        maxWidth: '100vw',
        background: 'linear-gradient(180deg, rgba(10, 14, 26, 0.97) 0%, rgba(5, 7, 15, 0.98) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        borderLeft: '2px solid rgba(245, 208, 97, 0.35)',
        boxShadow: '-15px 0 50px rgba(0,0,0,0.85)',
        zIndex: 1000,
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.35rem',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(229, 184, 105, 0.2)', paddingBottom: '1.15rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
            <span
              className="badge"
              style={{
                background: isException ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 208, 97, 0.12)',
                border: isException ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(245, 208, 97, 0.35)',
                color: isException ? '#F43F5E' : '#F5D061',
                fontWeight: 800,
                fontSize: '0.72rem',
              }}
            >
              {selectedMatch.status}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              CONFIDENCE {(selectedMatch.confidenceScore * 100).toFixed(0)}%
            </span>
          </div>

          <h2 className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
            {isException ? 'EXCEPTION_DEEP_DIVE' : 'RECONCILIATION_AUDIT'}
          </h2>
          <span style={{ fontSize: '0.76rem', color: '#E5B869', fontFamily: 'var(--font-mono)' }}>
            MATCH_VECTOR_ID: {selectedMatch.id}
          </span>
        </div>

        <button
          onClick={onClose}
          className="btn-terminal"
          style={{ padding: '0.45rem', borderColor: 'rgba(255, 255, 255, 0.15)' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Discrepancy Amount Banner */}
      {isException && selectedMatch.discrepancyAmount > 0 && (
        <div
          className="glitch-shake"
          style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(12, 16, 30, 0.9) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.45)',
            borderRadius: '8px',
            padding: '1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            boxShadow: '0 4px 15px rgba(244, 63, 94, 0.2)',
          }}
        >
          <ShieldAlert size={26} color="#F43F5E" className="pulse-indicator" />
          <div>
            <div style={{ fontSize: '0.76rem', color: '#F43F5E', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              QUANTIFIED_VARIANCE_IMPACT
            </div>
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.15rem' }}>
              ₹{selectedMatch.discrepancyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      )}

      {/* Linked Identifiers */}
      <div
        style={{
          background: 'rgba(5, 7, 15, 0.85)',
          padding: '1.15rem',
          border: '1px solid rgba(229, 184, 105, 0.2)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#E5B869', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
          LINKED_3WAY_IDENTIFIERS
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: '#94A3B8' }}>1. BANK CREDIT:</span>
          <span className="font-mono" style={{ fontWeight: 700, color: bRecord ? '#FFFFFF' : '#F43F5E' }}>
            {bRecord ? `${bRecord.id} (₹${bRecord.amount.toLocaleString('en-IN')})` : 'MISSING_IN_BANK'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: '#94A3B8' }}>2. GATEWAY SETTLEMENT:</span>
          <span className="font-mono" style={{ fontWeight: 700, color: gRecords.length > 0 ? '#FFFFFF' : '#F43F5E' }}>
            {gRecords.length > 0 ? `${gRecords[0].id} (${gRecords.length} items)` : 'UNLINKED_IN_GATEWAY'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: '#94A3B8' }}>3. ERP SALES INVOICE:</span>
          <span className="font-mono" style={{ fontWeight: 700, color: erpRecords.length > 0 ? '#FFFFFF' : '#E5B869' }}>
            {erpRecords.length > 0 ? `${erpRecords[0].id} (₹${erpRecords[0].amount.toLocaleString('en-IN')})` : '0_SALES_INVOICES'}
          </span>
        </div>
      </div>

      {/* AI Reasoning Trace */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
          <Sparkles size={15} color="#F5D061" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
            AI_ROOT_CAUSE_REASONING_TRACE
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            background: 'rgba(5, 7, 15, 0.9)',
            padding: '1rem',
            border: '1px solid rgba(229, 184, 105, 0.18)',
            borderRadius: '8px',
          }}
        >
          {selectedMatch.reasoningTrace.slice(0, visibleLines).map((step, idx) => (
            <div key={idx} className="data-flicker" style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#CBD5E1', lineHeight: '1.5', display: 'flex', gap: '0.6rem' }}>
              <span style={{ color: '#F5D061', fontWeight: 800 }}>[{idx + 1}]</span>
              <span>{step}</span>
            </div>
          ))}
          {visibleLines < selectedMatch.reasoningTrace.length && (
            <div className="pulse-indicator" style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#F5D061' }}>
              █
            </div>
          )}
        </div>
      </div>

      {/* Mock Remediation Action Stub */}
      {selectedMatch.remediationStub && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.08) 0%, rgba(12, 16, 30, 0.9) 100%)',
            border: '1px solid rgba(245, 208, 97, 0.35)',
            borderRadius: '8px',
            padding: '1.25rem',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.55rem' }}>
            <Wrench size={16} color="#F5D061" />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F5D061', fontFamily: 'var(--font-mono)' }}>
              1-CLICK_REMEDIATION_ACTION [STUB]
            </h3>
          </div>

          <p className="font-mono" style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem', lineHeight: '1.4' }}>
            {selectedMatch.remediationStub.title}
          </p>

          <button
            onClick={handleExecuteRemediation}
            disabled={remediationExecuted}
            className={remediationExecuted ? 'btn-terminal' : 'btn-terminal primary'}
            style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', fontSize: '0.82rem', fontWeight: 800 }}
          >
            {remediationExecuted ? (
              <>
                <CheckCircle2 size={16} color="#10B981" />
                <span>REMEDIATION READY FOR WEBHOOK</span>
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                <span>{selectedMatch.remediationStub.actionLabel}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
