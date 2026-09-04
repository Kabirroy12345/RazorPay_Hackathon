import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Activity, 
  Download, 
  ExternalLink, 
  X, 
  Copy, 
  Check, 
  Wrench, 
  ShieldAlert, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { FullReconciliationOutput } from '../../engine/reconciler';
import type { MatchResult } from '../../types/finance';

interface StreamingReconcilerViewProps {
  output: FullReconciliationOutput;
}

export const StreamingReconcilerView: React.FC<StreamingReconcilerViewProps> = ({ output }) => {
  const [streamIndex, setStreamIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMs, setSpeedMs] = useState(200);
  const [filterType, setFilterType] = useState<'ALL' | 'FAST_PATH' | 'AGENTIC' | 'EXCEPTION'>('ALL');
  const [inspectingMatch, setInspectingMatch] = useState<MatchResult | null>(null);
  const [inspectTab, setInspectTab] = useState<'COMPARISON' | 'REASONING' | 'RAW_JSON' | 'REMEDIATION'>('COMPARISON');
  const [copiedModalJson, setCopiedModalJson] = useState(false);
  const [remediationExecuted, setRemediationExecuted] = useState(false);

  const totalMatches = output.allMatches.length;

  useEffect(() => {
    if (!isPlaying) return;
    if (streamIndex >= totalMatches) return;

    const timer = setTimeout(() => {
      setStreamIndex(prev => prev + 1);
    }, speedMs);

    return () => clearTimeout(timer);
  }, [streamIndex, isPlaying, speedMs, totalMatches]);

  // Handle ESC to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inspectingMatch) {
        setInspectingMatch(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectingMatch]);

  const visibleMatches = output.allMatches.slice(0, streamIndex);
  const progressPct = totalMatches > 0 ? Math.round((streamIndex / totalMatches) * 100) : 0;

  const fastPathCount = visibleMatches.filter(m => m.status === 'FAST_PATH_MATCHED').length;
  const agenticCount = visibleMatches.filter(m => m.status.startsWith('AGENTIC')).length;
  const exceptionCount = visibleMatches.filter(m => m.status.startsWith('EXCEPTION')).length;

  const filteredVisibleMatches = visibleMatches.filter(m => {
    if (filterType === 'FAST_PATH') return m.status === 'FAST_PATH_MATCHED';
    if (filterType === 'AGENTIC') return m.status.startsWith('AGENTIC');
    if (filterType === 'EXCEPTION') return m.status.startsWith('EXCEPTION');
    return true;
  });

  const handleOpenInspect = (match: MatchResult) => {
    setIsPlaying(false);
    setInspectingMatch(match);
    setInspectTab('COMPARISON');
    setRemediationExecuted(false);
  };

  const handleExportCSV = () => {
    const headers = ['Seq', 'MatchID', 'Status', 'MatchType', 'BankRef', 'ReconciledAmountINR', 'DiscrepancyAmountINR', 'Confidence'];
    const rows = visibleMatches.map((m, idx) => [
      idx + 1,
      m.id,
      m.status,
      m.matchType,
      m.bankRecordId || 'MISSING_IN_BANK',
      m.reconciledAmount,
      m.discrepancyAmount,
      (m.confidenceScore * 100).toFixed(1) + '%'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `OmniSettle_Streaming_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Streaming Header */}
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
                  background: 'rgba(12, 140, 233, 0.1)',
                  border: '1px solid rgba(12, 140, 233, 0.35)',
                  color: '#38BDF8',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                <Activity size={11} style={{ marginRight: '0.25rem' }} />
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

            <button
              onClick={handleExportCSV}
              className="btn-terminal"
              title="Download Stream Log as CSV"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38BDF8' }}
            >
              <Download size={14} /> EXPORT CSV
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

        {/* Progress Tracker */}
        <div style={{ marginTop: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.45rem', fontFamily: 'var(--font-mono)', flexWrap: 'wrap', gap: '0.5rem' }}>
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

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `ALL STREAMED (${visibleMatches.length})` },
            { id: 'FAST_PATH', label: `FAST-PATH (${fastPathCount})` },
            { id: 'AGENTIC', label: `AGENTIC AI (${agenticCount})` },
            { id: 'EXCEPTION', label: `EXCEPTIONS (${exceptionCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              style={{
                background: filterType === tab.id ? 'rgba(245, 208, 97, 0.18)' : 'rgba(5, 7, 15, 0.8)',
                border: filterType === tab.id ? '1px solid #F5D061' : '1px solid rgba(255, 255, 255, 0.1)',
                color: filterType === tab.id ? '#F5D061' : '#94A3B8',
                padding: '0.3rem 0.75rem',
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

      {/* Ledger Table */}
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
              <th style={{ padding: '0.85rem 1rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textAlign: 'center', textTransform: 'uppercase' }}>Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisibleMatches.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  AWAITING STREAMING RECORDS MATCHING CRITERIA...
                </td>
              </tr>
            ) : (
              filteredVisibleMatches.map((m, idx) => (
                <tr
                  key={m.id}
                  className="animate-fade-in"
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.15s ease',
                    background: idx === filteredVisibleMatches.length - 1 ? 'rgba(245, 208, 97, 0.08)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleOpenInspect(m)}
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
                  <td style={{ textAlign: 'center', padding: '0.8rem 1rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenInspect(m);
                      }}
                      title="Inspect Reconciled Vector"
                      style={{
                        background: 'rgba(12, 140, 233, 0.15)',
                        border: '1px solid rgba(12, 140, 233, 0.45)',
                        color: '#38BDF8',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                      }}
                    >
                      <ExternalLink size={12} /> INSPECT
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Live System Log Ticker */}
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

      {/* Vector Audit Inspector Modal */}
      {inspectingMatch && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 20, 0.88)',
            backdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setInspectingMatch(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '920px',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(180deg, rgba(14, 20, 38, 0.98) 0%, rgba(5, 7, 15, 0.99) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '12px',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(56, 189, 248, 0.15)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.6rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(5, 7, 15, 0.6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: inspectingMatch.status.startsWith('EXCEPTION') ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    border: `1px solid ${inspectingMatch.status.startsWith('EXCEPTION') ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: inspectingMatch.status.startsWith('EXCEPTION') ? '#F43F5E' : '#38BDF8',
                  }}
                >
                  {inspectingMatch.status.startsWith('EXCEPTION') ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                      AUDIT_VECTOR: {inspectingMatch.id}
                    </h3>
                    <span
                      className="badge"
                      style={{
                        background: inspectingMatch.status.startsWith('EXCEPTION') ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        borderColor: inspectingMatch.status.startsWith('EXCEPTION') ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                        color: inspectingMatch.status.startsWith('EXCEPTION') ? '#F43F5E' : '#10B981',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                      }}
                    >
                      {inspectingMatch.status}
                    </span>
                  </div>
                  <p style={{ color: '#94A3B8', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
                    HANDLER: <strong>{inspectingMatch.matchType}</strong> • CONFIDENCE: <strong>{(inspectingMatch.confidenceScore * 100).toFixed(1)}%</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectingMatch(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94A3B8',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(5, 7, 15, 0.4)' }}>
              {[
                { id: 'COMPARISON', label: '3-WAY COMPARISON' },
                { id: 'REASONING', label: 'AI REASONING TRACE' },
                { id: 'RAW_JSON', label: 'RAW JSON LEDGER' },
                { id: 'REMEDIATION', label: 'REMEDIATION ACTION' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setInspectTab(tab.id as any)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: inspectTab === tab.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    border: 'none',
                    borderBottom: inspectTab === tab.id ? '2px solid #38BDF8' : '2px solid transparent',
                    color: inspectTab === tab.id ? '#FFFFFF' : '#94A3B8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: inspectTab === tab.id ? 800 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {inspectTab === 'COMPARISON' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {/* Bank Card */}
                    <div style={{ background: 'rgba(5, 7, 15, 0.8)', padding: '1.15rem', border: '1px solid rgba(245, 208, 97, 0.25)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#F5D061', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>1. BANK SETTLEMENT FEED</span>
                      <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem' }}>
                        ₹{inspectingMatch.reconciledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-mono)', marginTop: '0.3rem' }}>
                        REF: {inspectingMatch.bankRecordId || 'ABSENT_IN_BANK'}
                      </div>
                    </div>

                    {/* Gateway Card */}
                    <div style={{ background: 'rgba(5, 7, 15, 0.8)', padding: '1.15rem', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>2. GATEWAY RECORD</span>
                      <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem' }}>
                        {inspectingMatch.gatewayRecordIds.length} Linked
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-mono)', marginTop: '0.3rem' }}>
                        IDS: {inspectingMatch.gatewayRecordIds.join(', ') || 'NONE'}
                      </div>
                    </div>

                    {/* ERP Card */}
                    <div style={{ background: 'rgba(5, 7, 15, 0.8)', padding: '1.15rem', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>3. ERP INVOICES</span>
                      <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem' }}>
                        {inspectingMatch.erpInvoiceIds.length} Invoices
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-mono)', marginTop: '0.3rem' }}>
                        IDS: {inspectingMatch.erpInvoiceIds.join(', ') || 'NONE'}
                      </div>
                    </div>
                  </div>

                  {/* Variance Banner */}
                  <div
                    style={{
                      background: inspectingMatch.discrepancyAmount > 0.01 ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      border: `1px solid ${inspectingMatch.discrepancyAmount > 0.01 ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                      borderRadius: '8px',
                      padding: '0.9rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Reconciliation Delta / Discrepancy:
                    </span>
                    <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 900, color: inspectingMatch.discrepancyAmount > 0.01 ? '#F43F5E' : '#10B981' }}>
                      ₹{inspectingMatch.discrepancyAmount.toFixed(2)} INR {inspectingMatch.discrepancyAmount === 0 ? '(Exact Match)' : ''}
                    </span>
                  </div>
                </div>
              )}

              {inspectTab === 'REASONING' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {inspectingMatch.reasoningTrace.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                        background: 'rgba(5, 7, 15, 0.75)',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>STEP {idx + 1}</span>
                      <span className="font-mono" style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.5' }}>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {inspectTab === 'RAW_JSON' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(inspectingMatch, null, 2));
                        setCopiedModalJson(true);
                        setTimeout(() => setCopiedModalJson(false), 2000);
                      }}
                      className="btn-terminal primary"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                    >
                      {copiedModalJson ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                      {copiedModalJson ? 'COPIED!' : 'COPY VECTOR JSON'}
                    </button>
                  </div>
                  <pre
                    style={{
                      background: '#03050C',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      color: '#38BDF8',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      overflowX: 'auto',
                    }}
                  >
                    {JSON.stringify(inspectingMatch, null, 2)}
                  </pre>
                </div>
              )}

              {inspectTab === 'REMEDIATION' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ background: 'rgba(5, 7, 15, 0.85)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                      {inspectingMatch.remediationStub?.title || 'Operational Vector Resolution'}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem' }}>
                      {inspectingMatch.remediationStub?.targetCategory || 'Standard reconciliation vector matched against ground truth ledger.'}
                    </p>

                    <button
                      onClick={() => setRemediationExecuted(true)}
                      disabled={remediationExecuted}
                      className={remediationExecuted ? "btn-terminal" : "btn-terminal primary"}
                      style={{ padding: '0.65rem 1.25rem', fontSize: '0.82rem', fontWeight: 800 }}
                    >
                      {remediationExecuted ? (
                        <>
                          <CheckCircle2 size={15} color="#10B981" /> REMEDIATION ARTIFACT VERIFIED & EXECUTED
                        </>
                      ) : (
                        <>
                          <Wrench size={15} /> {inspectingMatch.remediationStub?.actionLabel || 'MARK VERIFIED & CLOSE VECTOR'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
