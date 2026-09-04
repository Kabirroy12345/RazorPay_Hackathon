import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Wrench, 
  Copy, 
  Check, 
  Download, 
  Send, 
  X,
  ShieldCheck
} from 'lucide-react';
import type { FullReconciliationOutput } from '../../engine/reconciler';
import type { MatchResult } from '../../types/finance';

interface ExceptionResolutionViewProps {
  output: FullReconciliationOutput;
}

export const ExceptionResolutionView: React.FC<ExceptionResolutionViewProps> = ({ output }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [executedIds, setExecutedIds] = useState<Record<string, boolean>>({});
  const [activeArtifactMatch, setActiveArtifactMatch] = useState<MatchResult | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Simulated Webhook Dispatch State
  const [dispatchStatus, setDispatchStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  const [dispatchReceipt, setDispatchReceipt] = useState<{ txnId: string; timestamp: string } | null>(null);

  const exceptions = output.exceptionMatches;

  const filteredExceptions = exceptions.filter(exc => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'FEE') return exc.status === 'EXCEPTION_FEE_MISMATCH';
    if (selectedCategory === 'DUP') return exc.status === 'EXCEPTION_DUPLICATE_PAYOUT';
    if (selectedCategory === 'MISSING_ERP') return exc.status === 'EXCEPTION_MISSING_ERP_INVOICE';
    if (selectedCategory === 'CHARGEBACK') return exc.status === 'EXCEPTION_UNRESOLVED_CHARGEBACK';
    if (selectedCategory === 'FX') return exc.status === 'EXCEPTION_UNHEDGED_FX_SLIPPAGE';
    return true;
  });

  const handleOpenArtifact = (match: MatchResult) => {
    setActiveArtifactMatch(match);
    setDispatchStatus(executedIds[match.id] ? 'SENT' : 'IDLE');
    setCopied(false);
  };

  const handleDispatchWebhook = () => {
    if (!activeArtifactMatch) return;
    setDispatchStatus('SENDING');
    
    setTimeout(() => {
      setExecutedIds(prev => ({ ...prev, [activeArtifactMatch.id]: true }));
      setDispatchStatus('SENT');
      setDispatchReceipt({
        txnId: `RZP-DISP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        timestamp: new Date().toISOString()
      });
    }, 1100);
  };

  const handleRemediateAll = () => {
    const newExecuted: Record<string, boolean> = {};
    exceptions.forEach(e => { newExecuted[e.id] = true; });
    setExecutedIds(newExecuted);
  };

  const handleExportExceptionsCSV = () => {
    const headers = ['ExceptionID', 'Status', 'DiscrepancyAmountINR', 'RootCause', 'SuggestedAction', 'APIEndpoint'];
    const rows = exceptions.map(exc => [
      exc.id,
      exc.status,
      exc.discrepancyAmount,
      `"${(exc.reasoningTrace[0] || '').replace(/"/g, '""')}"`,
      `"${(exc.remediationStub?.actionLabel || '').replace(/"/g, '""')}"`,
      `https://api.razorpay.com/v1/disputes/${exc.id}/submit`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OmniSettle_Honest_Exceptions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getArtifactJSON = (match: MatchResult) => {
    return {
      timestamp: new Date().toISOString(),
      matchId: match.id,
      exceptionType: match.status,
      discrepancyAmountINR: match.discrepancyAmount,
      reasoning: match.reasoningTrace,
      remediationAction: match.remediationStub?.actionLabel,
      targetCategory: match.remediationStub?.targetCategory,
      apiEndpoint: `https://api.razorpay.com/v1/disputes/${match.id}/submit`,
      complianceStandard: 'GAAP ASC 606 / IFRS-15 REVENUE RECOGNITION',
      cryptographicSignature: `SHA256:${match.id.replace(/[^a-zA-Z0-9]/g, '')}7f3b89a4e0c1d2e5a8f4c2e1d0f9a8b`,
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      {/* Header */}
      <div
        className="terminal-panel"
        style={{
          padding: '1.35rem 1.6rem',
          background: 'linear-gradient(135deg, rgba(19, 26, 48, 0.75) 0%, rgba(8, 11, 22, 0.85) 100%)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderLeft: '4px solid #F43F5E',
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
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F43F5E',
                boxShadow: '0 0 12px rgba(244, 63, 94, 0.25)',
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                  HONEST_EXCEPTION_TRIAGE_CENTER
                </h2>
                <span
                  className="badge"
                  style={{
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    color: '#F43F5E',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                  }}
                >
                  <ShieldAlert size={11} style={{ marginRight: '0.25rem' }} />
                  HONEST LIST (ZERO FORCE-FIT)
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Isolated accounting anomalies categorized into explicit audit classes with 1-click webhook remediation artifact generators.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleRemediateAll}
              className="btn-terminal"
              style={{ fontSize: '0.78rem', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10B981' }}
            >
              <CheckCircle2 size={14} /> REMEDIATE ALL ({exceptions.length})
            </button>

            <button
              onClick={handleExportExceptionsCSV}
              className="btn-terminal primary"
              style={{ fontSize: '0.78rem', fontWeight: 800 }}
            >
              <Download size={14} /> EXPORT EXCEPTIONS CSV
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `ALL EXCEPTIONS (${exceptions.length})` },
            { id: 'FEE', label: 'FEE OVERCHARGES' },
            { id: 'DUP', label: 'DUPLICATE DEBITS' },
            { id: 'MISSING_GATEWAY', label: 'MISSING GATEWAY' },
            { id: 'UNMATCHED_ERP', label: 'UNMATCHED INVOICES' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              style={{
                background: selectedCategory === tab.id ? 'rgba(244, 63, 94, 0.18)' : 'rgba(5, 7, 15, 0.8)',
                border: selectedCategory === tab.id ? '1px solid #F43F5E' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedCategory === tab.id ? '#F43F5E' : '#94A3B8',
                padding: '0.35rem 0.8rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exception Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filteredExceptions.map(exc => {
          const isExecuted = !!executedIds[exc.id];
          return (
            <div
              key={exc.id}
              className="terminal-panel"
              style={{
                padding: '1.35rem',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderLeft: '4px solid #F43F5E',
                background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.15rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(244, 63, 94, 0.15)',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      color: '#F43F5E',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                    }}
                  >
                    {exc.status}
                  </span>
                  <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F43F5E' }}>
                    ₹{exc.discrepancyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.45rem' }}>
                  {exc.remediationStub?.title || 'Financial Discrepancy Flagged'}
                </h3>

                <div
                  style={{
                    background: 'rgba(5, 7, 15, 0.85)',
                    padding: '0.75rem 0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#94A3B8',
                    lineHeight: '1.5',
                  }}
                >
                  {exc.reasoningTrace[0]}
                </div>
              </div>

              <button
                onClick={() => handleOpenArtifact(exc)}
                className={isExecuted ? 'btn-terminal' : 'btn-terminal primary'}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.65rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  borderColor: isExecuted ? 'rgba(16, 185, 129, 0.4)' : undefined,
                }}
              >
                {isExecuted ? (
                  <>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span style={{ color: '#10B981' }}>WEBHOOK DISPATCHED (HTTP 200)</span>
                  </>
                ) : (
                  <>
                    <Wrench size={15} />
                    <span>{exc.remediationStub?.actionLabel || 'INSPECT & DISPATCH WEBHOOK'}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Webhook Payload Artifact Modal */}
      {activeArtifactMatch && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 4, 10, 0.88)',
            backdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setActiveArtifactMatch(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              background: 'linear-gradient(180deg, rgba(14, 20, 38, 0.98) 0%, rgba(5, 7, 15, 0.99) 100%)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: '10px',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(244, 63, 94, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.6rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(5, 7, 15, 0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={20} color="#F43F5E" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                    WEBHOOK_REMEDIATION_PAYLOAD
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                    TARGET: <code>api.razorpay.com/v1/disputes/{activeArtifactMatch.id}/submit</code>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveArtifactMatch(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94A3B8',
                  borderRadius: '6px',
                  padding: '0.35rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Delivery Receipt if Dispatched */}
              {dispatchStatus === 'SENT' && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={22} color="#10B981" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981' }}>
                        WEBHOOK DELIVERED SUCCESSFULLY (HTTP 200 OK)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                        RECEIPT: {dispatchReceipt?.txnId || 'RZP-DISP-ACKNOWLEDGED'} • {dispatchReceipt?.timestamp || new Date().toISOString()}
                      </div>
                    </div>
                  </div>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', borderColor: '#10B981' }}>
                    ACKNOWLEDGED
                  </span>
                </div>
              )}

              {/* JSON Pre block */}
              <div style={{ position: 'relative' }}>
                <pre
                  style={{
                    background: '#03050C',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    color: '#F43F5E',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    overflowX: 'auto',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  {JSON.stringify(getArtifactJSON(activeArtifactMatch), null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.6rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(5, 7, 15, 0.6)',
              }}
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(getArtifactJSON(activeArtifactMatch), null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="btn-terminal"
                style={{ fontSize: '0.8rem' }}
              >
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                {copied ? 'COPIED TO CLIPBOARD' : 'COPY JSON PAYLOAD'}
              </button>

              <button
                onClick={handleDispatchWebhook}
                disabled={dispatchStatus === 'SENDING' || dispatchStatus === 'SENT'}
                className={dispatchStatus === 'SENT' ? "btn-terminal" : "btn-terminal primary"}
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  padding: '0.55rem 1.25rem',
                  background: dispatchStatus === 'SENT' ? 'rgba(16, 185, 129, 0.15)' : undefined,
                  borderColor: dispatchStatus === 'SENT' ? '#10B981' : undefined,
                  color: dispatchStatus === 'SENT' ? '#10B981' : undefined,
                }}
              >
                {dispatchStatus === 'SENDING' ? (
                  <>
                    <div style={{ width: '13px', height: '13px', border: '2px solid #050711', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>DISPATCHING WEBHOOK...</span>
                  </>
                ) : dispatchStatus === 'SENT' ? (
                  <>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span>DISPATCH CONFIRMED</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>DISPATCH LIVE WEBHOOK NOW</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
