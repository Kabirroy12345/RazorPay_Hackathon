import React from 'react';
import { Play, CheckCircle2, ShieldCheck, Layers, DollarSign, Clock, RefreshCw, Crown, Sparkles } from 'lucide-react';
import type { DualMetrics } from '../types/finance';

interface HeaderMetricsProps {
  metrics: DualMetrics;
  datasetName?: string;
  isProcessing: boolean;
  isSimulatingFault: boolean;
  onRunBatch: () => void;
  onToggleFaultSimulation: () => void;
}

export const HeaderMetrics: React.FC<HeaderMetricsProps> = ({
  metrics,
  datasetName,
  isProcessing,
  isSimulatingFault,
  onRunBatch,
  onToggleFaultSimulation,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Royal Sovereign Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '0.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Crown size={22} color="#F5D061" style={{ filter: 'drop-shadow(0 0 8px rgba(245, 208, 97, 0.6))' }} />
              <h1
                className="font-mono"
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 14px rgba(0,0,0,0.8)',
                }}
              >
                OMNISETTLE<span style={{ color: '#F5D061' }}>_AI</span>
              </h1>
            </div>
            <span
              className="badge"
              style={{
                background: 'rgba(245, 208, 97, 0.1)',
                border: '1px solid rgba(245, 208, 97, 0.35)',
                color: '#F5D061',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              TRACK 04 FINTECH AI
            </span>
            <span
              className="badge"
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              3-WAY RECONCILER
            </span>
          </div>
          <p className="font-mono" style={{ color: '#94A3B8', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: '#E5B869', fontWeight: 600 }}>SOVEREIGN CLOSED-LOOP AUDITOR:</span>
            <span>Bank ↔ Gateway ↔ ERP</span>
            <span style={{ color: '#64748B' }}>•</span>
            <span style={{ color: '#F8FAFC' }}>{datasetName || `SYNTHETIC_BATCH_${metrics.totalRecords}`}</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onToggleFaultSimulation}
            className="btn-terminal"
            style={{
              borderColor: isSimulatingFault ? 'rgba(244, 63, 94, 0.6)' : 'rgba(255, 255, 255, 0.12)',
              color: isSimulatingFault ? '#F43F5E' : '#94A3B8',
              background: isSimulatingFault ? 'rgba(244, 63, 94, 0.12)' : 'rgba(12, 16, 30, 0.6)',
              fontSize: '0.8rem',
              padding: '0.55rem 0.95rem',
            }}
          >
            <RefreshCw size={14} className={isSimulatingFault ? 'pulse-indicator' : ''} />
            {isSimulatingFault ? 'FAULT_INJECTED (RECOVERING)' : 'INJECT CORRUPTED FAULT'}
          </button>

          <button
            onClick={onRunBatch}
            disabled={isProcessing}
            className="btn-terminal primary"
            style={{
              fontSize: '0.82rem',
              padding: '0.55rem 1.15rem',
              fontWeight: 800,
            }}
          >
            {isProcessing ? (
              <>
                <div style={{ width: '14px', height: '14px', border: '2px solid #050711', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                RECONCILING BATCH...
              </>
            ) : (
              <>
                <Play size={14} fill="#050711" /> RUN FULL 3-WAY BATCH ({metrics.totalRecords})
              </>
            )}
          </button>
        </div>
      </div>

      {isSimulatingFault && (
        <div
          className="terminal-panel font-mono"
          style={{
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            borderColor: 'rgba(244, 63, 94, 0.5)',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(12, 16, 30, 0.9) 100%)',
            boxShadow: '0 4px 15px rgba(244, 63, 94, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#F43F5E' }}>
            <RefreshCw size={16} />
            <span>
              <strong>[ADVERSARIAL FAULT INJECTED]:</strong> Corrupted bank statement payload detected. Autonomous pipeline fallback <code>PIPELINE_PARSE_CORRECTION_FALLBACK</code> engaged and recovered.
            </span>
          </div>
          <span className="badge badge-red" style={{ fontWeight: 800 }}>SELF_HEALED_1</span>
        </div>
      )}

      {/* 5 Royal Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        {/* Metric 1: Reconciliation Rate */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.15rem',
            background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.08) 0%, rgba(12, 16, 30, 0.85) 100%)',
            border: '1px solid rgba(245, 208, 97, 0.28)',
            borderTop: '3px solid #F5D061',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#E5B869', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              RECON_RATE
            </span>
            <CheckCircle2 size={16} color="#F5D061" style={{ filter: 'drop-shadow(0 0 6px rgba(245, 208, 97, 0.6))' }} />
          </div>
          <div className="font-mono data-flicker" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            {metrics.reconciliationRate}%
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#F5D061', fontWeight: 700 }}>{metrics.fastPathCount + metrics.agenticCount}</span>
            <span>/ {metrics.totalRecords} RECORDS MATCHED</span>
          </div>
        </div>

        {/* Metric 2: Independent Classification Accuracy */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.15rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(12, 16, 30, 0.85) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.28)',
            borderTop: '3px solid #38BDF8',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#38BDF8', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              PRECISION_SCORE
            </span>
            <ShieldCheck size={16} color="#38BDF8" style={{ filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))' }} />
          </div>
          <div className="font-mono data-flicker" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            {metrics.classificationAccuracy}%
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={11} color="#38BDF8" />
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>INDEPENDENT</span>
            <span>GROUND TRUTH</span>
          </div>
        </div>

        {/* Metric 3: Rule vs AI Division */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.15rem',
            background: 'linear-gradient(135deg, rgba(19, 26, 48, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderTop: '3px solid #E5B869',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#E5B869', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              EXEC_DIVISION
            </span>
            <Layers size={16} color="#E5B869" />
          </div>
          <div className="font-mono data-flicker" style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>
            <span style={{ color: '#FFFFFF' }}>{metrics.fastPathCount}</span>
            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>RULE</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
            <span style={{ color: '#F5D061' }}>{metrics.agenticCount}</span>
            <span style={{ color: '#F5D061', fontSize: '0.75rem' }}>AI</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
            <span style={{ color: '#F43F5E' }}>{metrics.exceptionCount}</span>
            <span style={{ color: '#F43F5E', fontSize: '0.75rem' }}>ERR</span>
          </div>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.35rem' }}>
            FAST-PATH RULES + AGENTIC SOLVERS
          </div>
        </div>

        {/* Metric 4: Latency */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.15rem',
            background: 'linear-gradient(135deg, rgba(19, 26, 48, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderTop: '3px solid #10B981',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              EXEC_LATENCY
            </span>
            <Clock size={16} color="#10B981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="font-mono data-flicker" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {metrics.avgLatencyMs}<span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 500 }}>ms</span>
            </div>
            <svg width="64" height="22" viewBox="0 0 60 20" style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))' }}>
              <polyline points="0,15 10,12 20,17 30,7 40,13 50,4 60,9" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.35rem' }}>
            ROUNDTRIP INLINE THROUGHPUT
          </div>
        </div>

        {/* Metric 5: Total Reconciled Cash */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.15rem',
            background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.1) 0%, rgba(12, 16, 30, 0.9) 100%)',
            border: '1px solid rgba(245, 208, 97, 0.3)',
            borderTop: '3px solid #FFE082',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#E5B869', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              VERIFIED_LIQUIDITY
            </span>
            <DollarSign size={16} color="#FFE082" style={{ filter: 'drop-shadow(0 0 6px rgba(245, 208, 97, 0.6))' }} />
          </div>
          <div className="font-mono data-flicker" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#F5D061', letterSpacing: '-0.02em' }}>
            ₹{metrics.totalReconciledINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#E5B869', marginTop: '0.35rem', fontWeight: 700 }}>
            AUDITED BANK POSITION
          </div>
        </div>
      </div>
    </div>
  );
};
