import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Cpu,
  ShieldAlert,
  TrendingUp,
  Database,
  FileCheck,
  Lock,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AppView, FinancialDataset } from '../types/finance';

interface SidebarNavProps {
  currentView: AppView;
  activeDataset: FinancialDataset;
  exceptionCount: number;
  isMockMode?: boolean;
  onSelectView: (view: AppView) => void;
  onOpenMovableUI?: () => void;
  onLogout?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentView,
  activeDataset,
  exceptionCount,
  isMockMode,
  onSelectView,
  onOpenMovableUI,
  onLogout,
}) => {
  const { user, logout } = useAuth();
  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode; badge?: string | number }> = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'reconciler', label: '3-Way Live Ledger', icon: <Zap size={18} /> },
    { id: 'bundle_lab', label: '1-to-N Bundle Math Lab', icon: <Cpu size={18} /> },
    { id: 'exceptions', label: 'Audit Exceptions', icon: <ShieldAlert size={18} />, badge: exceptionCount },
    { id: 'cash_forecast', label: '30-Day Cash Forecaster', icon: <TrendingUp size={18} /> },
    { id: 'data_hub', label: 'Data Hub & Datasets', icon: <Database size={18} />, badge: activeDataset.id.slice(0, 4) },
    { id: 'gaap_audit', label: 'GAAP Audit Statement', icon: <FileCheck size={18} /> },
  ];

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '200px',
        maxWidth: '400px',
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid var(--border-hairline)',
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
      }}
    >
      <div>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--border-hairline)', marginBottom: '1.25rem' }}>
          <img 
            src="https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?w=100&h=100&fit=crop" 
            alt="Agent Node"
            style={{ width: '38px', height: '38px', borderRadius: '4px', border: '1px solid var(--border-hairline)' }}
          />
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em', fontFamily: 'var(--font-mono)' }}>
              OMNI_SETTLE
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' }}>
              SYS/AUDIT
            </div>
          </div>
        </div>

        {/* Mock Mode Warning */}
        {isMockMode && (
          <div className="glitch-shake" style={{
            background: 'var(--bg-root)',
            border: '1px solid var(--accent-red)',
            padding: '0.5rem 0.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--accent-red)'
          }}>
            <ShieldAlert size={16} />
            <div style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              [WARN] MOCK_LLM
            </div>
          </div>
        )}

        {/* Active Dataset Pill */}
        <div
          onClick={() => onSelectView('data_hub')}
          style={{
            background: 'var(--bg-root)',
            border: '1px solid var(--border-hairline)',
            padding: '0.65rem 0.85rem',
            marginBottom: '1.5rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            DATASET_IN_MEM
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            {activeDataset.name}
          </div>
          <div className="data-flicker" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            RECORDS: {activeDataset.recordCount}
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                style={{
                  background: isActive ? 'var(--bg-root)' : 'transparent',
                  border: isActive ? '1px solid var(--border-hairline)' : '1px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`badge ${
                      item.id === 'exceptions' && exceptionCount > 0 ? 'badge-red' : ''
                    }`}
                    style={{ fontSize: '0.68rem', padding: '0.1rem 0.3rem', fontFamily: 'var(--font-mono)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Operator Badge & Security Info */}
      <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '0.85rem' }}>
        {/* Authenticated Operator Badge & Logout */}
        <div style={{ background: 'var(--bg-root)', border: '1px solid var(--border-hairline)', padding: '0.65rem 0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '4px', background: '#00D2FF', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                {user?.name?.[0]?.toUpperCase() || 'O'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Authorized Operator'}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#00D2FF', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                  [{user?.role || 'OPERATOR'}]
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onLogout?.();
              }}
              title="Sign Out (Invalidate JWT)"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem', display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {onOpenMovableUI && (
          <button
            onClick={onOpenMovableUI}
            className="btn-terminal"
            style={{
              width: '100%',
              fontSize: '0.72rem',
              padding: '0.4rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
            }}
          >
            🎨 ADOBE MAX MOSAIC
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <Lock size={14} className="pulse-indicator" />
          <span className="data-flicker">SECURED_TRACK_04 • JWT</span>
        </div>
      </div>
    </aside>
  );
};
