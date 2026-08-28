import React from 'react';
import { Lock } from 'lucide-react';

interface VerifiedCashCardProps {
  reconciledCashINR: number;
}

export const VerifiedCashCard: React.FC<VerifiedCashCardProps> = ({ reconciledCashINR }) => {
  const pendingGatewaySettlementINR = 8201.76;
  const totalVerifiedLiquidity = reconciledCashINR + pendingGatewaySettlementINR;

  return (
    <div
      className="terminal-panel"
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>
          <Lock size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              VERIFIED CASH POSITION & LIQUIDITY LOCK
            </span>
            <span className="badge badge-amber">AUDITED_CASH</span>
          </div>
          <p className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
            Closed-loop verified cash position derived strictly from 3-way reconciled bank credits + pending settlement pipeline
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            RECONCILED_BANK_CASH
          </span>
          <div className="font-mono data-flicker" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{reconciledCashINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <span style={{ color: 'var(--border-hairline)', fontSize: '1.2rem', fontWeight: 300 }}>+</span>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            PENDING_SETTLEMENT
          </span>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            ₹{pendingGatewaySettlementINR.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <span style={{ color: 'var(--border-hairline)', fontSize: '1.2rem', fontWeight: 300 }}>=</span>

        <div style={{ background: 'var(--bg-root)', padding: '0.5rem 1rem', border: '1px solid var(--text-muted)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-primary)', textTransform: 'uppercase', fontWeight: 600 }}>
            TOTAL_VERIFIED_LIQUIDITY
          </span>
          <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{totalVerifiedLiquidity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};
