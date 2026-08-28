import React, { useState } from 'react';
import { Database, Upload, CheckCircle2, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { DATASET_LIST } from '../../data/datasets';
import { parseCustomCSVText } from '../../utils/csvParser';
import type { FinancialDataset } from '../../types/finance';

interface DataHubViewProps {
  activeDataset: FinancialDataset;
  onSelectDataset: (dataset: FinancialDataset) => void;
}

export const DataHubView: React.FC<DataHubViewProps> = ({ activeDataset, onSelectDataset }) => {
  const [bankCsvText, setBankCsvText] = useState('');
  const [gatewayCsvText, setGatewayCsvText] = useState('');
  const [erpCsvText, setErpCsvText] = useState('');

  const handleParseCustom = () => {
    if (!bankCsvText || !gatewayCsvText) return;
    const customData = parseCustomCSVText(bankCsvText, gatewayCsvText, erpCsvText);
    onSelectDataset(customData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="terminal-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
          <Database size={22} color="var(--accent-amber)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Financial Data Hub & Custom Dataset Builder
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Switch between pre-packaged enterprise financial datasets or upload custom Bank, Gateway, and ERP CSV files.
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Select Pre-Packaged Synthetic Benchmark Suite
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {DATASET_LIST.map(ds => {
            const isActive = activeDataset.id === ds.id;
            return (
              <div
                key={ds.id}
                onClick={() => onSelectDataset(ds)}
                className="terminal-panel"
                style={{
                  padding: '1.25rem',
                  border: isActive ? '2px solid var(--accent-amber)' : '1px solid var(--border-hairline)',
                  background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className={`badge ${isActive ? 'badge-amber' : 'badge-amber'}`}>
                      {ds.recordCount} Records
                    </span>
                    {isActive && <CheckCircle2 size={18} color="var(--accent-amber)" />}
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {ds.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {ds.description}
                  </p>
                </div>

                <button
                  style={{
                    background: isActive ? 'var(--accent-amber)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#000' : 'var(--text-primary)',
                    border: 'none',
                    padding: '0.55rem 0.85rem',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {isActive ? 'Active Dataset' : 'Load Dataset'} <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="terminal-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
          <Upload size={20} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Custom CSV File Ingestion & Live Parser
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              1. Paste Bank Statement CSV:
            </label>
            <textarea
              rows={5}
              placeholder="id,date,description,amount,referenceNo,currency&#10;BANK-01,2026-08-28,RAZORPAY PAYOUT,10000.00,RZP-01,INR"
              value={bankCsvText}
              onChange={e => setBankCsvText(e.target.value)}
              style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-hairline)', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              2. Paste Gateway Settlement CSV:
            </label>
            <textarea
              rows={5}
              placeholder="id,orderId,customerName,grossAmount,feeAmount&#10;RZP-01,ORD-01,Acme Corp,10236.00,200.00"
              value={gatewayCsvText}
              onChange={e => setGatewayCsvText(e.target.value)}
              style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-hairline)', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              3. Paste ERP Sales Ledger CSV:
            </label>
            <textarea
              rows={5}
              placeholder="id,orderId,customerName,amount,date&#10;INV-01,ORD-01,Acme Corp,10236.00,2026-08-28"
              value={erpCsvText}
              onChange={e => setErpCsvText(e.target.value)}
              style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-hairline)', padding: '0.65rem', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>

        <button
          onClick={handleParseCustom}
          className="btn-terminal primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
        >
          <FileSpreadsheet size={18} /> Parse & Load Custom Financial Batch
        </button>
      </div>
    </div>
  );
};
