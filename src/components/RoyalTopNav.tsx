import React, { useState, useEffect } from 'react';
import {
  Crown,
  Clock,
  ShieldCheck,
  Play,
  ChevronRight,
  Database,
} from 'lucide-react';
import type { AppView, FinancialDataset } from '../types/finance';

interface RoyalTopNavProps {
  currentView: AppView;
  activeDataset: FinancialDataset;
  onSelectView: (view: AppView) => void;
  onRunBatch?: () => void;
  isProcessing?: boolean;
}

const VIEW_TITLES: Record<AppView, { title: string; subtitle: string }> = {
  dashboard: { title: 'Executive Controller Dashboard', subtitle: '3-Way Autonomous Reconciliation' },
  reconciler: { title: '3-Way Streaming Reconciler', subtitle: 'Real-Time Vector Engine' },
  bundle_lab: { title: '1-to-N Bundle Math Lab', subtitle: 'MDR, GST & Refund Prover' },
  exceptions: { title: 'Audit Exception Triage', subtitle: 'Honest Anomaly Resolution' },
  settlement_qa: { title: 'Settlement Q&A Agent', subtitle: 'Autonomous Conversational Auditor' },
  cash_forecast: { title: '30-Day Forward Cash Forecaster', subtitle: 'Liquidity Stress Sandbox' },
  data_hub: { title: 'Financial Data Hub', subtitle: 'Synthetic & Custom Batches' },
  gaap_audit: { title: 'GAAP Reconciliation Statement', subtitle: 'Cryptographic Audit Certificate' },
};

export const RoyalTopNav: React.FC<RoyalTopNavProps> = ({
  currentView,
  activeDataset,
  onSelectView,
  onRunBatch,
  isProcessing,
}) => {
  const [currentTime, setCurrentTime] = useState({
    utc: '',
    ist: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime({
        utc: now.toISOString().slice(11, 19) + ' UTC',
        ist: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      });
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const viewMeta = VIEW_TITLES[currentView] || { title: 'Controller Terminal', subtitle: 'OmniSettle Engine' };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(5, 7, 17, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(229, 184, 105, 0.18)',
        padding: '0.75rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        marginBottom: '1.25rem',
      }}
    >
      {/* Left: Royal Imperial Breadcrumbs & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(245, 208, 97, 0.08)',
            border: '1px solid rgba(245, 208, 97, 0.22)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px',
          }}
        >
          <Crown size={14} color="#F5D061" style={{ filter: 'drop-shadow(0 0 4px rgba(245, 208, 97, 0.6))' }} />
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#F5D061',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
            }}
          >
            SOVEREIGN TERMINAL
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B' }}>
          <ChevronRight size={14} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {viewMeta.title}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  color: '#94A3B8',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                HOTKEY [{currentView === 'dashboard' ? '1' : currentView === 'reconciler' ? '2' : currentView === 'bundle_lab' ? '3' : currentView === 'exceptions' ? '4' : currentView === 'settlement_qa' ? '5' : currentView === 'cash_forecast' ? '6' : currentView === 'data_hub' ? '7' : '8'}]
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#E5B869', fontFamily: 'var(--font-mono)', marginTop: '0.05rem' }}>
              {viewMeta.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Real-Time Sovereign Pulse & Ledger Clock */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.85) 0%, rgba(5, 7, 15, 0.95) 100%)',
          border: '1px solid rgba(229, 184, 105, 0.15)',
          padding: '0.35rem 1rem',
          borderRadius: '30px',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#10B981',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
            }}
          >
            MAINNET ONLINE
          </span>
        </div>

        <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</span>

        {/* Dual Clocks */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={12} color="#F5D061" />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#F8FAFC',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            {currentTime.ist || '11:00:00 IST'}
          </span>
          <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
            ({currentTime.utc})
          </span>
        </div>

        <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={13} color="#F5D061" />
          <span style={{ fontSize: '0.68rem', color: '#E5B869', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            SHA-256 SEALED
          </span>
        </div>
      </div>

      {/* Right: Active Vault Quick Pill & Batch Execute CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Active Dataset Pill */}
        <button
          onClick={() => onSelectView('data_hub')}
          title="Switch Active Dataset Vault"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(245, 208, 97, 0.08)',
            border: '1px solid rgba(245, 208, 97, 0.25)',
            borderRadius: '6px',
            padding: '0.4rem 0.75rem',
            color: '#F8FAFC',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(245, 208, 97, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(245, 208, 97, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(245, 208, 97, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(245, 208, 97, 0.25)';
          }}
        >
          <Database size={13} color="#F5D061" />
          <span style={{ color: '#E5B869', fontWeight: 700 }}>VAULT:</span>
          <span>{activeDataset.id.replace('_', ' ')}</span>
          <span style={{ fontSize: '0.62rem', color: '#94A3B8' }}>({activeDataset.recordCount})</span>
        </button>

        {/* Global Batch Run CTA if provided */}
        {onRunBatch && (
          <button
            onClick={onRunBatch}
            disabled={isProcessing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'linear-gradient(135deg, #FFE082 0%, #F5D061 50%, #C4973B 100%)',
              color: '#050711',
              border: 'none',
              borderRadius: '6px',
              padding: '0.45rem 0.9rem',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em',
              boxShadow: '0 0 16px rgba(245, 208, 97, 0.45), 0 2px 4px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={e => {
              if (!isProcessing) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 0 22px rgba(245, 208, 97, 0.6), 0 4px 10px rgba(0, 0, 0, 0.5)';
              }
            }}
            onMouseLeave={e => {
              if (!isProcessing) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(245, 208, 97, 0.45), 0 2px 4px rgba(0, 0, 0, 0.4)';
              }
            }}
          >
            {isProcessing ? (
              <>
                <div style={{ width: '12px', height: '12px', border: '2px solid #050711', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>AUDITING...</span>
              </>
            ) : (
              <>
                <Play size={13} fill="#050711" />
                <span>RE-AUDIT BATCH</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
