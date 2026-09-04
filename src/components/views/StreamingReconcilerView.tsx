import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap, Crown, Activity } from 'lucide-react';
import type { FullReconciliationOutput } from '../../engine/reconciler';

interface StreamingReconcilerViewProps {
  output: FullReconciliationOutput;
}

export const StreamingReconcilerView: React.FC<StreamingReconcilerViewProps> = ({ output }) => {
  const [streamIndex, setStreamIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMs, setSpeedMs] = useState(200);

  const totalMatches = output.allMatches.length;

  useEffect(() => {
    if (!isPlaying) return;
    if (streamIndex >= totalMatches) return;

    const timer = setTimeout(() => {
      setStreamIndex(prev => prev + 1);
    }, speedMs);

    return () => clearTimeout(timer);
  }, [streamIndex, isPlaying, speedMs, totalMatches]);

  const visibleMatches = output.allMatches.slice(0, streamIndex);
  const progressPct = Math.round((streamIndex / totalMatches) * 100);

  const fastPathCount = visibleMatches.filter(m => m.status === 'FAST_PATH_MATCHED').length;
  const agenticCount = visibleMatches.filter(m => m.status.startsWith('AGENTIC')).length;
  const exceptionCount = visibleMatches.filter(m => m.status.startsWith('EXCEPTION')).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Royal Streaming Header */}
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
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
                <Zap size={20} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                STREAMING_RECONCILIATION_ENGINE
              </h2>
              <span
                className="badge"
                style={{
                  background: 'rgba(245, 208, 97, 0.1)',
                  border: '1px solid rgba(245, 208, 97, 0.35)',
                  color: '#F5D061',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                <Crown size={11} style={{ marginRight: '0.25rem' }} />
                REAL-TIME VECTOR STREAM
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', fontFamily: 'var(--font-sans)', marginTop: '0.2rem' }}>
              Live transaction-by-transaction execution trace: Fast-Path Rule Matches (0 Tokens) vs Autonomous Agentic Solvers
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={isPlaying ? "btn-terminal" : "btn-terminal primary"}
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700 }}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} fill="#050711" />}
              {isPlaying ? 'PAUSE STREAM' : 'RESUME STREAM'}
            </button>

            <button
              onClick={() => { setStreamIndex(0); setIsPlaying(true); }}
              className="btn-terminal"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <RotateCcw size={14} /> RESET
            </button>

            <div
              style={{
                display: 'flex',
                gap: '0.25rem',
                border: '1px solid rgba(245, 208, 97, 0.25)',
                padding: '0.2rem',
                background: 'rgba(5, 7, 15, 0.9)',
                borderRadius: '6px',
              }}
            >
              {[
                { label: '1x', ms: 300 },
                { label: '2x', ms: 150 },
                { label: '5x', ms: 50 },
              ].map(sp => (
                <button
                  key={sp.label}
                  onClick={() => setSpeedMs(sp.ms)}
                  style={{
                    background: speedMs === sp.ms ? 'linear-gradient(135deg, #FFE082 0%, #F5D061 100%)' : 'transparent',
                    color: speedMs === sp.ms ? '#050711' : '#94A3B8',
                    border: 'none',
                    padding: '0.25rem 0.6rem',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Royal Progress Tracker */}
        <div style={{ marginTop: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.45rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#F8FAFC', fontWeight: 700 }}>
              STREAM PROGRESS: {streamIndex} / {totalMatches} ({progressPct}%)
            </span>
            <span style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ color: '#E5B869' }}>FAST-PATH: <strong>{fastPathCount}</strong></span>
              <span style={{ color: '#38BDF8' }}>AGENTIC: <strong>{agenticCount}</strong></span>
              <span style={{ color: '#F43F5E' }}>EXCEPTIONS: <strong>{exceptionCount}</strong></span>
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(5, 7, 15, 0.9)',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(229, 184, 105, 0.2)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #FFE082 0%, #F5D061 50%, #C4973B 100%)',
                boxShadow: '0 0 10px rgba(245, 208, 97, 0.6)',
                transition: 'width 0.15s linear',
              }}
            />
          </div>
        </div>
      </div>

      {/* Royal Ledger Table */}
      <div
        className="terminal-panel"
        style={{
          padding: '0',
          overflowX: 'auto',
          background: 'linear-gradient(180deg, rgba(12, 16, 30, 0.88) 0%, rgba(5, 7, 15, 0.94) 100%)',
          border: '1px solid rgba(229, 184, 105, 0.2)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          borderRadius: '8px',
        }}
      >
        <table className="terminal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(10, 14, 26, 0.85)', borderBottom: '1px solid rgba(229, 184, 105, 0.18)' }}>
              <th style={{ padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Seq #</th>
              <th style={{ padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Handler Subroutine</th>
              <th style={{ padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Status Classification</th>
              <th style={{ padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Bank Ref ID</th>
              <th style={{ padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textAlign: 'right', textTransform: 'uppercase' }}>Reconciled Amount</th>
              <th style={{ padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Reasoning Log Output</th>
            </tr>
          </thead>
          <tbody>
            {visibleMatches.map((m, idx) => (
              <tr
                key={m.id}
                className="animate-fade-in"
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background 0.15s ease',
                  background: idx === visibleMatches.length - 1 ? 'rgba(245, 208, 97, 0.08)' : 'transparent',
                }}
              >
                <td className="font-mono" style={{ color: '#E5B869', padding: '0.8rem 1rem', fontWeight: 700, fontSize: '0.8rem' }}>
                  #{String(idx + 1).padStart(2, '0')}
                </td>
                <td style={{ padding: '0.8rem 1rem' }}>
                  {m.matchType === 'RULE_BASED' && (
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(245, 208, 97, 0.1)',
                        border: '1px solid rgba(245, 208, 97, 0.35)',
                        color: '#F5D061',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}
                    >
                      FAST-PATH (0 Tokens)
                    </span>
                  )}
                  {m.matchType === 'AGENTIC_AI' && (
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        color: '#38BDF8',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}
                    >
                      AGENTIC AI
                    </span>
                  )}
                  {m.matchType === 'EXCEPTION' && (
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(244, 63, 94, 0.12)',
                        border: '1px solid rgba(244, 63, 94, 0.4)',
                        color: '#F43F5E',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}
                    >
                      HONEST EXCEPTION
                    </span>
                  )}
                  {m.matchType === 'HUMAN_REVIEW' && (
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(245, 208, 97, 0.1)',
                        border: '1px solid rgba(245, 208, 97, 0.35)',
                        color: '#F5D061',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}
                    >
                      HUMAN REVIEW
                    </span>
                  )}
                </td>
                <td style={{ color: '#F8FAFC', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', padding: '0.8rem 1rem' }}>
                  {m.status}
                </td>
                <td className="font-mono" style={{ color: '#94A3B8', padding: '0.8rem 1rem', fontSize: '0.78rem' }}>
                  {m.bankRecordId || 'MISSING_IN_BANK'}
                </td>
                <td className="font-mono" style={{ textAlign: 'right', padding: '0.8rem 1rem', fontWeight: 800, color: '#FFFFFF', fontSize: '0.9rem' }}>
                  ₹{m.reconciledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="font-mono" style={{ fontSize: '0.74rem', color: '#94A3B8', padding: '0.8rem 1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.reasoningTrace[0] || 'Processed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Royal Live System Log Ticker */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '270px',
          right: 0,
          background: 'rgba(5, 7, 17, 0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(229, 184, 105, 0.22)',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 100,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <span
          className="badge"
          style={{
            background: 'rgba(245, 208, 97, 0.15)',
            border: '1px solid rgba(245, 208, 97, 0.4)',
            color: '#F5D061',
            fontWeight: 800,
            fontSize: '0.65rem',
            padding: '0.15rem 0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Activity size={11} className="pulse-indicator" /> LIVE_SYS_LOG
        </span>
        <div
          className="font-mono data-flicker"
          style={{
            fontSize: '0.76rem',
            color: '#CBD5E1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
          }}
        >
          {visibleMatches.length > 0 
            ? `> [${new Date().toISOString().slice(11, 19)}] ${visibleMatches[visibleMatches.length - 1].reasoningTrace.join(' | ')}`
            : '> AWAITING STREAM INITIALIZATION...'}
        </div>
      </div>
    </div>
  );
};
