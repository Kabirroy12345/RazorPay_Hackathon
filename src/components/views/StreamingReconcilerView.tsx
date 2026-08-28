import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="terminal-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <Zap size={20} color="var(--text-primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                STREAMING_RECONCILIATION_ENGINE
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>
              Real-time execution trace: Fast-Path Rules vs Agentic AI Subroutines
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={isPlaying ? "btn-terminal" : "btn-terminal primary"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'PAUSE' : 'RESUME'}
            </button>

            <button
              onClick={() => { setStreamIndex(0); setIsPlaying(true); }}
              className="btn-terminal"
            >
              <RotateCcw size={16} /> RESET
            </button>

            <div style={{ display: 'flex', gap: '0.25rem', border: '1px solid var(--border-hairline)', padding: '0.2rem', background: 'var(--bg-root)' }}>
              {[
                { label: '1x', ms: 300 },
                { label: '2x', ms: 150 },
                { label: '5x', ms: 50 },
              ].map(sp => (
                <button
                  key={sp.label}
                  onClick={() => setSpeedMs(sp.ms)}
                  style={{
                    background: speedMs === sp.ms ? 'var(--text-primary)' : 'transparent',
                    color: speedMs === sp.ms ? 'var(--bg-root)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.25rem 0.55rem',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
            <span>PROCESSED: {streamIndex} / {totalMatches} ({progressPct}%)</span>
            <span>FAST-PATH: {fastPathCount} | AGENTIC: {agenticCount} | EXCEPTIONS: {exceptionCount}</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'var(--bg-root)', border: '1px solid var(--border-hairline)' }}>
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'var(--text-primary)',
                transition: 'width 0.15s linear',
              }}
            />
          </div>
        </div>
      </div>

      <div className="terminal-panel" style={{ padding: '0', overflowX: 'auto' }}>
        <table className="terminal-table">
          <thead>
            <tr>
              <th>Seq #</th>
              <th>Handler</th>
              <th>Status Category</th>
              <th>Bank Ref ID</th>
              <th style={{ textAlign: 'right' }}>Reconciled Amount</th>
              <th>Reasoning Log Output</th>
            </tr>
          </thead>
          <tbody>
            {visibleMatches.map((m, idx) => (
              <tr
                key={m.id}
                className="animate-fade-in"
              >
                <td className="font-mono" style={{ color: 'var(--text-muted)' }}>
                  #{(idx + 1).toString().padStart(2, '0')}
                </td>
                <td>
                  {m.matchType === 'RULE_BASED' && (
                    <span className="badge badge-amber">FAST-PATH</span>
                  )}
                  {m.matchType === 'AGENTIC_AI' && (
                    <span className="badge badge-amber">AGENTIC</span>
                  )}
                  {m.matchType === 'EXCEPTION' && (
                    <span className="badge badge-red">EXCEPTION</span>
                  )}
                  {m.matchType === 'HUMAN_REVIEW' && (
                    <span className="badge badge-amber">HUMAN</span>
                  )}
                </td>
                <td style={{ color: 'var(--text-primary)', fontSize: '0.7rem' }}>
                  {m.status}
                </td>
                <td className="font-mono" style={{ color: 'var(--text-primary)' }}>
                  {m.bankRecordId || 'N/A'}
                </td>
                <td className="font-mono" style={{ textAlign: 'right' }}>
                  ₹{m.reconciledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {m.reasoningTrace[0] || 'Processed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live System Log Ticker */}
      <div style={{ position: 'fixed', bottom: 0, left: '260px', right: 0, background: '#000', borderTop: '1px solid var(--border-hairline)', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 100 }}>
        <span className="badge badge-amber pulse-indicator" style={{ border: 'none' }}>LIVE_SYS_LOG</span>
        <div className="font-mono data-flicker" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
          {visibleMatches.length > 0 
            ? `> [${new Date().toISOString().split('T')[1].slice(0,8)}] ${visibleMatches[visibleMatches.length - 1].reasoningTrace.join(' | ')}`
            : '> AWAITING_STREAM_INITIALIZATION...'}
        </div>
      </div>
    </div>
  );
};
