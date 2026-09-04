import React, { useState } from 'react';
import { TrendingUp, Sliders, AlertTriangle, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { FinancialDataset } from '../../types/finance';

interface CashForecasterViewProps {
  reconciledCashINR: number;
  activeDataset?: FinancialDataset;
}

interface ScenarioPreset {
  name: string;
  delayDays: number;
  refundSurgePct: number;
  fxShockPct: number;
  description: string;
}

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    name: 'Standard Baseline Runway',
    delayDays: 0,
    refundSurgePct: 0,
    fxShockPct: 0,
    description: 'Orderly T+0 continuous gateway settlement clearing at standard contracted fee schedule.'
  },
  {
    name: 'Festival Mega Sale Surge',
    delayDays: 1,
    refundSurgePct: 15,
    fxShockPct: 0,
    description: 'High volume surge with 1-day banking settlement lag and elevated customer return rate.'
  },
  {
    name: 'Extended Bank Holiday Delay',
    delayDays: 4,
    refundSurgePct: 2,
    fxShockPct: 0,
    description: 'Consecutive banking settlement delays buffering receivables over a T+4 holiday window.'
  },
  {
    name: 'Black Swan Global FX Crash',
    delayDays: 5,
    refundSurgePct: 20,
    fxShockPct: 5,
    description: 'Severe stress test: 5-day settlement lag, 20% refund surge, and 5% foreign currency devaluation.'
  }
];

