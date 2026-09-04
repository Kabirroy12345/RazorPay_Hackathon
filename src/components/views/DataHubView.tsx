import React, { useState } from 'react';
import { Database, Upload, FileSpreadsheet, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw, Download } from 'lucide-react';
import { DATASET_LIST } from '../../data/datasets';
import { parseCustomCSVText } from '../../utils/csvParser';
import type { FinancialDataset, AppView } from '../../types/finance';

interface DataHubViewProps {
  activeDataset: FinancialDataset;
  onSelectDataset: (dataset: FinancialDataset) => void;
  onNavigateView?: (view: AppView) => void;
}

const SAMPLE_BANK_CSV = `id,date,description,amount,referenceNo,currency
BANK-CUSTOM-01,2026-08-28,RAZORPAY PAYOUT REF-RZP-9001,48272.80,RZP-PAYOUT-9001,INR
BANK-CUSTOM-02,2026-08-28,RAZORPAY SETTLE TXN-1082,10031.28,TXN-1082,INR
BANK-CUSTOM-03,2026-08-29,RAZORPAY SETTLE TXN-1083,24500.00,TXN-1083,INR`;

const SAMPLE_GATEWAY_CSV = `id,orderId,customerName,grossAmount,feeAmount
RZP-CUSTOM-01,ORD-CUST-01,Acme Enterprises,10236.00,200.00
RZP-CUSTOM-02,ORD-CUST-02,Zenith Retailers,25000.00,500.00
RZP-CUSTOM-03,ORD-CUST-03,Starlight Tech,15000.00,300.00`;

const SAMPLE_ERP_CSV = `id,orderId,customerName,amount,date
INV-CUSTOM-01,ORD-CUST-01,Acme Enterprises,10236.00,2026-08-28
INV-CUSTOM-02,ORD-CUST-02,Zenith Retailers,25000.00,2026-08-28
INV-CUSTOM-03,ORD-CUST-03,Starlight Tech,15000.00,2026-08-29`;

