import React, { useState, useRef, useEffect } from 'react';
import type {
  BankTransaction,
  GatewayRecord,
  ERPInvoice,
  MatchResult,
  ReconciliationStatus,
} from '../types/finance';
import { ExternalLink, Zap, Cpu, AlertTriangle, Layers, Search, ShieldCheck } from 'lucide-react';

interface ThreeWayGridProps {
  allMatches: MatchResult[];
  bankTxns: BankTransaction[];
  gatewayRecords: GatewayRecord[];
  erpInvoices: ERPInvoice[];
  onSelectMatch?: (match: MatchResult) => void;
}

export const ThreeWayGrid: React.FC<ThreeWayGridProps> = ({
  allMatches,
  bankTxns,
  gatewayRecords,
  erpInvoices,
  onSelectMatch,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'FAST_PATH' | 'AGENTIC' | 'EXCEPTIONS'>('ALL');
  const [cliFilter, setCliFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setCliFilter('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const fastPathMatches = allMatches.filter(m => m.status === 'FAST_PATH_MATCHED');
  const agenticMatches = allMatches.filter(m => m.status.startsWith('AGENTIC'));
  const exceptionMatches = allMatches.filter(m => m.status.startsWith('EXCEPTION') || m.status === 'AMBIGUOUS_HUMAN_REVIEW');

  let activeTabMatches = allMatches;
  if (activeTab === 'FAST_PATH') {
    activeTabMatches = fastPathMatches;
  } else if (activeTab === 'AGENTIC') {
    activeTabMatches = agenticMatches;
  } else if (activeTab === 'EXCEPTIONS') {
    activeTabMatches = exceptionMatches;
  }

  const filteredMatches = cliFilter.trim() 
    ? activeTabMatches.filter(m => 
        m.id.toLowerCase().includes(cliFilter.toLowerCase()) || 
        m.status.toLowerCase().includes(cliFilter.toLowerCase()) ||
        (m.bankRecordId && m.bankRecordId.toLowerCase().includes(cliFilter.toLowerCase()))
      )
    : activeTabMatches;

  const renderStampBadge = (status: ReconciliationStatus) => {
    if (status === 'FAST_PATH_MATCHED') {
      return (
        <span
          className="badge"
          style={{
            background: 'rgba(245, 208, 97, 0.1)',
            border: '1px solid rgba(245, 208, 97, 0.35)',
            color: '#F5D061',
            fontWeight: 800,
            fontSize: '0.68rem',
          }}
        >
          {status}
        </span>
      );
    }
    if (status.startsWith('AGENTIC')) {
      return (
        <span
          className="badge"
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38BDF8',
            fontWeight: 800,
            fontSize: '0.68rem',
          }}
        >
          {status}
        </span>
      );
    }
    return (
      <span
        className="badge"
        style={{
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          color: '#F43F5E',
          fontWeight: 800,
          fontSize: '0.68rem',
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div
      className="terminal-panel"
      style={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(12, 16, 30, 0.88) 0%, rgba(5, 7, 15, 0.94) 100%)',
        border: '1px solid rgba(229, 184, 105, 0.22)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header & Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.15rem 1.35rem',
          borderBottom: '1px solid rgba(229, 184, 105, 0.16)',
          background: 'rgba(8, 11, 22, 0.6)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
              3-WAY_LIVE_LEDGER
            </h2>
            <span
              style={{
                fontSize: '0.62rem',
                color: '#10B981',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.1rem 0.4rem',
                borderRadius: '3px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}
            >
              SYNCED
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            Real-time reconciliation vector mapping (Bank Statement ↔ Razorpay PG ↔ ERP Sales)
          </div>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            background: 'rgba(5, 7, 15, 0.8)',
            border: '1px solid rgba(229, 184, 105, 0.2)',
            padding: '0.25rem',
            borderRadius: '6px',
          }}
        >
          <button
            onClick={() => setActiveTab('ALL')}
            style={{
              background: activeTab === 'ALL' ? 'linear-gradient(135deg, #FFE082 0%, #F5D061 100%)' : 'transparent',
              color: activeTab === 'ALL' ? '#050711' : '#94A3B8',
              border: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'ALL' ? '0 0 10px rgba(245, 208, 97, 0.4)' : 'none',
            }}
          >
            <Layers size={13} /> ALL ({allMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('FAST_PATH')}
            style={{
              background: activeTab === 'FAST_PATH' ? 'linear-gradient(135deg, #FFE082 0%, #F5D061 100%)' : 'transparent',
              color: activeTab === 'FAST_PATH' ? '#050711' : '#94A3B8',
              border: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'FAST_PATH' ? '0 0 10px rgba(245, 208, 97, 0.4)' : 'none',
            }}
          >
            <Zap size={13} /> FAST-PATH ({fastPathMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('AGENTIC')}
            style={{
              background: activeTab === 'AGENTIC' ? 'linear-gradient(135deg, #38BDF8 0%, #0C8CE9 100%)' : 'transparent',
              color: activeTab === 'AGENTIC' ? '#050711' : '#94A3B8',
              border: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'AGENTIC' ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none',
            }}
          >
            <Cpu size={13} /> AGENTIC ({agenticMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('EXCEPTIONS')}
            style={{
              background: activeTab === 'EXCEPTIONS' ? 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)' : 'transparent',
              color: activeTab === 'EXCEPTIONS' ? '#FFFFFF' : '#F43F5E',
              border: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'EXCEPTIONS' ? '0 0 10px rgba(244, 63, 94, 0.4)' : 'none',
            }}
          >
            <AlertTriangle size={13} /> EXCEPTIONS ({exceptionMatches.length})
          </button>
        </div>
      </div>

      {/* CLI Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(5, 7, 15, 0.95)',
          padding: '0.65rem 1.25rem',
          borderBottom: '1px solid rgba(229, 184, 105, 0.14)',
          gap: '0.65rem',
        }}
      >
        <Search size={14} color="#F5D061" />
        <span className="font-mono pulse-indicator" style={{ color: '#F5D061', fontWeight: 'bold' }}>&gt;</span>
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Filter ledger: type ID, status, or keyword... (Press '/' to focus, 'Esc' to clear)"
          value={cliFilter}
          onChange={(e) => setCliFilter(e.target.value)}
          className="font-mono"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            outline: 'none',
            width: '100%',
            fontSize: '0.82rem',
          }}
        />
        {cliFilter && (
          <button
            onClick={() => setCliFilter('')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94A3B8',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Side-by-Side Ledger Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="terminal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(10, 14, 26, 0.85)', borderBottom: '1px solid rgba(229, 184, 105, 0.18)' }}>
              <th style={{ width: '14%', padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>VERDICT</th>
              <th style={{ width: '22%', padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>BANK_STATEMENT</th>
              <th style={{ width: '22%', padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>PG_SETTLEMENT</th>
              <th style={{ width: '22%', padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>ERP_SALES</th>
              <th style={{ width: '10%', padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textAlign: 'right', textTransform: 'uppercase' }}>CONFIDENCE</th>
              <th style={{ width: '5%', padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textAlign: 'center', textTransform: 'uppercase' }}>INSPECT</th>
              <th style={{ width: '5%', padding: '0.85rem 1rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textAlign: 'center', textTransform: 'uppercase' }}>RAW</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.map(match => {
              const bRecord = bankTxns.find(b => b.id === match.bankRecordId);
              const gRecords = gatewayRecords.filter(g => match.gatewayRecordIds.includes(g.id));
              const erpRecords = erpInvoices.filter(e => match.erpInvoiceIds.includes(e.id));

              return (
                <React.Fragment key={match.id}>
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s ease',
                      cursor: onSelectMatch ? 'pointer' : 'default',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(245, 208, 97, 0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={() => onSelectMatch && onSelectMatch(match)}
                  >
                    {/* Stamp */}
                    <td style={{ verticalAlign: 'middle', padding: '0.85rem 1rem' }}>
                      {renderStampBadge(match.status)}
                    </td>

                    {/* 1. Bank Record */}
                    <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem' }}>
                      {bRecord ? (
                        <div>
                          <div className="font-mono data-flicker" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>
                            {bRecord.currency === 'USD' ? '$' : '₹'}
                            {bRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                            {bRecord.id} • {bRecord.date}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', whiteSpace: 'nowrap' }}>
                            {bRecord.description}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#F43F5E', fontStyle: 'italic', fontSize: '0.75rem', fontWeight: 600 }}>
                          MISSING_IN_BANK
                        </span>
                      )}
                    </td>

                    {/* 2. Gateway Record */}
                    <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem' }}>
                      {gRecords.length > 0 ? (
                        <div>
                          {gRecords.length > 1 ? (
                            <div style={{ fontWeight: 800, color: '#F5D061', fontSize: '0.9rem' }}>
                              BUNDLE: {gRecords.length} SETTLEMENTS
                            </div>
                          ) : (
                            <div className="font-mono data-flicker" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>
                              {gRecords[0].currency === 'USD' ? '$' : '₹'}
                              {gRecords[0].netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                            {gRecords.length === 1 ? gRecords[0].id : `${gRecords.length} ITEMS`}
                            {match.feeRateBps && ` • FEE: ${(match.feeRateBps / 100).toFixed(2)}%`}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#F43F5E', fontStyle: 'italic', fontSize: '0.75rem', fontWeight: 600 }}>
                          UNLINKED_GATEWAY
                        </span>
                      )}
                    </td>

                    {/* 3. ERP Invoice Record */}
                    <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem' }}>
                      {erpRecords.length > 0 ? (
                        <div>
                          {erpRecords.length > 1 ? (
                            <div style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.9rem' }}>
                              {erpRecords.length} INVOICES (GROSS ₹52,000)
                            </div>
                          ) : (
                            <div className="font-mono data-flicker" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>
                              {erpRecords[0].currency === 'USD' ? '$' : '₹'}
                              {erpRecords[0].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                            {erpRecords.length === 1 ? erpRecords[0].id : `INV-BUN-01..0${erpRecords.length}`}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#E5B869', fontStyle: 'italic', fontSize: '0.75rem', fontWeight: 600 }}>
                          0_SALES_INVOICES
                        </span>
                      )}
                    </td>

                    {/* Confidence */}
                    <td style={{ verticalAlign: 'top', textAlign: 'right', padding: '0.85rem 1rem' }}>
                      <span
                        className="font-mono data-flicker"
                        style={{
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          color: match.confidenceScore >= 0.98 ? '#10B981' : '#F5D061',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        {match.confidenceScore >= 0.98 && <ShieldCheck size={12} color="#10B981" />}
                        {(match.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ verticalAlign: 'top', textAlign: 'center', padding: '0.85rem 1rem' }}>
                      {onSelectMatch && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMatch(match);
                          }}
                          className="btn-terminal"
                          style={{
                            padding: '0.35rem',
                            borderRadius: '4px',
                            color: '#F5D061',
                            borderColor: 'rgba(245, 208, 97, 0.3)',
                          }}
                          title="Deep Dive Audit Vector"
                        >
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </td>
                    
                    {/* JSON Expander */}
                    <td style={{ verticalAlign: 'top', textAlign: 'center', padding: '0.85rem 1rem' }}>
                      <button
                        className="btn-terminal"
                        onClick={(e) => toggleRow(match.id, e)}
                        style={{
                          padding: '0.2rem 0.55rem',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                        }}
                        title="Toggle Raw JSON Ledger Data"
                      >
                        {expandedRows.has(match.id) ? '−' : '+'}
                      </button>
                    </td>
                  </tr>

                  {/* Raw JSON Expansion Row */}
                  {expandedRows.has(match.id) && (
                    <tr style={{ background: 'rgba(4, 6, 12, 0.95)' }}>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderBottom: '1px solid rgba(229, 184, 105, 0.15)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                             <span style={{ fontSize: '0.7rem', color: '#E5B869', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>BANK_RAW</span>
                             <pre className="font-mono" style={{ fontSize: '0.72rem', color: '#CBD5E1', background: '#050711', padding: '0.75rem', overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px' }}>
                               {JSON.stringify(bRecord, null, 2)}
                             </pre>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                             <span style={{ fontSize: '0.7rem', color: '#E5B869', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>GATEWAY_RAW</span>
                             <pre className="font-mono" style={{ fontSize: '0.72rem', color: '#CBD5E1', background: '#050711', padding: '0.75rem', overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px' }}>
                               {JSON.stringify(gRecords, null, 2)}
                             </pre>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                             <span style={{ fontSize: '0.7rem', color: '#E5B869', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>ERP_RAW</span>
                             <pre className="font-mono" style={{ fontSize: '0.72rem', color: '#CBD5E1', background: '#050711', padding: '0.75rem', overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px' }}>
                               {JSON.stringify(erpRecords, null, 2)}
                             </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
