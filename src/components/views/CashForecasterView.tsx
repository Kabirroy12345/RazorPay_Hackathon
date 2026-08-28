import React, { useState } from 'react';
import { TrendingUp, Sliders, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CashForecasterViewProps {
  reconciledCashINR: number;
}

export const CashForecasterView: React.FC<CashForecasterViewProps> = ({ reconciledCashINR }) => {
  const [payoutDelayDays, setPayoutDelayDays] = useState(0);
  const [refundSurgePct, setRefundSurgePct] = useState(0);
  const [fxShockPct, setFxShockPct] = useState(0);

  // Generate 30-day forecasting vector based on reconciled cash & scenario sliders
  const forecastData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const baseDailyCash = reconciledCashINR + day * 12500;
    const delayDeduction = day <= payoutDelayDays ? 25000 : 0;
    const refundImpact = (baseDailyCash * (refundSurgePct / 100)) * 0.15;
    const fxImpact = (baseDailyCash * (fxShockPct / 100)) * 0.05;

    const projectedCash = Math.max(0, baseDailyCash - delayDeduction - refundImpact - fxImpact);

    return {
      day: `Day ${day}`,
      baseCash: Math.round(baseDailyCash),
      projectedCash: Math.round(projectedCash),
    };
  });

  const finalDayProjected = forecastData[29].projectedCash;
  const isStressWarning = payoutDelayDays > 3 || refundSurgePct > 10 || fxShockPct > 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div className="terminal-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
          <TrendingUp size={22} color="var(--accent-amber)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            30-Day Forward Cash Forecaster & Liquidity Stress Sandbox
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Real-time rolling cash flow projection combining 3-way reconciled bank cash, expected gateway payouts, and scenario stress testing.
        </p>
      </div>

      {/* Control Sliders & Projection Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Sliders Card */}
        <div className="terminal-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
            <Sliders size={18} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Scenario Stress Testing Sliders</h3>
          </div>

          {/* Slider 1: Payout Delay */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gateway Payout Delay:</span>
              <span className="font-mono" style={{ fontWeight: 700, color: payoutDelayDays > 0 ? 'var(--accent-amber)' : 'var(--accent-amber)' }}>
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
              style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
            />
          </div>

          {/* Slider 2: Refund Spike */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Customer Refund Surge Spike:</span>
              <span className="font-mono" style={{ fontWeight: 700, color: refundSurgePct > 0 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
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
              style={{ width: '100%', accentColor: 'var(--accent-red)' }}
            />
          </div>

          {/* Slider 3: FX Volatility */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Foreign Currency FX Volatility Shock:</span>
              <span className="font-mono" style={{ fontWeight: 700, color: fxShockPct > 0 ? 'var(--accent-amber)' : 'var(--accent-amber)' }}>
                -{fxShockPct}% Rate Drop
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={fxShockPct}
              onChange={e => setFxShockPct(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
            />
          </div>
        </div>

        {/* Stress Result Summary Card */}
        <div
          className="terminal-panel"
          style={{
            padding: '1.5rem',
            background: isStressWarning ? 'rgba(192, 82, 74, 0.1)' : 'var(--bg-root)',
            border: isStressWarning ? '1px solid var(--accent-red)' : '1px solid var(--border-hairline)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {isStressWarning ? <AlertTriangle size={20} color="var(--accent-red)" /> : <ShieldCheck size={20} color="var(--accent-amber)" />}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: isStressWarning ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                {isStressWarning ? 'Liquidity Risk Alert: Stress Shock Applied' : 'Optimal Liquidity Runway'}
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Projected 30-day cash position based on active stress parameters.
            </p>
          </div>

          <div style={{ background: 'var(--bg-root)', padding: '1rem', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Day 30 Projected Net Cash
            </span>
            <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              ₹{finalDayProjected.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="terminal-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
          30-Day Rolling Cash Trajectory (Reconciled vs Stress Projected)
        </h3>
        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="baseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D9A441" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D9A441" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A8A8A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8A8A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', color: 'var(--text-primary)' }}
                formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Cash']}
              />
              <Area type="monotone" dataKey="baseCash" stroke="#D9A441" fillOpacity={1} fill="url(#baseGradient)" name="Baseline Reconciled Cash" />
              <Area type="monotone" dataKey="projectedCash" stroke="#8A8A8A" fillOpacity={1} fill="url(#projectedGradient)" name="Stress Projected Cash" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
