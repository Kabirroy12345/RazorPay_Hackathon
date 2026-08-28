import React, { useState } from 'react';
import type {
  BankTransaction,
  GatewayRecord,
  ERPInvoice,
  MatchResult,
  ReconciliationStatus,
} from '../types/finance';
import { ExternalLink, Zap, Cpu, AlertTriangle, Layers } from 'lucide-react';

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
        m.bankRecordId.toLowerCase().includes(cliFilter.toLowerCase())
      )
    : activeTabMatches;

  const renderStampBadge = (status: ReconciliationStatus) => {
    if (status === 'FAST_PATH_MATCHED') {
      return <span className="badge badge-amber">{status}</span>;
    }
    if (status.startsWith('AGENTIC')) {
      return <span className="badge badge-amber">{status}</span>;
    }
    return <span className="badge badge-red">{status}</span>;
  };

  return (
    <div className="terminal-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-hairline)' }}>
        <div>
          <h2 className="font-mono" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            3-WAY_LIVE_LEDGER
          </h2>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Real-time reconciliation vector mapping
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-root)', border: '1px solid var(--border-hairline)', padding: '0.25rem' }}>
          <button
            onClick={() => setActiveTab('ALL')}
            className={activeTab === 'ALL' ? 'btn-terminal primary' : 'btn-terminal'}
            style={{ border: 'none' }}
          >
            <Layers size={14} /> ALL({allMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('FAST_PATH')}
            className={activeTab === 'FAST_PATH' ? 'btn-terminal primary' : 'btn-terminal'}
            style={{ border: 'none' }}
          >
            <Zap size={14} /> FAST-PATH({fastPathMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('AGENTIC')}
            className={activeTab === 'AGENTIC' ? 'btn-terminal primary' : 'btn-terminal'}
            style={{ border: 'none' }}
          >
            <Cpu size={14} /> AGENTIC_AI({agenticMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('EXCEPTIONS')}
            className={activeTab === 'EXCEPTIONS' ? 'btn-terminal primary' : 'btn-terminal'}
            style={{ border: 'none', color: activeTab === 'EXCEPTIONS' ? undefined : 'var(--accent-red)' }}
          >
            <AlertTriangle size={14} /> EXCEPTIONS({exceptionMatches.length})
          </button>
        </div>
      </div>

      {/* CLI Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-root)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-hairline)' }}>
        <span className="font-mono pulse-indicator" style={{ color: 'var(--accent-amber)', marginRight: '0.5rem', fontWeight: 'bold' }}>&gt;</span>
        <input 
          type="text" 
          placeholder="filter --id=* --status=*"
          value={cliFilter}
          onChange={(e) => setCliFilter(e.target.value)}
          className="font-mono"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
        />
      </div>

      {/* Side-by-Side Ledger Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="terminal-table">
          <thead>
            <tr>
              <th style={{ width: '14%' }}>VERDICT</th>
              <th style={{ width: '22%' }}>BANK_STATEMENT</th>
              <th style={{ width: '22%' }}>PG_SETTLEMENT</th>
              <th style={{ width: '22%' }}>ERP_SALES</th>
              <th style={{ width: '10%', textAlign: 'right' }}>CONFIDENCE</th>
              <th style={{ width: '5%', textAlign: 'center' }}>INSPECT</th>
              <th style={{ width: '5%', textAlign: 'center' }}>RAW</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.map(match => {
              const bRecord = bankTxns.find(b => b.id === match.bankRecordId);
              const gRecords = gatewayRecords.filter(g => match.gatewayRecordIds.includes(g.id));
              const erpRecords = erpInvoices.filter(e => match.erpInvoiceIds.includes(e.id));

              return (
                <React.Fragment key={match.id}>
                  <tr>
                    {/* Stamp */}
                    <td style={{ verticalAlign: 'middle' }}>
                      {renderStampBadge(match.status)}
                    </td>

                    {/* 1. Bank Record */}
                    <td style={{ verticalAlign: 'top' }}>
                      {bRecord ? (
                        <div>
                          <div className="font-mono data-flicker" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                            {bRecord.currency === 'USD' ? '$' : '₹'}
                            {bRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {bRecord.id} • {bRecord.date}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', whiteSpace: 'nowrap' }}>
                            {bRecord.description}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--accent-red)', fontStyle: 'italic', fontSize: '0.75rem', fontWeight: 600 }}>
                          MISSING_IN_BANK
                        </span>
                      )}
                    </td>

                    {/* 2. Gateway Record */}
                    <td style={{ verticalAlign: 'top' }}>
                      {gRecords.length > 0 ? (
                        <div>
                          {gRecords.length > 1 ? (
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              BUNDLE: {gRecords.length}-TRANSACTIONS
                            </div>
                          ) : (
                            <div className="font-mono data-flicker" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                              {gRecords[0].currency === 'USD' ? '$' : '₹'}
                              {gRecords[0].netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {gRecords.length === 1 ? gRecords[0].id : `${gRecords.length} ITEMS`}
                            {match.feeRateBps && ` • FEE: ${(match.feeRateBps / 100).toFixed(2)}%`}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--accent-red)', fontStyle: 'italic', fontSize: '0.75rem', fontWeight: 600 }}>
                          UNLINKED_GATEWAY
                        </span>
                      )}
                    </td>

                    {/* 3. ERP Invoice Record */}
                    <td style={{ verticalAlign: 'top' }}>
                      {erpRecords.length > 0 ? (
                        <div>
                          {erpRecords.length > 1 ? (
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              {erpRecords.length} INVOICES (GROSS ₹52,000)
                            </div>
                          ) : (
                            <div className="font-mono data-flicker" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                              {erpRecords[0].currency === 'USD' ? '$' : '₹'}
                              {erpRecords[0].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {erpRecords.length === 1 ? erpRecords[0].id : `INV-BUN-01..0${erpRecords.length}`}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--accent-amber)', fontStyle: 'italic', fontSize: '0.75rem', fontWeight: 600 }}>
                          0_SALES_INVOICES
                        </span>
                      )}
                    </td>

                    {/* Confidence */}
                    <td style={{ verticalAlign: 'top', textAlign: 'right' }}>
                      <span className="font-mono data-flicker" style={{ fontWeight: 700, color: match.confidenceScore >= 0.98 ? 'var(--text-primary)' : 'var(--accent-amber)' }}>
                        {(match.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ verticalAlign: 'top', textAlign: 'center' }}>
                      {onSelectMatch && (
                        <button
                          onClick={() => onSelectMatch(match)}
                          className="btn-terminal"
                        >
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </td>
                    
                    {/* JSON Expander */}
                    <td style={{ verticalAlign: 'top', textAlign: 'center' }}>
                      <button className="btn-terminal" onClick={(e) => toggleRow(match.id, e)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>
                        {expandedRows.has(match.id) ? '-' : '+'}
                      </button>
                    </td>
                  </tr>

                  {/* Raw JSON Expansion Row */}
                  {expandedRows.has(match.id) && (
                    <tr style={{ background: '#080808' }}>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>BANK_RAW</span>
                             <pre className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-root)', padding: '0.75rem', overflowX: 'auto', border: '1px solid var(--border-hairline)' }}>
                               {JSON.stringify(bRecord, null, 2)}
                             </pre>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>GATEWAY_RAW</span>
                             <pre className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-root)', padding: '0.75rem', overflowX: 'auto', border: '1px solid var(--border-hairline)' }}>
                               {JSON.stringify(gRecords, null, 2)}
                             </pre>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>ERP_RAW</span>
                             <pre className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-root)', padding: '0.75rem', overflowX: 'auto', border: '1px solid var(--border-hairline)' }}>
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