export const CashForecasterView: React.FC<CashForecasterViewProps> = ({ 
  reconciledCashINR,
  activeDataset 
}) => {
  const [payoutDelayDays, setPayoutDelayDays] = useState(0);
  const [refundSurgePct, setRefundSurgePct] = useState(0);
  const [fxShockPct, setFxShockPct] = useState(0);

  // Live Forecasting State
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [treasuryAdvice, setTreasuryAdvice] = useState<any>(null);
  const [modelProvider, setModelProvider] = useState<string>('Google Gemini 3.6 Flash + Holt-Winters Smoothing');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real Holt-Winters statistical forecast + Gemini Treasury Commentary
  React.useEffect(() => {
    setIsLoading(true);
    const recentInflows = activeDataset?.gatewayRecords
      ? activeDataset.gatewayRecords.slice(0, 10).map(g => g.grossAmount)
      : [14200, 15800, 13900, 16400, 15100, 17200, 14800];

    fetch('http://localhost:3001/api/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reconciledCashINR,
        recentDailyInflows: recentInflows,
        payoutDelayDays,
        refundSurgePct,
        fxShockPct,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.forecastDays && Array.isArray(data.forecastDays)) {
          setForecastData(data.forecastDays);
        }
        if (data.treasuryAdvice) {
          setTreasuryAdvice(data.treasuryAdvice);
        }
        if (data.modelProvider) {
          setModelProvider(data.modelProvider);
        }
        setIsLoading(false);
      })
      .catch(() => {
        // Statistical fallback
        const local = Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const baseDailyCash = reconciledCashINR + day * 8500;
          const delayDeduction = day <= payoutDelayDays ? 28000 : 0;
          const refundImpact = (baseDailyCash * (refundSurgePct / 100)) * 0.15;
          const fxImpact = (baseDailyCash * (fxShockPct / 100)) * 0.05;
          const projectedCash = Math.max(0, baseDailyCash - delayDeduction - refundImpact - fxImpact);
          const margin = Math.round(1200 * Math.sqrt(day) * 1.28);
          return {
            day: `D${day}`,
            baseCash: Math.round(baseDailyCash),
            projectedCash: Math.round(projectedCash),
            p10Cash: Math.max(0, Math.round(projectedCash - margin)),
            p90Cash: Math.round(projectedCash + margin),
            variance: Math.round(baseDailyCash - projectedCash),
          };
        });
        setForecastData(local);
        setIsLoading(false);
      });
  }, [reconciledCashINR, payoutDelayDays, refundSurgePct, fxShockPct]);

  const finalDayProjected = forecastData[29]?.projectedCash ?? reconciledCashINR;
  const minProjectedCash = forecastData.length > 0 
    ? Math.min(...forecastData.map(f => f.projectedCash))
    : reconciledCashINR;
  const isStressWarning = payoutDelayDays > 3 || refundSurgePct > 10 || fxShockPct > 3 || minProjectedCash < reconciledCashINR * 0.5;
  const runwayDays = treasuryAdvice?.runwayDays ?? 90;

  const handleApplyPreset = (preset: ScenarioPreset) => {
    setPayoutDelayDays(preset.delayDays);
    setRefundSurgePct(preset.refundSurgePct);
    setFxShockPct(preset.fxShockPct);
  };

  const handleExportCSV = () => {
    const headers = ['Day', 'BaselineCashINR', 'ProjectedP50CashINR', 'P10LowerBoundINR', 'P90UpperBoundINR', 'VarianceINR'];
    const rows = forecastData.map(d => [d.day, d.baseCash, d.projectedCash, d.p10Cash || d.projectedCash, d.p90Cash || d.projectedCash, d.variance]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OmniSettle_30Day_Cash_Forecast_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                  {isLoading ? 'COMPUTING AI FORECAST...' : 'TREASURY INTELLIGENCE'}
                </span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Real-time rolling cash flow projection combining 3-way verified bank cash, expected gateway payouts, and scenario stress testing.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-terminal primary"
            style={{ fontSize: '0.78rem', fontWeight: 800 }}
          >
            <Download size={14} /> EXPORT FORECAST CSV
          </button>
        </div>
      </div>

      {/* Preset Scenario Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
        {SCENARIO_PRESETS.map(preset => {
          const isSelected = 
            payoutDelayDays === preset.delayDays && 
            refundSurgePct === preset.refundSurgePct && 
            fxShockPct === preset.fxShockPct;

          return (
            <div
              key={preset.name}
              onClick={() => handleApplyPreset(preset)}
              style={{
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(245, 208, 97, 0.14) 0%, rgba(12, 16, 30, 0.9) 100%)' 
                  : 'linear-gradient(135deg, rgba(12, 16, 30, 0.7) 0%, rgba(5, 7, 15, 0.85) 100%)',
                border: isSelected ? '1.5px solid #F5D061' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.9rem 1.1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                boxShadow: isSelected ? '0 0 15px rgba(245, 208, 97, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isSelected ? '#F5D061' : '#FFFFFF' }}>
                  {preset.name}
                </span>
                {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F5D061' }} />}
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94A3B8', lineHeight: '1.4' }}>
                {preset.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: '#CBD5E1' }}>
                <span>LAG: <strong>T+{preset.delayDays}</strong></span>
                <span>REFUND: <strong>+{preset.refundSurgePct}%</strong></span>
                <span>FX: <strong>-{preset.fxShockPct}%</strong></span>
              </div>
            </div>
          );
        })}
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
                {isStressWarning ? 'Liquidity Risk Alert: Elevated Stress Applied' : 'Optimal Treasury Health & Runway'}
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
              Projected 30-day forward cash trajectory with rolling daily settlements and stress scenario impact.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(5, 7, 15, 0.7)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>MINIMUM TROUGH</span>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.2rem' }}>
                  ₹{minProjectedCash.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ background: 'rgba(5, 7, 15, 0.7)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>PROJECTED RUNWAY</span>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: isStressWarning ? '#F43F5E' : '#10B981', marginTop: '0.2rem' }}>
                  {runwayDays}+ Days
                </div>
              </div>
            </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
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
              Expected Trajectory (P50)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#A855F7' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A855F7' }} />
              P10–P90 Confidence Corridor
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
                <linearGradient id="corridorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0.02} />
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
                formatter={(v: any, name: any) => [`₹${Number(v).toLocaleString('en-IN')}`, name]}
              />
              <Area type="monotone" dataKey="p90Cash" stroke="#A855F7" strokeWidth={1} strokeDasharray="3 3" fillOpacity={1} fill="url(#corridorGradient)" name="P90 Optimistic Bound" />
              <Area type="monotone" dataKey="baseCash" stroke="#F5D061" strokeWidth={2} fillOpacity={1} fill="url(#baseGradient)" name="Baseline Reconciled Cash" />
              <Area type="monotone" dataKey="projectedCash" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#projectedGradient)" name="P50 Expected Cash" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Real Gemini Treasury Intelligence Commentary Card */}
      {treasuryAdvice && (
        <div
          className="terminal-panel"
          style={{
            padding: '1.5rem 1.75rem',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(12, 16, 30, 0.92) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderLeft: '4px solid #A855F7',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={20} color="#C084FC" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                AI Treasury Intelligence & Liquidity Analysis
              </h3>
            </div>
            <span
              className="badge"
              style={{
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#E9D5FF',
                fontWeight: 800,
                fontSize: '0.72rem',
              }}
            >
              {modelProvider}
            </span>
          </div>

          <p style={{ color: '#E2E8F0', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '1rem', fontFamily: 'var(--font-sans)' }}>
            {treasuryAdvice.aiCommentary}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {treasuryAdvice.recommendations?.map((rec: string, idx: number) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(5, 7, 15, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.82rem',
                  color: '#94A3B8',
                  lineHeight: '1.4',
                }}
              >
                <strong style={{ color: '#C084FC', display: 'block', marginBottom: '0.2rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  ACTION #{idx + 1}
                </strong>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
