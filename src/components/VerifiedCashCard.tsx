import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface VerifiedCashCardProps {
  reconciledCashINR: number;
  pendingSettlementINR?: number;
}

export const VerifiedCashCard: React.FC<VerifiedCashCardProps> = ({ 
  reconciledCashINR,
  pendingSettlementINR = 0
}) => {
  const pendingGatewaySettlementINR = pendingSettlementINR;
  const totalVerifiedLiquidity = reconciledCashINR + pendingGatewaySettlementINR;

  return (
    <div
      className="terminal-panel"
      style={{
        padding: '1.4rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.09) 0%, rgba(12, 16, 30, 0.88) 55%, rgba(12, 140, 233, 0.07) 100%)',
        border: '1px solid rgba(245, 208, 97, 0.32)',
        borderRadius: '10px',
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(245, 208, 97, 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(12, 140, 233, 0.2) 0%, rgba(12, 140, 233, 0.05) 100%)',
            border: '1px solid rgba(12, 140, 233, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38BDF8',
            boxShadow: '0 0 15px rgba(12, 140, 233, 0.25)',
          }}
        >
          <ShieldCheck size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
              TREASURY & VERIFIED CASH POSITION
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                fontWeight: 800,
                color: '#10B981',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                padding: '0.15rem 0.5rem',
                borderRadius: '3px',
                letterSpacing: '0.08em',
              }}
            >
              GAAP_AUDITED
            </span>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.3rem', fontFamily: 'var(--font-sans)' }}>
            Closed-loop verified cash position derived strictly from 3-way reconciled bank credits + pending settlement float.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            RECONCILED_BANK_CASH
          </span>
          <div className="font-mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
            ₹{reconciledCashINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <span style={{ color: 'rgba(245, 208, 97, 0.4)', fontSize: '1.4rem', fontWeight: 300 }}>+</span>

        <div>
          <span style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            PENDING_SETTLEMENT
          </span>
          <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38BDF8', marginTop: '0.2rem' }}>
            ₹{pendingGatewaySettlementINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <span style={{ color: 'rgba(245, 208, 97, 0.4)', fontSize: '1.4rem', fontWeight: 300 }}>=</span>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 208, 97, 0.16) 0%, rgba(12, 16, 30, 0.95) 100%)',
            padding: '0.65rem 1.25rem',
            border: '1.5px solid rgba(245, 208, 97, 0.5)',
            borderRadius: '6px',
            boxShadow: '0 4px 20px rgba(245, 208, 97, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
            <Sparkles size={13} color="#F5D061" />
            <span style={{ fontSize: '0.68rem', color: '#F5D061', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              TOTAL_VERIFIED_LIQUIDITY
            </span>
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#FFE082',
              textShadow: '0 0 16px rgba(245, 208, 97, 0.5)',
            }}
          >
            ₹{totalVerifiedLiquidity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};
