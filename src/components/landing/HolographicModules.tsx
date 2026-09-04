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
  ArrowUpRight,
  CheckCircle2,
  Bot
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
      subtitle: 'Real-time telemetry, match rates & liquidity health',
      icon: <LayoutDashboard size={22} color="#00D2FF" />,
      color: '#00D2FF',
      preview: (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8E8E93' }}>CLOSED MATCH RATE</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: '#10B981' }}>88.9% (40/45)</span>
          </div>
          {/* Animated Bar Chart */}
          <div style={{ height: '32px', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
            {[45, 70, 60, 90, 80, 100, 88].map((h, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  height: `${h}%`, 
                  background: 'linear-gradient(180deg, #00D2FF 0%, #0284C7 100%)', 
                  borderRadius: '3px',
                  boxShadow: '0 0 8px rgba(0, 210, 255, 0.4)'
                }} 
              />
            ))}
          </div>
        </div>
      ),
      metricLabel: 'TOTAL RECONCILED CASH',
      metricValue: '₹6,11,087.80 INR',
    },
    {
      id: 'reconciler' as AppView,
      title: '3-Way Live Ledger',
      subtitle: 'Continuous multi-source streaming reconciliation',
      icon: <Zap size={22} color="#00D2FF" />,
      color: '#00D2FF',
      preview: (
        <div style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', lineHeight: 1.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.2rem' }}>
            <span>✓ HDFC-9912 ↔ SET-88412</span>
            <span style={{ color: '#00D2FF' }}>MATCHED</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', paddingTop: '0.2rem' }}>
            <span>⚡ TXN-1082 FAST-PATH</span>
            <span style={{ color: '#10B981' }}>0.94ms (0 TOKENS)</span>
          </div>
        </div>
      ),
      metricLabel: 'THROUGHPUT CAPACITY',
      metricValue: '10,000+ TXNS/SEC',
    },
    {
      id: 'bundle_lab' as AppView,
      title: '1-to-N Bundle Math Lab',
      subtitle: 'Combinatorial knapsack solver with zero-delta proof',
      icon: <Cpu size={22} color="#A855F7" />,
      color: '#A855F7',
      preview: (
        <div style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
          <div style={{ color: '#EDEDED', marginBottom: '0.25rem' }}>
            SET-88412 ➔ 8 INVOICES (INV-BUN-01..08)
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
            <span>EQUATION: 52k - MDR - GST - REF</span>
            <strong>DELTA: 0.0000</strong>
          </div>
        </div>
      ),
      metricLabel: 'AI SOLVE LATENCY',
      metricValue: '43ms (Claude 3.5)',
    },
    {
      id: 'exceptions' as AppView,
      title: 'Audit Exception Center',
      subtitle: '5-category anomaly triage with 1-click remediation',
      icon: <AlertTriangle size={22} color="#EF4444" />,
      color: '#EF4444',
      preview: (
        <div style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444', marginBottom: '0.25rem' }}>
            <span>[EXC-FEE-402] RATE OVERCHARGE</span>
            <span>-₹142.50</span>
          </div>
          <div style={{ color: '#F59E0B', fontSize: '0.58rem' }}>
            RECLAMATION NOTICE DISPATCHED TO GATEWAY OPS
          </div>
        </div>
      ),
      metricLabel: 'EXCEPTION CATEGORIES',
      metricValue: '5 STRICT CHANNELS',
    },
    {
      id: 'settlement_qa' as AppView,
      title: 'Settlement Q&A Agent',
      subtitle: 'Natural language settlement & fee queries with ledger citations',
      icon: <Bot size={22} color="#00D2FF" />,
      color: '#00D2FF',
      preview: (
        <div style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
          <div style={{ color: '#00D2FF', marginBottom: '0.2rem' }}>
            Q: "Why was payout SET-88412 ₹48,272.80?"
          </div>
          <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={12} /> PROVED: 52k − MDR − GST − Refund
          </div>
        </div>
      ),
      metricLabel: 'RESPONSE LATENCY',
      metricValue: '<550ms NATURAL Q&A',
    },
    {
      id: 'cash_forecast' as AppView,
      title: '30-Day Cash Forecaster',
      subtitle: 'Predictive working capital projections & cycle models',
      icon: <TrendingUp size={22} color="#10B981" />,
      color: '#10B981',
      preview: (
        <div style={{ width: '100%', height: '36px', display: 'flex', alignItems: 'center' }}>
          <svg width="100%" height="32" viewBox="0 0 100 32" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 0 26 Q 25 8 50 16 T 100 4 L 100 32 L 0 32 Z" fill="url(#chartGrad)" />
            <path d="M 0 26 Q 25 8 50 16 T 100 4" fill="none" stroke="#10B981" strokeWidth="2.5" />
          </svg>
        </div>
      ),
      metricLabel: 'FORECAST ACCURACY',
      metricValue: '99.4% LIQUIDITY CORRIDOR',
    },
    {
      id: 'data_hub' as AppView,
      title: 'Data Hub & Ingestion',
      subtitle: 'Multi-format synthetic benchmarks & feed connectors',
      icon: <Database size={22} color="#00D2FF" />,
      color: '#00D2FF',
      preview: (
        <div style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', marginBottom: '0.2rem' }}>
            <span>HDFC • ICICI • RAZORPAY • SAP</span>
            <span style={{ color: '#00D2FF' }}>ACTIVE</span>
          </div>
          <div style={{ color: '#10B981' }}>
            53 SYNTHETIC BENCHMARK VECTORS LOADED
          </div>
        </div>
      ),
      metricLabel: 'INGESTION ENGINE',
      metricValue: 'ZERO DATA LOSS',
    },
    {
      id: 'gaap_audit' as AppView,
      title: 'GAAP Audit Statement',
      subtitle: 'Boardroom-ready balance sheet proof & SHA-256 hashes',
      icon: <FileText size={22} color="#F59E0B" />,
      color: '#F59E0B',
      preview: (
        <div style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
          <div style={{ color: '#F59E0B', marginBottom: '0.2rem' }}>
            SHA-256: e88f413d9a...d720c4
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10B981' }}>
            <CheckCircle2 size={12} /> BIG 4 AUDIT COMPLIANT
          </div>
        </div>
      ),
      metricLabel: 'AUDIT STANDARD',
      metricValue: 'US GAAP & IFRS 15',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.75rem',
      }}
    >
      {modules.map((mod) => (
        <motion.div
          key={mod.id}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={() => onSelectModule(mod.id)}
          style={{
            background: 'linear-gradient(180deg, rgba(12, 16, 30, 0.95) 0%, rgba(6, 8, 16, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            padding: '2rem',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Top Accent Highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '15%',
              right: '15%',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)`,
            }}
          />

          <div>
            {/* Icon Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: `${mod.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${mod.color}35`,
                  boxShadow: `0 0 15px ${mod.color}25`,
                }}
              >
                {mod.icon}
              </div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8E8E93',
                  transition: 'all 0.2s',
                }}
              >
                <ArrowUpRight size={18} />
              </div>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
              {mod.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
              {mod.subtitle}
            </p>
          </div>

          <div>
            {/* Live Micro-Preview Panel */}
            <div
              style={{
                background: '#04060C',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1.25rem',
                minHeight: '62px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {mod.preview}
            </div>

            {/* Bottom Key Metric Strip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              <span style={{ color: '#8E8E93' }}>{mod.metricLabel}</span>
              <span style={{ color: mod.color, fontWeight: 900 }}>{mod.metricValue}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
