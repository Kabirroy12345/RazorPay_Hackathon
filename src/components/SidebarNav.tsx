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
  Crown,
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
        background: 'linear-gradient(180deg, rgba(10, 14, 26, 0.94) 0%, rgba(5, 7, 15, 0.96) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(229, 184, 105, 0.16)',
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
        boxShadow: '4px 0 25px rgba(0, 0, 0, 0.5), inset -1px 0 0 rgba(229, 184, 105, 0.08)',
        zIndex: 100,
      }}
    >
      <div>
        {/* Royal Brand Crest & Emblem Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0 0.5rem 1.4rem 0.5rem',
            borderBottom: '1px solid rgba(229, 184, 105, 0.14)',
            marginBottom: '1.25rem',
          }}
        >
          {/* Imperial Geometric Monogram Crest */}
          <div
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="42" height="42" viewBox="0 0 44 44" fill="none" style={{ filter: 'drop-shadow(0 0 10px rgba(245, 208, 97, 0.45))' }}>
              <defs>
                <linearGradient id="royalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="50%" stopColor="#F5D061" />
                  <stop offset="100%" stopColor="#C4973B" />
                </linearGradient>
                <linearGradient id="royalBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0C8CE9" />
                </linearGradient>
              </defs>

              {/* Royal Shield Perimeter */}
              <polygon
                points="22,3 40,11 40,27 22,41 4,27 4,11"
                stroke="url(#royalGoldGrad)"
                strokeWidth="1.6"
                fill="rgba(245, 208, 97, 0.06)"
              />

              {/* Inner Gilded Geometric Core */}
              <polygon points="22,10 32,20 22,30 12,20" fill="url(#royalBlueGrad)" opacity="0.85" />
              <circle cx="22" cy="20" r="4" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 6px #FFE082)' }} />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-mono)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                }}
              >
                OMNISETTLE
              </span>
              <span
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 900,
                  color: '#F5D061',
                  fontFamily: 'var(--font-mono)',
                  textShadow: '0 0 12px rgba(245, 208, 97, 0.6)',
                }}
              >
                .AI
              </span>
            </div>
            <div
              style={{
                fontSize: '0.64rem',
                color: '#E5B869',
                fontWeight: 700,
                letterSpacing: '0.12em',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginTop: '0.1rem',
              }}
            >
              <Crown size={11} color="#F5D061" /> ROYAL FINANCE CONTROLLER
            </div>
          </div>
        </div>

        {/* Mock Mode Warning */}
        {isMockMode && (
          <div
            className="glitch-shake"
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
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

        {/* Imperial Vault Dataset Card */}
        <div
          onClick={() => onSelectView('data_hub')}
          style={{
            background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.08) 0%, rgba(12, 16, 30, 0.7) 100%)',
            border: '1px solid rgba(245, 208, 97, 0.22)',
            borderRadius: '8px',
            padding: '0.75rem 0.9rem',
            marginBottom: '1.4rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(245, 208, 97, 0.5)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 208, 97, 0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(245, 208, 97, 0.22)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.62rem', color: '#E5B869', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              ROYAL VAULT
            </span>
            <span style={{ fontSize: '0.58rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 700 }}>
              MOUNTED
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
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F5D061', boxShadow: '0 0 6px #F5D061' }} />
            <span>{activeDataset.recordCount} AUDIT VECTORS</span>
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
                    ? 'linear-gradient(90deg, rgba(245, 208, 97, 0.16) 0%, rgba(245, 208, 97, 0.03) 100%)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(245, 208, 97, 0.3)'
                    : '1px solid transparent',
                  borderLeft: isActive
                    ? '3px solid #F5D061'
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
                  boxShadow: isActive ? '0 2px 10px rgba(0, 0, 0, 0.3)' : 'none',
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
                      color: isActive ? '#F5D061' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(245, 208, 97, 0.5))' : 'none',
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

      {/* Royal Operator Card & Security Seals */}
      <div style={{ borderTop: '1px solid rgba(229, 184, 105, 0.14)', paddingTop: '0.9rem' }}>
        {/* Authenticated Operator Badge & Logout */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.07) 0%, rgba(12, 16, 30, 0.8) 100%)',
            border: '1px solid rgba(245, 208, 97, 0.25)',
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
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFE082 0%, #C4973B 100%)',
                  color: '#050711',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  boxShadow: '0 0 12px rgba(245, 208, 97, 0.45)',
                  border: '1px solid #FFF8E1',
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
                  {user?.name || 'Chief Controller'}
                </div>
                <div
                  style={{
                    fontSize: '0.62rem',
                    color: '#F5D061',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.06em',
                    fontWeight: 700,
                  }}
                >
                  [{user?.role || 'CHIEF_CONTROLLER'}]
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onLogout?.();
              }}
              title="Sign Out (Invalidate JWT)"
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
            <Lock size={12} color="#F5D061" />
            <span style={{ color: '#E5B869', fontWeight: 600 }}>ROYAL VAULT • 256-BIT</span>
          </div>
          <span>SOC-2 TYPE II</span>
        </div>
      </div>
    </aside>
  );
};
