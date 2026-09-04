import React, { useState } from 'react';
import { TrendingUp, Sliders, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { FinancialDataset } from '../../types/finance';

interface CashForecasterViewProps {
  reconciledCashINR: number;
  activeDataset?: FinancialDataset;
}

export const CashForecasterView: React.FC<CashForecasterViewProps> = ({ 
  reconciledCashINR,
  activeDataset 
}) => {
  const [payoutDelayDays, setPayoutDelayDays] = useState(0);
  const [refundSurgePct, setRefundSurgePct] = useState(0);
  const [fxShockPct, setFxShockPct] = useState(0);

  // Derive average daily transaction inflow dynamically from dataset financial volume
  const totalGrossInflow = activeDataset?.gatewayRecords.reduce((s, g) => s + g.grossAmount, 0) || 0;
  const estimatedDailyInflow = totalGrossInflow > 0 
    ? Math.round(totalGrossInflow / 7) 
    : 12500;
  const estimatedPayoutChunk = Math.round(estimatedDailyInflow * 2);

  // Generate 30-day forecasting vector based on reconciled cash & scenario sliders
  const forecastData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const baseDailyCash = reconciledCashINR + day * estimatedDailyInflow;
    const delayDeduction = day <= payoutDelayDays ? estimatedPayoutChunk : 0;
    const refundImpact = (baseDailyCash * (refundSurgePct / 100)) * 0.15;
    const fxImpact = (baseDailyCash * (fxShockPct / 100)) * 0.05;

    const projectedCash = Math.max(0, baseDailyCash - delayDeduction - refundImpact - fxImpact);

    return {
      day: `D${day}`,
      baseCash: Math.round(baseDailyCash),
      projectedCash: Math.round(projectedCash),
    };
  });

  const finalDayProjected = forecastData[29].projectedCash;
  const isStressWarning = payoutDelayDays > 3 || refundSurgePct > 10 || fxShockPct > 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        className="terminal-panel"
        style={{
          padding: '1.35rem 1.6rem',
          background: 'linear-gradient(135deg, rgba(19, 26, 48, 0.75) 0%, rgba(8, 11, 22, 0.85) 100%)',
          border: '1px solid rgba(245, 208, 97, 0.25)',
          borderLeft: '4px solid #F5D061',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(245, 208, 97, 0.12)',
              border: '1px solid rgba(245, 208, 97, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F5D061',
              boxShadow: '0 0 12px rgba(245, 208, 97, 0.25)',
            }}
          >
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                30-Day Forward Cash Forecaster & Liquidity Sandbox
              </h2>
              <span
                className="badge"
                style={{
                  background: 'rgba(12, 140, 233, 0.1)',
                  border: '1px solid rgba(12, 140, 233, 0.35)',
                  color: '#38BDF8',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                <ShieldCheck size={11} style={{ marginRight: '0.25rem' }} />
                TREASURY INTELLIGENCE
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Real-time rolling cash flow projection combining 3-way verified bank cash, expected gateway payouts, and scenario stress testing.
            </p>
          </div>
        </div>
      </div>

      {/* Control Sliders & Projection Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Sliders Card */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.6rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.35rem',
            background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.9) 0%, rgba(5, 7, 15, 0.95) 100%)',
            border: '1px solid rgba(229, 184, 105, 0.22)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(229, 184, 105, 0.16)', paddingBottom: '0.85rem' }}>
            <Sliders size={18} color="#F5D061" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>Scenario Stress Testing Sliders</h3>
          </div>

          {/* Slider 1: Payout Delay */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Gateway Payout Delay:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: '#F5D061' }}>
                +{payoutDelayDays} Days (T+{payoutDelayDays})
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={7}
              step={1}
              value={payoutDelayDays}
              onChange={e => setPayoutDelayDays(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#F5D061' }}
            />
          </div>

          {/* Slider 2: Refund Spike */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Customer Refund Surge Spike:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: refundSurgePct > 0 ? '#F43F5E' : '#F5D061' }}>
                +{refundSurgePct}% Surge
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={refundSurgePct}
              onChange={e => setRefundSurgePct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#F43F5E' }}
            />
          </div>

          {/* Slider 3: FX Volatility */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Foreign Currency FX Volatility Shock:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: '#38BDF8' }}>
                −{fxShockPct}% Rate Drop
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={fxShockPct}
              onChange={e => setFxShockPct(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8' }}
            />
          </div>
        </div>

        {/* Stress Result Summary Card */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.6rem',
            background: isStressWarning
              ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(12, 16, 30, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(245, 208, 97, 0.08) 0%, rgba(12, 16, 30, 0.95) 100%)',
            border: isStressWarning ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid rgba(245, 208, 97, 0.3)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              {isStressWarning ? <AlertTriangle size={22} color="#F43F5E" /> : <ShieldCheck size={22} color="#10B981" />}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isStressWarning ? '#F43F5E' : '#F5D061' }}>
                {isStressWarning ? 'Liquidity Risk Alert: Stress Shock Applied' : 'Optimal Treasury Runway'}
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
              Projected 30-day cash position based on active stress parameters and rolling daily inflows.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(5, 7, 15, 0.85)',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid rgba(229, 184, 105, 0.2)',
              marginTop: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#E5B869', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
              DAY 30 PROJECTED NET CASH
            </span>
            <div className="font-mono data-flicker" style={{ fontSize: '1.9rem', fontWeight: 800, color: isStressWarning ? '#F43F5E' : '#FFFFFF', marginTop: '0.25rem' }}>
              ₹{finalDayProjected.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
              RESERVE STABILITY: <strong style={{ color: isStressWarning ? '#F43F5E' : '#10B981' }}>{isStressWarning ? 'ELEVATED RISK' : 'SOLVENT'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div
        className="terminal-panel"
        style={{
          padding: '1.6rem',
          background: 'linear-gradient(180deg, rgba(12, 16, 30, 0.88) 0%, rgba(5, 7, 15, 0.95) 100%)',
          border: '1px solid rgba(229, 184, 105, 0.22)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
            30-Day Rolling Cash Trajectory (Reconciled vs Stress Projected)
          </h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#F5D061' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F5D061' }} />
              Baseline Reconciled
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38BDF8' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8' }} />
              Stress Projected
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '340px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5D061" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F5D061" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} fontFamily="var(--font-mono)" />
              <YAxis stroke="#64748B" fontSize={11} fontFamily="var(--font-mono)" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(5, 7, 17, 0.95)',
                  border: '1px solid rgba(229, 184, 105, 0.3)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                }}
                formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Cash']}
              />
              <Area type="monotone" dataKey="baseCash" stroke="#F5D061" strokeWidth={2} fillOpacity={1} fill="url(#baseGradient)" name="Baseline Reconciled Cash" />
              <Area type="monotone" dataKey="projectedCash" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#projectedGradient)" name="Stress Projected Cash" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
