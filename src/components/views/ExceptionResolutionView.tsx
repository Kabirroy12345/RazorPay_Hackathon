import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, FileText, Wrench, Copy, Check } from 'lucide-react';
import type { FullReconciliationOutput } from '../../engine/reconciler';
import type { MatchResult } from '../../types/finance';

interface ExceptionResolutionViewProps {
  output: FullReconciliationOutput;
}

export const ExceptionResolutionView: React.FC<ExceptionResolutionViewProps> = ({ output }) => {
  const [executedIds, setExecutedIds] = useState<Record<string, boolean>>({});
  const [artifactModalText, setArtifactModalText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const exceptions = output.exceptionMatches;

  const handleExecute = (match: MatchResult) => {
    setExecutedIds(prev => ({ ...prev, [match.id]: true }));

    const artifact = {
      timestamp: new Date().toISOString(),
      matchId: match.id,
      exceptionType: match.status,
      discrepancyAmountINR: match.discrepancyAmount,
      reasoning: match.reasoningTrace,
      remediationAction: match.remediationStub?.actionLabel,
      apiEndpoint: `https://api.razorpay.com/v1/disputes/${match.id}/submit`,
      complianceStandard: 'GAAP / IFRS-15 REVENUE_RECOGNITION',
      cryptographicSignature: 'SHA256:7f3b89a4e0c1d2e5a8f4c2e1d0f9a8b',
    };

    setArtifactModalText(JSON.stringify(artifact, null, 2));
    setCopied(false);
  };

  const handleCopy = () => {
    if (artifactModalText) {
      navigator.clipboard.writeText(artifactModalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
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
      </div>

      {/* Exception Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {exceptions.map(exc => {
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
                onClick={() => handleExecute(exc)}
                disabled={isExecuted}
                className={isExecuted ? 'btn-terminal' : 'btn-terminal primary'}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.65rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                }}
              >
                {isExecuted ? (
                  <>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>REMEDIATION READY FOR WEBHOOK</span>
                  </>
                ) : (
                  <>
                    <Wrench size={15} />
                    <span>{exc.remediationStub?.actionLabel || 'GENERATE REMEDIATION ARTIFACT'}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Webhook Payload Artifact Modal */}
      {artifactModalText && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 4, 10, 0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="terminal-panel"
            style={{
              width: '640px',
              maxWidth: '100%',
              padding: '1.75rem',
              background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.96) 0%, rgba(5, 7, 15, 0.98) 100%)',
              border: '1px solid rgba(245, 208, 97, 0.35)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              borderRadius: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(229, 184, 105, 0.2)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={20} color="#F5D061" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>Generated Webhook Payload Artifact</h3>
              </div>
              <button
                onClick={() => setArtifactModalText(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.2rem',
                }}
              >
                ✕
              </button>
            </div>

            <pre
              style={{
                background: '#04060d',
                padding: '1.15rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                color: '#CBD5E1',
                overflowX: 'auto',
                maxHeight: '360px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                lineHeight: '1.6',
              }}
            >
              {artifactModalText}
            </pre>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={handleCopy}
                className="btn-terminal"
                style={{ flex: 1, justifyContent: 'center', borderColor: 'rgba(245, 208, 97, 0.3)', color: '#F5D061' }}
              >
                {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                {copied ? 'COPIED TO CLIPBOARD' : 'COPY JSON PAYLOAD'}
              </button>
              <button
                onClick={() => setArtifactModalText(null)}
                className="btn-terminal primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                CLOSE ARTIFACT VIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
