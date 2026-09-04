import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Cpu,
  ShieldAlert,
  TrendingUp,
  Database,
  FileCheck,
  Bot,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AppView, FinancialDataset } from '../types/finance';

interface SidebarNavProps {
  currentView: AppView;
  activeDataset: FinancialDataset;
  exceptionCount: number;
  isMockMode?: boolean;
  onSelectView: (view: AppView) => void;
  onLogout?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentView,
  activeDataset,
  exceptionCount,
  isMockMode,
  onSelectView,
  onLogout,
}) => {
  const { user, logout } = useAuth();
  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: string | number }> = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'reconciler', label: '3-Way Live Ledger', icon: <Zap size={18} /> },
    { id: 'bundle_lab', label: '1-to-N Bundle Math Lab', icon: <Cpu size={18} /> },
    { id: 'exceptions', label: 'Audit Exceptions', icon: <ShieldAlert size={18} />, badge: exceptionCount },
    { id: 'settlement_qa', label: 'Settlement Q&A Agent', icon: <Bot size={18} />, badge: 'AI' },
    { id: 'cash_forecast', label: '30-Day Cash Forecaster', icon: <TrendingUp size={18} /> },
    { id: 'data_hub', label: 'Data Hub & Datasets', icon: <Database size={18} />, badge: activeDataset.id.slice(0, 4) },
    { id: 'gaap_audit', label: 'GAAP Audit Statement', icon: <FileCheck size={18} /> },
  ];

  return (
    <aside
      style={{
        width: '270px',
        minWidth: '220px',
        maxWidth: '420px',
        background: 'linear-gradient(180deg, rgba(10, 14, 26, 0.96) 0%, rgba(5, 7, 15, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        resize: 'horizontal',
        boxShadow: '4px 0 25px rgba(0, 0, 0, 0.5)',
        zIndex: 100,
      }}
    >
      <div>
        {/* Modern Enterprise Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0 0.5rem 1.4rem 0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.25rem',
          }}
        >
          {/* Razorpay-Inspired Modern Interlocking Geometric Ledger Crest */}
          <div
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="fintechBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0C8CE9" />
                </linearGradient>
                <linearGradient id="fintechGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5D061" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* Precision Interlocking Hexagon Frame */}
              <polygon
                points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5"
                stroke="url(#fintechBlueGrad)"
                strokeWidth="1.8"
                fill="rgba(12, 140, 233, 0.06)"
              />

              {/* Core Verification Node */}
              <polygon points="20,11 28,16 28,24 20,29 12,24 12,16" stroke="url(#fintechGoldGrad)" strokeWidth="1.4" fill="rgba(245, 208, 97, 0.1)" />
              <circle cx="20" cy="20" r="3.5" fill="#0C8CE9" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                OMNISETTLE
              </span>
              <span
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 900,
                  color: '#0C8CE9',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                .AI
              </span>
            </div>
            <div
              style={{
                fontSize: '0.66rem',
                color: '#94A3B8',
                fontWeight: 700,
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginTop: '0.15rem',
              }}
            >
              <ShieldCheck size={11} color="#0C8CE9" /> AI FINANCE CONTROLLER
            </div>
          </div>
        </div>

        {/* Mock Mode Warning */}
        {isMockMode && (
          <div
            className="glitch-shake"
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              borderRadius: '6px',
              padding: '0.5rem 0.75rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#F43F5E',
            }}
          >
            <ShieldAlert size={16} />
            <div style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              [WARN] MOCK_LLM_FALLBACK
            </div>
          </div>
        )}

        {/* Active Dataset Batch Card */}
        <div
          onClick={() => onSelectView('data_hub')}
          style={{
            background: 'linear-gradient(135deg, rgba(12, 140, 233, 0.08) 0%, rgba(12, 16, 30, 0.7) 100%)',
            border: '1px solid rgba(12, 140, 233, 0.22)',
            borderRadius: '8px',
            padding: '0.75rem 0.9rem',
            marginBottom: '1.4rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(12, 140, 233, 0.5)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 140, 233, 0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(12, 140, 233, 0.22)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.64rem', color: '#38BDF8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              ACTIVE BATCH
            </span>
            <span style={{ fontSize: '0.58rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 700 }}>
              ONLINE
            </span>
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#FFFFFF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: '0.25rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {activeDataset.name}
          </div>
          <div
            style={{
              fontSize: '0.68rem',
              color: '#94A3B8',
              marginTop: '0.2rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0C8CE9', boxShadow: '0 0 6px #0C8CE9' }} />
            <span>{activeDataset.recordCount} RECORDS MOUNTED</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(12, 140, 233, 0.14) 0%, rgba(12, 140, 233, 0.02) 100%)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(12, 140, 233, 0.3)'
                    : '1px solid transparent',
                  borderLeft: isActive
                    ? '3px solid #0C8CE9'
                    : '3px solid transparent',
                  borderRadius: '6px',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  padding: '0.55rem 0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#F8FAFC';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      color: isActive ? '#0C8CE9' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`badge ${
                      item.id === 'exceptions' && exceptionCount > 0
                        ? 'badge-red'
                        : 'badge-amber'
                    }`}
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.15rem 0.4rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Enterprise Operator Card & Security Seals */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.9rem' }}>
        {/* Authenticated Operator Badge & Logout */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(12, 140, 233, 0.06) 0%, rgba(12, 16, 30, 0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.75rem 0.85rem',
            marginBottom: '0.85rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #0C8CE9 0%, #0284C7 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  boxShadow: '0 0 10px rgba(12, 140, 233, 0.35)',
                }}
              >
                {user?.name?.[0]?.toUpperCase() || 'C'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name || 'Finance Controller'}
                </div>
                <div
                  style={{
                    fontSize: '0.62rem',
                    color: '#38BDF8',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                    fontWeight: 700,
                  }}
                >
                  [{user?.role || 'FINANCE_CONTROLLER'}]
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onLogout?.();
              }}
              title="Sign Out (Invalidate Session)"
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#F43F5E',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
                e.currentTarget.style.color = '#F43F5E';
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Cryptographic Security Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#64748B',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            padding: '0 0.2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Lock size={12} color="#0C8CE9" />
            <span style={{ color: '#94A3B8', fontWeight: 600 }}>ENTERPRISE • 256-BIT</span>
          </div>
          <span>SOC-2 TYPE II</span>
        </div>
      </div>
    </aside>
  );
};
