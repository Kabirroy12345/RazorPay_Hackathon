import React from 'react';
import { Play, CheckCircle2, ShieldCheck, Layers, DollarSign, Clock, RefreshCw } from 'lucide-react';
import type { DualMetrics } from '../types/finance';

interface HeaderMetricsProps {
  metrics: DualMetrics;
  isProcessing: boolean;
  isSimulatingFault: boolean;
  onRunBatch: () => void;
  onToggleFaultSimulation: () => void;
}

export const HeaderMetrics: React.FC<HeaderMetricsProps> = ({
  metrics,
  isProcessing,
  isSimulatingFault,
  onRunBatch,
  onToggleFaultSimulation,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Terminal Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h1 className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
              OMNI_SETTLE
            </h1>
            <span className="badge badge-amber">
              SYS_AUDIT
            </span>
            <span className="badge badge-amber">
              3WAY_RECONCILER
            </span>
          </div>
          <p className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            3-Way Accounting Auditor (Bank ↔ Gateway ↔ ERP) : GROUND_TRUTH_BATCH_52
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onToggleFaultSimulation}
            className="btn-terminal"
            style={{
              borderColor: isSimulatingFault ? 'var(--accent-red)' : 'var(--border-hairline)',
              color: isSimulatingFault ? 'var(--accent-red)' : 'var(--text-muted)',
            }}
          >
            <RefreshCw size={15} />
            {isSimulatingFault ? 'FAULT_INJECTED' : 'INJECT_FAULT'}
          </button>

          <button
            onClick={onRunBatch}
            disabled={isProcessing}
            className="btn-terminal primary"
          >
            {isProcessing ? (
              <>
                <div style={{ width: '14px', height: '14px', border: '2px solid var(--bg-root)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                EXECUTING_BATCH...
              </>
            ) : (
              <>
                <Play size={16} /> EXECUTE_BATCH(52)
              </>
            )}
          </button>
        </div>
      </div>

      {isSimulatingFault && (
        <div className="terminal-panel font-mono" style={{ padding: '0.85rem 1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', borderColor: 'var(--accent-red)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--accent-red)' }}>
            <RefreshCw size={16} />
            <span>
              <strong>[FAULT_INJECTED]:</strong> Corrupted bank payload. Fallback PIPELINE_PARSE_CORRECTION_FALLBACK engaged.
            </span>
          </div>
          <span className="badge badge-red">RECOVERED_1</span>
        </div>
      )}

      {/* Dual Score Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        {/* Metric 1: Reconciliation Rate */}
        <div className="terminal-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              RECON_RATE
            </span>
            <CheckCircle2 size={16} color="var(--accent-amber)" />
          </div>
          <div className="font-mono data-flicker" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {metrics.reconciliationRate}%
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            {metrics.fastPathCount + metrics.agenticCount} / {metrics.totalRecords} MATCHED
          </div>
        </div>

        {/* Metric 2: Independent Classification Accuracy */}
        <div className="terminal-panel" style={{ padding: '1rem', borderColor: 'var(--text-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              PRECISION_SCORE
            </span>
            <ShieldCheck size={16} color="var(--text-primary)" />
          </div>
          <div className="font-mono data-flicker" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {metrics.classificationAccuracy}%
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            INDEPENDENT_TRUTH_VECTOR
          </div>
        </div>

        {/* Metric 3: Rule vs AI Division */}
        <div className="terminal-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              EXEC_DIVISION
            </span>
            <Layers size={16} color="var(--text-muted)" />
          </div>
          <div className="font-mono data-flicker" style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', fontSize: '1.2rem', fontWeight: 700 }}>
            <span style={{ color: 'var(--text-primary)' }}>{metrics.fastPathCount} RULE</span>
            <span style={{ color: 'var(--border-hairline)' }}>|</span>
            <span style={{ color: 'var(--accent-amber)' }}>{metrics.agenticCount} AI</span>
            <span style={{ color: 'var(--border-hairline)' }}>|</span>
            <span style={{ color: 'var(--accent-red)' }}>{metrics.exceptionCount} ERR</span>
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            35 FAST / 3 AGENT / 6 ERR
          </div>
        </div>

        {/* Metric 4: Latency */}
        <div className="terminal-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              EXEC_LATENCY
            </span>
            <Clock size={16} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="font-mono data-flicker" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {metrics.avgLatencyMs}ms
            </div>
            <svg width="60" height="20" viewBox="0 0 60 20" style={{ opacity: 0.6 }}>
              <polyline points="0,15 10,12 20,18 30,8 40,14 50,5 60,10" fill="none" stroke="var(--accent-amber)" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            SYS_AVERAGE_ROUNDTRIP
          </div>
        </div>

        {/* Metric 5: Total Reconciled Cash */}
        <div className="terminal-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              RECON_LIQUIDITY
            </span>
            <DollarSign size={16} color="var(--text-muted)" />
          </div>
          <div className="font-mono data-flicker" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{metrics.totalReconciledINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-primary)', marginTop: '0.3rem', fontWeight: 600 }}>
            VERIFIED_BANK_POSITION
          </div>
        </div>
      </div>
    </div>
  );
};
