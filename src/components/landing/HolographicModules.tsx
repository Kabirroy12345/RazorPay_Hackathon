import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Zap, 
  Cpu, 
  AlertTriangle, 
  TrendingUp, 
  Database, 
  FileText, 
  ArrowUpRight 
} from 'lucide-react';
import type { AppView } from '../../types/finance';

interface HolographicModulesProps {
  onSelectModule: (view: AppView) => void;
}

export const HolographicModules: React.FC<HolographicModulesProps> = ({ onSelectModule }) => {
  const modules = [
    {
      id: 'dashboard' as AppView,
      title: 'Executive Dashboard',
      subtitle: 'Real-time telemetry & Match KPIs',
      icon: <LayoutDashboard size={22} color="#00D2FF" />,
      color: '#00D2FF',
      preview: (
        <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '0.4rem 0' }}>
          {[40, 65, 55, 80, 70, 95, 88].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: '#00D2FF', borderRadius: '2px', opacity: 0.85 }} />
          ))}
        </div>
      ),
      stat: '88.9% CLOSED MATCH RATE',
    },
    {
      id: 'reconciler' as AppView,
      title: '3-Way Live Ledger',
      subtitle: 'Streaming multi-source reconciliation',
      icon: <Zap size={22} color="#00D2FF" />,
      color: '#00D2FF',
      preview: (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93', lineHeight: 1.5 }}>
          <div style={{ color: '#10B981' }}>✓ HDFC-9912 ↔ SET-88412 [MATCH]</div>
          <div style={{ color: '#00D2FF' }}>⚡ TXN-1082 FAST-PATH (&lt;1.2ms)</div>
        </div>
      ),
      stat: '10,000+ TXNS/SEC CAPACITY',
    },
    {
      id: 'bundle_lab' as AppView,
      title: '1-to-N Bundle Math Lab',
      subtitle: 'Combinatorial subset solver',
      icon: <Cpu size={22} color="#A855F7" />,
      color: '#A855F7',
      preview: (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#A855F7' }}>
          <div>8 INVOICES → GROSS ₹52,000</div>
          <div style={{ color: '#10B981' }}>ZERO DELTA 0.0000 PROVEN</div>
        </div>
      ),
      stat: '43ms AVERAGE SOLVE TIME',
    },
    {
      id: 'exceptions' as AppView,
      title: 'Audit Exception Center',
      subtitle: 'Automated anomaly triage & recovery',
      icon: <AlertTriangle size={22} color="#EF4444" />,
      color: '#EF4444',
      preview: (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#EF4444' }}>
          <div>[EXC-FEE-402] RATE OVERCHARGE</div>
          <div style={{ color: '#F59E0B' }}>1-CLICK RECLAMATION READY</div>
        </div>
      ),
      stat: '5 ANOMALY RADAR CATEGORIES',
    },
    {
      id: 'cash_forecast' as AppView,
      title: '30-Day Cash Forecaster',
      subtitle: 'Predictive working capital cycles',
      icon: <TrendingUp size={22} color="#10B981" />,
      color: '#10B981',
      preview: (
        <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
          <svg width="100%" height="32" viewBox="0 0 100 32">
            <path d="M 0 25 Q 25 10 50 18 T 100 5" fill="none" stroke="#10B981" strokeWidth="2.5" />
          </svg>
        </div>
      ),
      stat: '₹6,11,087.8 RECONCILED CASH',
    },
    {
      id: 'data_hub' as AppView,
      title: 'Data Hub & Ingestion',
      subtitle: 'Multi-format synthetic benchmark vectors',
      icon: <Database size={22} color="#00D2FF" />,
      color: '#00D2FF',
      preview: (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93' }}>
          <div>HDFC • ICICI • RAZORPAY • SAP</div>
          <div style={{ color: '#00D2FF' }}>53 SYNTHETIC GROUND TRUTH</div>
        </div>
      ),
      stat: 'ZERO DATA LOSS GUARANTEE',
    },
    {
      id: 'gaap_audit' as AppView,
      title: 'GAAP Audit Statement',
      subtitle: 'Boardroom-ready balance sheet proof',
      icon: <FileText size={22} color="#F59E0B" />,
      color: '#F59E0B',
      preview: (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#F59E0B' }}>
          <div>HASH: sha256:e88f41...d720</div>
          <div style={{ color: '#10B981' }}>IMMUTABLE AUDIT TRAIL</div>
        </div>
      ),
      stat: '100% BOARDROOM AUDIT COMPLIANT',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.75rem',
      }}
    >
      {modules.map((mod) => (
        <motion.div
          key={mod.id}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={() => onSelectModule(mod.id)}
          style={{
            background: 'rgba(11, 15, 25, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.75rem',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${mod.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${mod.color}33` }}>
                {mod.icon}
              </div>
              <ArrowUpRight size={18} color="#8E8E93" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.35rem' }}>
              {mod.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#8E8E93', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
              {mod.subtitle}
            </p>
          </div>

          {/* Micro Animation Box */}
          <div>
            <div style={{ background: '#07080E', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1rem', minHeight: '52px', display: 'flex', alignItems: 'center' }}>
              {mod.preview}
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: mod.color, fontWeight: 800 }}>
              {mod.stat}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
