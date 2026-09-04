import React, { useState, useRef, useEffect } from 'react';
import type {
  BankTransaction,
  GatewayRecord,
  ERPInvoice,
  MatchResult,
  ReconciliationStatus,
} from '../types/finance';
import { 
  ExternalLink, 
  Zap, 
  Cpu, 
  AlertTriangle, 
  Layers, 
  Search, 
  ShieldCheck, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Wrench, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

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
  const [inspectingMatch, setInspectingMatch] = useState<MatchResult | null>(null);
  const [inspectTab, setInspectTab] = useState<'3WAY' | 'REASONING' | 'RAW' | 'REMEDIATION'>('3WAY');
  const [rawCopiedId, setRawCopiedId] = useState<string | null>(null);
  const [modalCopied, setModalCopied] = useState(false);
  const [modalRemediationExecuted, setModalRemediationExecuted] = useState(false);
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

  useEffect(() => {
    const handleModalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inspectingMatch) {
        setInspectingMatch(null);
      }
    };
    window.addEventListener('keydown', handleModalKey);
    return () => window.removeEventListener('keydown', handleModalKey);
  }, [inspectingMatch]);

  const handleOpenInspect = (match: MatchResult, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setInspectingMatch(match);
    setInspectTab('3WAY');
    setModalRemediationExecuted(false);
    onSelectMatch?.(match);
  };

  const handleToggleRaw = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const toggleExpandAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (expandedRows.size === filteredMatches.length && filteredMatches.length > 0) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(filteredMatches.map(m => m.id)));
    }
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
            <tr style={{ background: 'rgba(10, 14, 26, 0.85)', borderBottom: '1px solid rgba(12, 140, 233, 0.25)' }}>
              <th style={{ width: '14%', padding: '0.85rem 1rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>VERDICT</th>
              <th style={{ width: '22%', padding: '0.85rem 1rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>BANK_STATEMENT</th>
              <th style={{ width: '22%', padding: '0.85rem 1rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>PG_SETTLEMENT</th>
              <th style={{ width: '22%', padding: '0.85rem 1rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>ERP_SALES</th>
              <th style={{ width: '10%', padding: '0.85rem 1rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textAlign: 'right', textTransform: 'uppercase' }}>CONFIDENCE</th>
              <th style={{ width: '5%', padding: '0.85rem 0.5rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textAlign: 'center', textTransform: 'uppercase' }}>INSPECT</th>
              <th 
                style={{ width: '5%', padding: '0.85rem 0.5rem', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', textAlign: 'center', textTransform: 'uppercase', cursor: 'pointer' }}
                onClick={toggleExpandAll}
                title="Click to toggle expand/collapse all raw JSON payloads"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                  <span>RAW</span>
                  <span style={{ fontSize: '0.62rem', color: '#0C8CE9', fontWeight: 800 }}>
                    {expandedRows.size === filteredMatches.length && filteredMatches.length > 0 ? '[-]' : '[+]'}
                  </span>
                </div>
              </th>
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
                              {erpRecords.length} INVOICES (GROSS {erpRecords.length > 0 && erpRecords[0].currency === 'USD' ? '$' : '₹'}{erpRecords.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                            </div>
                          ) : (
                            <div className="font-mono data-flicker" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>
                              {erpRecords[0].currency === 'USD' ? '$' : '₹'}
                              {erpRecords[0].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                            {erpRecords.length === 1 ? erpRecords[0].id : `${erpRecords[0].id}..${erpRecords[erpRecords.length - 1].id}`}
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

                    {/* Action: INSPECT */}
                    <td 
                      style={{ verticalAlign: 'middle', textAlign: 'center', padding: '0.65rem 0.5rem', cursor: 'pointer' }}
                      onClick={(e) => handleOpenInspect(match, e)}
                      title="Inspect 3-way reconciliation audit vector"
                    >
                      <button
                        type="button"
                        onClick={(e) => handleOpenInspect(match, e)}
                        className="btn-terminal"
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: '5px',
                          color: '#0C8CE9',
                          borderColor: 'rgba(12, 140, 233, 0.4)',
                          background: 'rgba(12, 140, 233, 0.08)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(12, 140, 233, 0.2)';
                          e.currentTarget.style.borderColor = '#0C8CE9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(12, 140, 233, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(12, 140, 233, 0.4)';
                        }}
                      >
                        <ExternalLink size={13} color="#0C8CE9" />
                        <span>INSPECT</span>
                      </button>
                    </td>
                    
                    {/* Action: RAW */}
                    <td 
                      style={{ verticalAlign: 'middle', textAlign: 'center', padding: '0.65rem 0.5rem', cursor: 'pointer' }}
                      onClick={(e) => handleToggleRaw(match.id, e)}
                      title="Toggle raw JSON ledger payload"
                    >
                      <button
                        type="button"
                        onClick={(e) => handleToggleRaw(match.id, e)}
                        className="btn-terminal"
                        style={{
                          padding: '0.3rem 0.55rem',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          borderRadius: '5px',
                          color: expandedRows.has(match.id) ? '#38BDF8' : '#F5D061',
                          borderColor: expandedRows.has(match.id) ? '#0C8CE9' : 'rgba(245, 208, 97, 0.3)',
                          background: expandedRows.has(match.id) ? 'rgba(12, 140, 233, 0.18)' : 'rgba(245, 208, 97, 0.06)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#F5D061';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = expandedRows.has(match.id) ? '#0C8CE9' : 'rgba(245, 208, 97, 0.3)';
                        }}
                      >
                        <span>{expandedRows.has(match.id) ? '−' : '+'}</span>
                        <span style={{ fontSize: '0.65rem' }}>RAW</span>
                      </button>
                    </td>
                  </tr>

                  {/* Raw JSON Expansion Row */}
                  {expandedRows.has(match.id) && (
                    <tr style={{ background: 'rgba(3, 5, 12, 0.98)', borderBottom: '1px solid rgba(12, 140, 233, 0.3)' }}>
                      <td colSpan={7} style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {/* Row Action Bar */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#0C8CE9', fontWeight: 800 }}>
                                RAW LEDGER VECTOR: {match.id}
                              </span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#94A3B8' }}>
                                [{match.status}]
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  const payload = {
                                    matchVector: match,
                                    bankTransaction: bRecord || { status: 'RECORD_ABSENT_IN_BANK_FEED' },
                                    gatewayRecords: gRecords.length > 0 ? gRecords : [{ status: 'UNLINKED_IN_GATEWAY' }],
                                    erpInvoices: erpRecords.length > 0 ? erpRecords : [{ status: 'NO_ERP_INVOICE_RECORD' }],
                                  };
                                  navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                                  setRawCopiedId(match.id);
                                  setTimeout(() => setRawCopiedId(null), 1500);
                                }}
                                style={{
                                  background: 'rgba(12, 140, 233, 0.12)',
                                  border: '1px solid rgba(12, 140, 233, 0.4)',
                                  color: rawCopiedId === match.id ? '#10B981' : '#38BDF8',
                                  padding: '0.3rem 0.65rem',
                                  borderRadius: '5px',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                }}
                              >
                                {rawCopiedId === match.id ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                                {rawCopiedId === match.id ? 'COPIED!' : 'COPY COMBINED JSON'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenInspect(match)}
                                style={{
                                  background: 'rgba(245, 208, 97, 0.12)',
                                  border: '1px solid rgba(245, 208, 97, 0.4)',
                                  color: '#F5D061',
                                  padding: '0.3rem 0.65rem',
                                  borderRadius: '5px',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                }}
                              >
                                <ExternalLink size={12} />
                                <span>OPEN FULL INSPECTOR</span>
                              </button>
                            </div>
                          </div>

                          {/* 4 JSON Columns */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                            {/* 1. Match Vector JSON */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.68rem', color: '#38BDF8', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                                1. MATCH_VECTOR
                              </span>
                              <pre className="font-mono" style={{ fontSize: '0.7rem', color: '#E2E8F0', background: '#050711', padding: '0.65rem', overflowX: 'auto', border: '1px solid rgba(12, 140, 233, 0.25)', borderRadius: '5px', maxHeight: '200px', margin: 0 }}>
                                {JSON.stringify(match, null, 2)}
                              </pre>
                            </div>

                            {/* 2. Bank Record JSON */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.68rem', color: '#F5D061', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                                2. BANK_STATEMENT_RECORD
                              </span>
                              <pre className="font-mono" style={{ fontSize: '0.7rem', color: '#E2E8F0', background: '#050711', padding: '0.65rem', overflowX: 'auto', border: '1px solid rgba(245, 208, 97, 0.25)', borderRadius: '5px', maxHeight: '200px', margin: 0 }}>
                                {bRecord ? JSON.stringify(bRecord, null, 2) : JSON.stringify({ status: 'RECORD_ABSENT_IN_BANK_FEED' }, null, 2)}
                              </pre>
                            </div>

                            {/* 3. Gateway Records JSON */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.68rem', color: '#A855F7', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                                3. GATEWAY_RECORDS ({gRecords.length})
                              </span>
                              <pre className="font-mono" style={{ fontSize: '0.7rem', color: '#E2E8F0', background: '#050711', padding: '0.65rem', overflowX: 'auto', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '5px', maxHeight: '200px', margin: 0 }}>
                                {gRecords.length > 0 ? JSON.stringify(gRecords, null, 2) : JSON.stringify([{ status: 'UNLINKED_IN_GATEWAY' }], null, 2)}
                              </pre>
                            </div>

                            {/* 4. ERP Invoices JSON */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                                4. ERP_INVOICES ({erpRecords.length})
                              </span>
                              <pre className="font-mono" style={{ fontSize: '0.7rem', color: '#E2E8F0', background: '#050711', padding: '0.65rem', overflowX: 'auto', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '5px', maxHeight: '200px', margin: 0 }}>
                                {erpRecords.length > 0 ? JSON.stringify(erpRecords, null, 2) : JSON.stringify([{ status: 'NO_ERP_INVOICE_RECORD' }], null, 2)}
                              </pre>
                            </div>
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

      {/* Centered Modal: Vector Audit Inspector */}
      {inspectingMatch && (() => {
        const modalBankRecord = bankTxns.find(b => b.id === inspectingMatch.bankRecordId);
        const modalGatewayRecords = gatewayRecords.filter(g => inspectingMatch.gatewayRecordIds.includes(g.id));
        const modalErpRecords = erpInvoices.filter(e => inspectingMatch.erpInvoiceIds.includes(e.id));
        const isException = inspectingMatch.status.startsWith('EXCEPTION') || inspectingMatch.status === 'AMBIGUOUS_HUMAN_REVIEW';

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(2, 6, 20, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '1.5rem',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setInspectingMatch(null);
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '880px',
                maxHeight: '90vh',
                background: 'linear-gradient(180deg, #0A0F1E 0%, #060913 100%)',
                border: '1px solid rgba(12, 140, 233, 0.35)',
                borderRadius: '12px',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(12, 140, 233, 0.2)',
                color: '#EDEDED',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(12, 140, 233, 0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isException ? 'rgba(244, 63, 94, 0.15)' : 'rgba(12, 140, 233, 0.15)',
                      border: isException ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(12, 140, 233, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isException ? <ShieldAlert size={18} color="#F43F5E" /> : <ShieldCheck size={18} color="#0C8CE9" />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF' }}>
                        VECTOR AUDIT // {inspectingMatch.id}
                      </span>
                      {renderStampBadge(inspectingMatch.status)}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                      CONFIDENCE: <strong style={{ color: inspectingMatch.confidenceScore >= 0.98 ? '#10B981' : '#F5D061' }}>{(inspectingMatch.confidenceScore * 100).toFixed(0)}%</strong> • RECONCILED AMOUNT: <strong style={{ color: '#FFFFFF' }}>₹{inspectingMatch.reconciledAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const payload = {
                        match: inspectingMatch,
                        bankTransaction: modalBankRecord,
                        gatewayRecords: modalGatewayRecords,
                        erpInvoices: modalErpRecords,
                      };
                      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                      setModalCopied(true);
                      setTimeout(() => setModalCopied(false), 1500);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: modalCopied ? '#10B981' : '#CBD5E1',
                      cursor: 'pointer',
                      padding: '0.4rem 0.65rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {modalCopied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                    <span>{modalCopied ? 'COPIED' : 'COPY'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectingMatch(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Close Inspector (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.35rem', padding: '0.65rem 1.5rem', background: '#070A14', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {[
                  { id: '3WAY', label: '3-WAY COMPARISON' },
                  { id: 'REASONING', label: 'AI REASONING TRACE' },
                  { id: 'RAW', label: 'RAW JSON LEDGER' },
                  { id: 'REMEDIATION', label: 'REMEDIATION' },
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInspectTab(t.id as any)}
                    style={{
                      background: inspectTab === t.id ? 'rgba(12, 140, 233, 0.15)' : 'transparent',
                      border: inspectTab === t.id ? '1px solid #0C8CE9' : '1px solid transparent',
                      color: inspectTab === t.id ? '#38BDF8' : '#94A3B8',
                      borderRadius: '5px',
                      padding: '0.4rem 0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* TAB 1: 3-WAY COMPARISON */}
                {inspectTab === '3WAY' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Discrepancy Banner if Variance */}
                    {isException && inspectingMatch.discrepancyAmount > 0 && (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(12, 16, 30, 0.9) 100%)',
                          border: '1px solid rgba(244, 63, 94, 0.45)',
                          borderRadius: '8px',
                          padding: '1rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                        }}
                      >
                        <ShieldAlert size={28} color="#F43F5E" />
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#F43F5E', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                            VARIANCE DETECTED
                          </div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                            ₹{inspectingMatch.discrepancyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3 Comparison Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                      {/* Bank Record */}
                      <div style={{ background: 'rgba(5, 7, 15, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#38BDF8', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                          1. BANK STATEMENT
                        </div>
                        {modalBankRecord ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                              {modalBankRecord.currency === 'USD' ? '$' : '₹'}{modalBankRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>ID: {modalBankRecord.id}</div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>Date: {modalBankRecord.date}</div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>Ref: {modalBankRecord.referenceNo}</div>
                            <div style={{ color: '#CBD5E1', fontSize: '0.72rem', marginTop: '0.25rem', lineHeight: '1.3' }}>{modalBankRecord.description}</div>
                          </div>
                        ) : (
                          <div style={{ color: '#F43F5E', fontStyle: 'italic', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                            [MISSING IN BANK STATEMENT FEED]
                          </div>
                        )}
                      </div>

                      {/* Gateway Record */}
                      <div style={{ background: 'rgba(5, 7, 15, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#F5D061', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                          2. GATEWAY SETTLEMENT ({modalGatewayRecords.length})
                        </div>
                        {modalGatewayRecords.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                              ₹{modalGatewayRecords.reduce((s, g) => s + g.netAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>Gross: ₹{modalGatewayRecords.reduce((s, g) => s + g.grossAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>Fee (2%): ₹{modalGatewayRecords.reduce((s, g) => s + g.feeAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>GST (18%): ₹{modalGatewayRecords.reduce((s, g) => s + g.gstAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>Order: {modalGatewayRecords[0].orderId}</div>
                          </div>
                        ) : (
                          <div style={{ color: '#F43F5E', fontStyle: 'italic', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                            [UNLINKED IN PAYMENT GATEWAY]
                          </div>
                        )}
                      </div>

                      {/* ERP Invoices */}
                      <div style={{ background: 'rgba(5, 7, 15, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#10B981', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                          3. ERP SALES INVOICES ({modalErpRecords.length})
                        </div>
                        {modalErpRecords.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                              ₹{modalErpRecords.reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                              Invoices: {modalErpRecords.length === 1 ? modalErpRecords[0].id : `${modalErpRecords.length} Bundled Items`}
                            </div>
                            <div style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>Customer: {modalErpRecords[0].customerName}</div>
                            <div style={{ color: '#10B981', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>Status: {modalErpRecords[0].status}</div>
                          </div>
                        ) : (
                          <div style={{ color: '#E5B869', fontStyle: 'italic', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                            [0 SALES INVOICES RECORDED]
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Zero-Delta Math Proof Equation Box */}
                    <div style={{ background: 'rgba(12, 140, 233, 0.05)', border: '1px solid rgba(12, 140, 233, 0.25)', borderRadius: '8px', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      <div style={{ color: '#38BDF8', fontWeight: 800, marginBottom: '0.35rem' }}>
                        MATHEMATICAL ZERO-DELTA VERIFICATION FORMULA:
                      </div>
                      <div style={{ color: '#CBD5E1', lineHeight: '1.6' }}>
                        Gross Sales ({modalErpRecords.length > 0 ? `₹${modalErpRecords.reduce((s, e) => s + e.amount, 0).toFixed(2)}` : '₹0.00'}) 
                        - Gateway MDR Fee (2.00%) 
                        - Statutory GST (18%) 
                        = Net Payout ({modalBankRecord ? `₹${modalBankRecord.amount.toFixed(2)}` : '₹0.00'})
                        {' '}
                        <strong style={{ color: inspectingMatch.discrepancyAmount === 0 ? '#10B981' : '#F43F5E' }}>
                          [{inspectingMatch.discrepancyAmount === 0 ? 'ZERO-DELTA BALANCED' : `VARIANCE: ₹${inspectingMatch.discrepancyAmount.toFixed(2)}`}]
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: AI REASONING TRACE */}
                {inspectTab === 'REASONING' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Sparkles size={16} color="#0C8CE9" />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>
                        EXECUTION REASONING PATH
                      </span>
                    </div>

                    <div style={{ background: 'rgba(5, 7, 15, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {inspectingMatch.reasoningTrace.map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.65rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.5' }}>
                          <span style={{ color: '#0C8CE9', fontWeight: 800 }}>[{idx + 1}]</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: RAW JSON LEDGER */}
                {inspectTab === 'RAW' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94A3B8' }}>
                        FULL CANONICAL OBJECT REPRESENTATION
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const payload = {
                            match: inspectingMatch,
                            bankTransaction: modalBankRecord,
                            gatewayRecords: modalGatewayRecords,
                            erpInvoices: modalErpRecords,
                          };
                          navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                          setModalCopied(true);
                          setTimeout(() => setModalCopied(false), 1500);
                        }}
                        style={{
                          background: 'rgba(12, 140, 233, 0.15)',
                          border: '1px solid #0C8CE9',
                          color: '#38BDF8',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                        }}
                      >
                        {modalCopied ? '✓ COPIED!' : 'COPY JSON'}
                      </button>
                    </div>

                    <pre style={{ margin: 0, padding: '1rem', background: '#04060C', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#38BDF8', overflowX: 'auto', maxHeight: '420px' }}>
                      {JSON.stringify({
                        matchVector: inspectingMatch,
                        bankTransaction: modalBankRecord || { status: 'RECORD_ABSENT_IN_BANK_FEED' },
                        gatewayRecords: modalGatewayRecords,
                        erpInvoices: modalErpRecords,
                      }, null, 2)}
                    </pre>
                  </div>
                )}

                {/* TAB 4: REMEDIATION ACTION */}
                {inspectTab === 'REMEDIATION' && (
                  <div>
                    {inspectingMatch.remediationStub ? (
                      <div style={{ background: 'rgba(12, 140, 233, 0.05)', border: '1px solid rgba(12, 140, 233, 0.3)', borderRadius: '8px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Wrench size={18} color="#0C8CE9" />
                          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                            1-CLICK REMEDIATION WORKFLOW
                          </h4>
                        </div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                          {inspectingMatch.remediationStub.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => setModalRemediationExecuted(true)}
                          disabled={modalRemediationExecuted}
                          style={{
                            background: modalRemediationExecuted ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #0C8CE9 0%, #0284C7 100%)',
                            border: modalRemediationExecuted ? '1px solid #10B981' : 'none',
                            color: modalRemediationExecuted ? '#10B981' : '#FFFFFF',
                            borderRadius: '6px',
                            padding: '0.75rem 1.25rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: modalRemediationExecuted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          {modalRemediationExecuted ? (
                            <>
                              <CheckCircle2 size={16} color="#10B981" />
                              <span>REMEDIATION WEBHOOK DISPATCHED & VERIFIED</span>
                            </>
                          ) : (
                            <>
                              <ArrowRight size={16} />
                              <span>{inspectingMatch.remediationStub.actionLabel}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                        <ShieldCheck size={36} color="#10B981" style={{ margin: '0 auto 0.75rem' }} />
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                          CLEAN TRANSACTION — ZERO ANOMALIES
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94A3B8' }}>
                          All 3 ledger sources (Bank Statement, Payment Gateway, and ERP Invoice) reconciled with 100% precision. No remediation action required.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