export const DataHubView: React.FC<DataHubViewProps> = ({ activeDataset, onSelectDataset, onNavigateView }) => {
  const [bankCsvText, setBankCsvText] = useState('');
  const [gatewayCsvText, setGatewayCsvText] = useState('');
  const [erpCsvText, setErpCsvText] = useState('');
  const [mountNotice, setMountNotice] = useState<string | null>(null);

  const handleParseCustom = () => {
    if (!bankCsvText || !gatewayCsvText) return;
    const customData = parseCustomCSVText(bankCsvText, gatewayCsvText, erpCsvText);
    onSelectDataset(customData);
    setMountNotice(`Successfully mounted custom batch: ${customData.recordCount} total transactions parsed.`);
    setTimeout(() => setMountNotice(null), 5000);
  };

  const handleLoadSampleCSV = () => {
    setBankCsvText(SAMPLE_BANK_CSV);
    setGatewayCsvText(SAMPLE_GATEWAY_CSV);
    setErpCsvText(SAMPLE_ERP_CSV);
  };

  const handleClearCSV = () => {
    setBankCsvText('');
    setGatewayCsvText('');
    setErpCsvText('');
  };

  const handleDownloadTemplate = () => {
    const templateZip = `--- BANK STATEMENT TEMPLATE ---
id,date,description,amount,referenceNo,currency
BANK-01,2026-08-28,RAZORPAY PAYOUT,10000.00,REF-01,INR

--- GATEWAY SETTLEMENT TEMPLATE ---
id,orderId,customerName,grossAmount,feeAmount
RZP-01,ORD-01,Client Name,10000.00,200.00

--- ERP INVOICES TEMPLATE ---
id,orderId,customerName,amount,date
INV-01,ORD-01,Client Name,10000.00,2026-08-28`;

    const blob = new Blob([templateZip], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OmniSettle_CSV_Schemas_Template.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      {/* Header */}
      <div
        className="terminal-panel"
        style={{
          padding: '1.35rem 1.6rem',
          background: 'linear-gradient(135deg, rgba(19, 26, 48, 0.75) 0%, rgba(8, 11, 22, 0.85) 100%)',
          border: '1px solid rgba(12, 140, 233, 0.25)',
          borderLeft: '4px solid #0C8CE9',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(12, 140, 233, 0.12)',
                border: '1px solid rgba(12, 140, 233, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
                boxShadow: '0 0 12px rgba(12, 140, 233, 0.25)',
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                  FINANCIAL_DATA_HUB & DATASET_REPOSITORY
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
                  <Database size={11} style={{ marginRight: '0.25rem' }} />
                  DATASET REPOSITORY
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Switch between pre-packaged enterprise synthetic benchmark datasets or ingest custom Bank, Gateway, and ERP CSV ledger batches.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleDownloadTemplate}
              className="btn-terminal"
              style={{ fontSize: '0.78rem' }}
            >
              <Download size={14} /> SCHEMAS TEMPLATE
            </button>
          </div>
        </div>
      </div>

      {/* Mount Confirmation Banner */}
      {mountNotice && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(12, 16, 30, 0.95) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '8px',
            padding: '1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={20} color="#10B981" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10B981' }}>{mountNotice}</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>Active Batch: {activeDataset.name}</div>
            </div>
          </div>

          {onNavigateView && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onNavigateView('dashboard')}
                className="btn-terminal primary"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
              >
                OPEN DASHBOARD ➔
              </button>
              <button
                onClick={() => onNavigateView('reconciler')}
                className="btn-terminal"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
              >
                VIEW LIVE LEDGER
              </button>
            </div>
          )}
        </div>
      )}

      {/* Benchmark Datasets Section */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Enterprise Synthetic Benchmark Suites</span>
          <span style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>(50+ VECTORS GROUND TRUTH)</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
          {DATASET_LIST.map(ds => {
            const isActive = activeDataset.id === ds.id;
            return (
              <div
                key={ds.id}
                onClick={() => {
                  onSelectDataset(ds);
                  setMountNotice(`Mounted: ${ds.name} (${ds.recordCount} records).`);
                  setTimeout(() => setMountNotice(null), 4000);
                }}
                className="terminal-panel"
                style={{
                  padding: '1.35rem',
                  border: isActive ? '2px solid #0C8CE9' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(12, 140, 233, 0.12) 0%, rgba(12, 16, 30, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(12, 16, 30, 0.8) 0%, rgba(5, 7, 15, 0.9) 100%)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderRadius: '8px',
                  boxShadow: isActive ? '0 0 25px rgba(12, 140, 233, 0.25), 0 8px 25px rgba(0,0,0,0.5)' : '0 4px 15px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span
                      className="badge"
                      style={{
                        background: isActive ? 'rgba(12, 140, 233, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                        border: isActive ? '1px solid rgba(12, 140, 233, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isActive ? '#38BDF8' : '#94A3B8',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                      }}
                    >
                      {ds.recordCount} RECORDS
                    </span>
                    {isActive && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10B981', fontSize: '0.72rem', fontWeight: 800 }}>
                        <ShieldCheck size={16} color="#10B981" /> MOUNTED
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.45rem' }}>
                    {ds.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: '1.5' }}>
                    {ds.description}
                  </p>
                </div>

                <button
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #0C8CE9 0%, #0284C7 100%)' : 'rgba(255,255,255,0.06)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.6rem 0.95rem',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isActive ? '0 0 12px rgba(12, 140, 233, 0.35)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isActive ? 'ACTIVE DATASET' : 'LOAD DATASET'} <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom CSV File Ingestion */}
      <div
        className="terminal-panel"
        style={{
          padding: '1.6rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.35rem',
          background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
          border: '1px solid rgba(229, 184, 105, 0.22)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(229, 184, 105, 0.16)', paddingBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Upload size={20} color="#F5D061" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
              Custom CSV File Ingestion & Live Parser
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleLoadSampleCSV}
              className="btn-terminal"
              style={{ fontSize: '0.75rem', borderColor: 'rgba(245, 208, 97, 0.3)', color: '#F5D061' }}
            >
              <RefreshCw size={12} /> AUTOFILL SAMPLE CSV DATA
            </button>
            <button
              onClick={handleClearCSV}
              className="btn-terminal"
              style={{ fontSize: '0.75rem' }}
            >
              CLEAR
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.15rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E5B869', display: 'block', marginBottom: '0.45rem', fontFamily: 'var(--font-mono)' }}>
              1. BANK STATEMENT CSV:
            </label>
            <textarea
              rows={5}
              placeholder="id,date,description,amount,referenceNo,currency&#10;BANK-01,2026-08-28,RAZORPAY PAYOUT,10000.00,RZP-01,INR"
              value={bankCsvText}
              onChange={e => setBankCsvText(e.target.value)}
              style={{
                width: '100%',
                background: '#050711',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.75rem',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E5B869', display: 'block', marginBottom: '0.45rem', fontFamily: 'var(--font-mono)' }}>
              2. GATEWAY SETTLEMENT CSV:
            </label>
            <textarea
              rows={5}
              placeholder="id,orderId,customerName,grossAmount,feeAmount&#10;RZP-01,ORD-01,Acme Corp,10236.00,200.00"
              value={gatewayCsvText}
              onChange={e => setGatewayCsvText(e.target.value)}
              style={{
                width: '100%',
                background: '#050711',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.75rem',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E5B869', display: 'block', marginBottom: '0.45rem', fontFamily: 'var(--font-mono)' }}>
              3. ERP SALES LEDGER CSV:
            </label>
            <textarea
              rows={5}
              placeholder="id,orderId,customerName,amount,date&#10;INV-01,ORD-01,Acme Corp,10236.00,2026-08-28"
              value={erpCsvText}
              onChange={e => setErpCsvText(e.target.value)}
              style={{
                width: '100%',
                background: '#050711',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.75rem',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <button
          onClick={handleParseCustom}
          disabled={!bankCsvText || !gatewayCsvText}
          className="btn-terminal primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '0.85rem',
            fontSize: '0.85rem',
            fontWeight: 800,
            opacity: (!bankCsvText || !gatewayCsvText) ? 0.6 : 1,
          }}
        >
          <FileSpreadsheet size={18} /> PARSE & MOUNT CUSTOM FINANCIAL BATCH
        </button>
      </div>
    </div>
  );
};
