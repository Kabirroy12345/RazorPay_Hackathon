import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, CreditCard, FileSpreadsheet, AlertTriangle, RefreshCw } from 'lucide-react';

export const BottleneckVisual: React.FC = () => {
  const [delayDays, setDelayDays] = useState<number>(2);
  const [feeRate, setFeeRate] = useState<number>(2.0);
  const [unmatchedVolume, setUnmatchedVolume] = useState<number>(142500);

  // Dynamic discrepancy calculation
  const feeVariance = ((feeRate - 2.0) * 52000) / 100;
  const timingDelayHours = delayDays * 24;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Interactive Discrepancy Simulator Controls */}
      <div
        style={{
          background: 'rgba(11, 15, 25, 0.92)',
          border: '1px solid rgba(0, 210, 255, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 210, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', fontWeight: 800 }}>
              LIVE SPREADSHEET BOTTLENECK SIMULATOR
            </div>
            <div style={{ fontSize: '0.82rem', color: '#8E8E93', marginTop: '0.2rem' }}>
              Adjust variables to watch disconnected silos fall out of sync in real-time
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Timing Delay Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
              <span>BANK SETTLEMENT LAG:</span>
              <strong style={{ color: '#00D2FF' }}>T+{delayDays} ({timingDelayHours}h)</strong>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={delayDays}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setDelayDays(v);
                setUnmatchedVolume(85000 + v * 28750);
              }}
              style={{ width: '150px', accentColor: '#00D2FF', cursor: 'pointer' }}
            />
          </div>

          {/* Gateway Fee Variance Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
              <span>GATEWAY MDR RATE:</span>
              <strong style={{ color: '#EC4899' }}>{feeRate.toFixed(1)}%</strong>
            </div>
            <input
              type="range"
              min="1.5"
              max="3.5"
              step="0.5"
              value={feeRate}
              onChange={(e) => setFeeRate(parseFloat(e.target.value))}
              style={{ width: '150px', accentColor: '#EC4899', cursor: 'pointer' }}
            />
          </div>

          {/* Unreconciled Impact Stat */}
          <div style={{ background: '#07080E', padding: '0.55rem 1rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#EF4444', fontWeight: 800 }}>
              UNRECONCILED EXPOSURE:
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
              ₹{unmatchedVolume.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Severed Silo Circuit Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          position: 'relative',
        }}
      >
        {/* Silo 1: Bank Core */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'rgba(11, 15, 25, 0.88)',
            border: '1px solid rgba(0, 210, 255, 0.35)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} color="#00D2FF" />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#00D2FF', background: 'rgba(0, 210, 255, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
              SILO 01 // BANK
            </span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.6rem' }}>
            Lump-Sum Batches
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Only registers lump-sum payouts clearing after banking cutoffs. Completely blind to transaction-level fee deductions and customer identities.
          </p>

          <div style={{ background: '#07080E', padding: '0.85rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            <div style={{ color: '#8E8E93', marginBottom: '0.25rem' }}>RECORDED CREDITS:</div>
            <div style={{ color: '#FFFFFF', fontWeight: 700 }}>₹48,272.80 (DELAYED T+{delayDays})</div>
            <div style={{ color: delayDays > 0 ? '#EF4444' : '#10B981', marginTop: '0.2rem', fontSize: '0.65rem' }}>
              {delayDays > 0 ? `⚠ PENDING CLEARING (${timingDelayHours}h BEHIND)` : '✓ SAME-DAY SETTLED'}
            </div>
          </div>
        </motion.div>

        {/* Silo 2: Payment Gateway */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{
            background: 'rgba(15, 12, 28, 0.88)',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={22} color="#EC4899" />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#EC4899', background: 'rgba(236, 72, 153, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              SILO 02 // GATEWAY
            </span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.6rem' }}>
            Blended Deductions
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Combines multi-order settlements while stripping variable merchant discount rates (MDR), GST surcharges, and chargeback holds.
          </p>

          <div style={{ background: '#07080E', padding: '0.85rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            <div style={{ color: '#8E8E93', marginBottom: '0.25rem' }}>MDR + TAX APPLIED:</div>
            <div style={{ color: '#EC4899', fontWeight: 700 }}>-₹{(1040 + feeVariance).toFixed(2)} ({feeRate}% Tier)</div>
            <div style={{ color: feeVariance !== 0 ? '#EF4444' : '#10B981', marginTop: '0.2rem', fontSize: '0.65rem' }}>
              {feeVariance !== 0 ? `⚠ RATE VARIANCE (₹${Math.abs(feeVariance).toFixed(2)})` : '✓ EXACT CONTRACTED 2.0%'}
            </div>
          </div>
        </motion.div>

        {/* Silo 3: ERP General Ledger */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            background: 'rgba(10, 22, 18, 0.88)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={22} color="#10B981" />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              SILO 03 // ERP
            </span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.6rem' }}>
            Fragmented Invoices
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Generates individual order invoices. Completely detached from payment gateway bundle settlement batch numbers and bank clearing dates.
          </p>

          <div style={{ background: '#07080E', padding: '0.85rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            <div style={{ color: '#8E8E93', marginBottom: '0.25rem' }}>CUSTOMER INVOICES:</div>
            <div style={{ color: '#10B981', fontWeight: 700 }}>8 UNLINKED INVOICES (₹52,000)</div>
            <div style={{ color: '#F59E0B', marginTop: '0.2rem', fontSize: '0.65rem' }}>
              ⚠ REQUIRES 1:N REASONING COMBINATORIAL
            </div>
          </div>
        </motion.div>
      </div>

      {/* Severed Connection Alert Banner */}
      <div
        style={{
          marginTop: '2rem',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px dashed rgba(239, 68, 68, 0.4)',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#EF4444' }}>
          <RefreshCw size={16} className="pulse-indicator" />
          <span>[SYSTEM DIAGNOSTIC]: 3 SILOS DISCONNECTED • SPREADSHEETS REQUIRE 4-8 HOURS MANUAL HUMAN TRIAGE</span>
        </div>
        <div style={{ color: '#00D2FF', fontWeight: 700 }}>
          OMNISETTLE SOLUTION: ZERO DELTA 3-WAY VERIFICATION ↓
        </div>
      </div>
    </div>
  );
};
