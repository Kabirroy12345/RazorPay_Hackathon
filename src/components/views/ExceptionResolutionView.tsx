import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, FileText, Wrench } from 'lucide-react';
import type { FullReconciliationOutput } from '../../engine/reconciler';
import type { MatchResult } from '../../types/finance';

interface ExceptionResolutionViewProps {
  output: FullReconciliationOutput;
}

export const ExceptionResolutionView: React.FC<ExceptionResolutionViewProps> = ({ output }) => {
  const [executedIds, setExecutedIds] = useState<Record<string, boolean>>({});
  const [artifactModalText, setArtifactModalText] = useState<string | null>(null);

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
    };

    setArtifactModalText(JSON.stringify(artifact, null, 2));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="terminal-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
          <ShieldAlert size={22} color="var(--accent-red)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            EXCEPTION_REMEDIATION_CENTER
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Triage center categorizing unresolvable discrepancies into explicit audit classes with 1-click remediation artifact generators.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {exceptions.map(exc => {
          const isExecuted = !!executedIds[exc.id];
          return (
            <div
              key={exc.id}
              className="terminal-panel"
              style={{
                padding: '1.25rem',
                borderLeft: '2px solid var(--accent-red)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-red">
                    {exc.status}
                  </span>
                  <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-red)' }}>
                    ₹{exc.discrepancyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {exc.remediationStub?.title || 'Financial Discrepancy Flagged'}
                </h3>

                <div style={{ background: 'var(--bg-root)', padding: '0.65rem', border: '1px solid var(--border-hairline)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {exc.reasoningTrace[0]}
                </div>
              </div>

              <button
                onClick={() => handleExecute(exc)}
                disabled={isExecuted}
                className={isExecuted ? 'btn-terminal' : 'btn-terminal primary'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isExecuted ? (
                  <>
                    <CheckCircle2 size={16} />
                    Remediation Stubbed / Ready for Webhook
                  </>
                ) : (
                  <>
                    <Wrench size={16} />
                    {exc.remediationStub?.actionLabel || 'Execute Remediation Action'}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {artifactModalText && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="terminal-panel" style={{ width: '600px', maxWidth: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--text-primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Generated Webhook Payload Artifact</h3>
              </div>
              <button onClick={() => setArtifactModalText(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <pre style={{ background: '#07090e', padding: '1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', overflowX: 'auto', maxHeight: '350px' }}>
              {artifactModalText}
            </pre>
            <button
              onClick={() => setArtifactModalText(null)}
              className="btn-terminal primary"
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            >
              Close Artifact View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
