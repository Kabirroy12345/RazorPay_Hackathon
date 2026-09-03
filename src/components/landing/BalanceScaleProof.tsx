import React, { useState } from 'react';
import { ShieldCheck, Scale } from 'lucide-react';

export const BalanceScaleProof: React.FC = () => {
  const [includeMdr, setIncludeMdr] = useState<boolean>(true);
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  const [includeRefund, setIncludeRefund] = useState<boolean>(true);

  // Constants
  const grossAmount = 52000;
  const mdrAmount = includeMdr ? 1040 : 0;
  const gstAmount = includeGst ? 187.2 : 0;
  const refundAmount = includeRefund ? 2500 : 0;

  const calculatedNet = grossAmount - mdrAmount - gstAmount - refundAmount;
  const targetBankNet = 48272.80;
  const delta = calculatedNet - targetBankNet;
  const isBalanced = Math.abs(delta) < 0.01;

  // Scale tilt angle: 0deg when balanced, positive or negative when unbalanced
  const tiltAngle = isBalanced ? 0 : delta > 0 ? 8 : -8;

  return (
    <div style={{ width: '100%' }}>
      {/* Control Strip */}
      <div
        style={{
          background: 'rgba(11, 15, 25, 0.92)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '12px',
          padding: '1.25rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={18} color="#F59E0B" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800 }}>
              KINETIC ZERO-DELTA BALANCE SCALE
            </div>
            <div style={{ fontSize: '0.82rem', color: '#8E8E93', marginTop: '0.2rem' }}>
              Toggle deduction weights to test mathematical balance equilibrium
            </div>
          </div>
        </div>

        {/* Deduction Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => setIncludeMdr(!includeMdr)}
            style={{
              background: includeMdr ? 'rgba(236, 72, 153, 0.2)' : '#07080E',
              border: `1px solid ${includeMdr ? '#EC4899' : 'rgba(255, 255, 255, 0.1)'}`,
              color: includeMdr ? '#EC4899' : '#8E8E93',
              borderRadius: '6px',
              padding: '0.45rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            {includeMdr ? '✓ 2% MDR (-₹1,040)' : '+ 2% MDR'}
          </button>

          <button
            onClick={() => setIncludeGst(!includeGst)}
            style={{
              background: includeGst ? 'rgba(168, 85, 247, 0.2)' : '#07080E',
              border: `1px solid ${includeGst ? '#A855F7' : 'rgba(255, 255, 255, 0.1)'}`,
              color: includeGst ? '#A855F7' : '#8E8E93',
              borderRadius: '6px',
              padding: '0.45rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            {includeGst ? '✓ 18% GST (-₹187.20)' : '+ 18% GST'}
          </button>

          <button
            onClick={() => setIncludeRefund(!includeRefund)}
            style={{
              background: includeRefund ? 'rgba(245, 158, 11, 0.2)' : '#07080E',
              border: `1px solid ${includeRefund ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)'}`,
              color: includeRefund ? '#F59E0B' : '#8E8E93',
              borderRadius: '6px',
              padding: '0.45rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            {includeRefund ? '✓ REFUND (-₹2,500)' : '+ REFUND'}
          </button>
        </div>
      </div>

      {/* 3D Animated Scale Visual */}
      <div
        style={{
          background: '#0A0C16',
          border: `2px solid ${isBalanced ? '#10B981' : '#EF4444'}`,
          borderRadius: '12px',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: isBalanced 
            ? '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.2)' 
            : '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(239, 68, 68, 0.2)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Scale Graphic SVG */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
          <svg width="460" height="180" viewBox="0 0 460 180" style={{ overflow: 'visible', maxWidth: '100%' }}>
            {/* Center Pillar */}
            <polygon points="220,170 240,170 232,50 228,50" fill="#2A2F45" />
            <circle cx="230" cy="50" r="10" fill={isBalanced ? '#10B981' : '#F59E0B'} />

            {/* Tilting Beam */}
            <g transform={`rotate(${tiltAngle} 230 50)`} style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {/* Beam Bar */}
              <line x1="50" y1="50" x2="410" y2="50" stroke={isBalanced ? '#10B981' : '#EF4444'} strokeWidth="5" strokeLinecap="round" />

              {/* Left Pan Strings & Pan (Bank Net) */}
              <line x1="80" y1="50" x2="60" y2="120" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="80" y1="50" x2="100" y2="120" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 50 120 Q 80 135 110 120 Z" fill="rgba(0, 210, 255, 0.2)" stroke="#00D2FF" strokeWidth="2" />

              {/* Right Pan Strings & Pan (Calculated Sum) */}
              <line x1="380" y1="50" x2="360" y2="120" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="380" y1="50" x2="400" y2="120" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 350 120 Q 380 135 410 120 Z" fill={isBalanced ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'} stroke={isBalanced ? '#10B981' : '#EF4444'} strokeWidth="2" />
            </g>

            {/* Zero-Delta Horizon Level Line */}
            <line x1="30" y1="50" x2="430" y2="50" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Pan Values & Balance Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center' }}>
          {/* Left Pan: Bank Target */}
          <div style={{ background: '#07080E', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00D2FF', marginBottom: '0.3rem' }}>
              LEFT PAN // BANK NET CREDIT
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
              ₹{targetBankNet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', marginTop: '0.25rem' }}>
              HDFC ACCT #9921 • FIXED TARGET
            </div>
          </div>

          {/* Center Equals / Delta */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 900, color: isBalanced ? '#10B981' : '#EF4444' }}>
              {isBalanced ? '==' : '≠'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: isBalanced ? '#10B981' : '#EF4444', marginTop: '0.2rem' }}>
              DELTA: {delta.toFixed(4)} INR
            </div>
          </div>

          {/* Right Pan: Calculated ERP Bundle Net */}
          <div style={{ background: '#07080E', padding: '1.25rem', borderRadius: '8px', border: `1px solid ${isBalanced ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: isBalanced ? '#10B981' : '#EF4444', marginBottom: '0.3rem' }}>
              RIGHT PAN // CALCULATED BUNDLE
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
              ₹{calculatedNet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', marginTop: '0.25rem' }}>
              Gross(52k) - MDR({mdrAmount}) - GST({gstAmount}) - Ref({refundAmount})
            </div>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div
          style={{
            marginTop: '1.5rem',
            background: isBalanced ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isBalanced ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '6px',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: isBalanced ? '#10B981' : '#EF4444' }}>
            <ShieldCheck size={16} />
            <span>
              {isBalanced 
                ? 'VERIFIED ZERO-DELTA MATCH APPROVED (0.0000 DELTA) • READY FOR GAAP RECORDING'
                : 'MATHEMATICAL DISCREPANCY DETECTED • GUARDRAILS BLOCK MISMATCHED POSTING'}
            </span>
          </div>
          <span style={{ color: '#8E8E93' }}>
            {isBalanced ? 'PRECISION: 100.0%' : 'STATUS: UNBALANCED'}
          </span>
        </div>
      </div>
    </div>
  );
};
