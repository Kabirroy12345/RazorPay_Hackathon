import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface AnomalyBlip {
  id: string;
  type: string;
  source: string;
  discrepancy: string;
  angleDeg: number;
  radiusRatio: number; // 0 to 1 distance from center
  color: string;
  cause: string;
  payload: string;
  actionText: string;
}

interface SonarExceptionRadarProps {
  onRemediate: () => void;
}

export const SonarExceptionRadar: React.FC<SonarExceptionRadarProps> = ({ onRemediate }) => {
  const [selectedBlipId, setSelectedBlipId] = useState<string>('EXC-FEE-402');

  const anomalies: AnomalyBlip[] = [
    {
      id: 'EXC-FEE-402',
      type: 'FEE OVERCHARGE',
      source: 'Payment Gateway',
      discrepancy: '₹142.50 shortfall',
      angleDeg: 45,
      radiusRatio: 0.65,
      color: '#EC4899',
      cause: 'Gateway billed 3.50% fee tier instead of contracted 2.00% rate on batch SET-88412.',
      payload: '{"batchId": "SET-88412", "expectedFee": 1040, "chargedFee": 1182.50, "delta": -142.50}',
      actionText: 'DISPATCH RECLAMATION NOTICE TO GATEWAY OPS',
    },
    {
      id: 'EXC-DUP-109',
      type: 'DUPLICATE DEDUCTION',
      source: 'Bank Statement',
      discrepancy: '₹4,900.00 duplicate debit',
      angleDeg: 140,
      radiusRatio: 0.82,
      color: '#EF4444',
      cause: 'Two identical settlement debits detected on same reference ID TXN-9982 within 4 minutes.',
      payload: '{"referenceId": "TXN-9982", "firstDebit": "14:02:11Z", "secondDebit": "14:06:03Z"}',
      actionText: 'FLAG DUPLICATE TO TREASURY OPERATIONS',
    },
    {
      id: 'EXC-MIS-883',
      type: 'MISSING SETTLEMENT',
      source: 'ERP Ledger',
      discrepancy: '₹12,400.00 uncredited',
      angleDeg: 215,
      radiusRatio: 0.72,
      color: '#F59E0B',
      cause: 'Invoice INV-2026-883 marked settled in ERP but no bank credit or gateway payout was found.',
      payload: '{"invoiceId": "INV-2026-883", "erpStatus": "PAID", "bankMatch": null}',
      actionText: 'HOLD RECO ENTRY & REQUEST GATEWAY AUDIT',
    },
    {
      id: 'EXC-FX-301',
      type: 'AMOUNT MISMATCH',
      source: 'Multi-Currency Gateway',
      discrepancy: '₹450.00 FX variance',
      angleDeg: 290,
      radiusRatio: 0.52,
      color: '#A855F7',
      cause: 'USD Wire rate fluctuation exceeded allowable ±0.50% corridor (actual variance: 1.12%).',
      payload: '{"baseCurrency": "USD", "settlementINR": 83250, "expectedINR": 82800}',
      actionText: 'FORWARD TO FX RISK DESK FOR CORRIDOR SIGN-OFF',
    },
    {
      id: 'EXC-AMB-504',
      type: 'AMBIGUOUS MATCH',
      source: '3-Way Vector Space',
      discrepancy: '2 identical candidates',
      angleDeg: 345,
      radiusRatio: 0.40,
      color: '#00D2FF',
      cause: 'Two separate orders share identical ₹5,000 amount and customer name without unique reference.',
      payload: '{"candidates": ["INV-BUN-07", "INV-BUN-08"], "amount": 5000, "customer": "Apex Solutions"}',
      actionText: 'ROUTE TO CONTROLLER REVIEW QUEUE',
    },
  ];

  const selectedAnomaly = anomalies.find((a) => a.id === selectedBlipId) || anomalies[0];

  return (
    <div style={{ width: '100%' }}>
      {/* Radar Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 440px) 1fr',
          gap: '2.5rem',
          background: 'rgba(11, 15, 25, 0.92)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(239, 68, 68, 0.15)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: 360-Degree Sonar Radar Visual */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(15, 20, 35, 0.95) 0%, rgba(7, 8, 14, 0.95) 100%)',
              border: '2px solid rgba(0, 210, 255, 0.3)',
              boxShadow: '0 0 40px rgba(0, 210, 255, 0.15), inset 0 0 30px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
            }}
          >
            {/* Range Rings */}
            <div style={{ position: 'absolute', inset: '15%', borderRadius: '50%', border: '1px dashed rgba(0, 210, 255, 0.2)' }} />
            <div style={{ position: 'absolute', inset: '35%', borderRadius: '50%', border: '1px dashed rgba(0, 210, 255, 0.25)' }} />
            <div style={{ position: 'absolute', inset: '55%', borderRadius: '50%', border: '1px dashed rgba(0, 210, 255, 0.3)' }} />

            {/* Radar Crosshairs */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0, 210, 255, 0.2)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(0, 210, 255, 0.2)' }} />

            {/* 360-Degree Sweeping Beam */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transformOrigin: 'center center',
                background: 'conic-gradient(from 0deg, rgba(0, 210, 255, 0.35) 0deg, rgba(0, 210, 255, 0) 60deg)',
                pointerEvents: 'none',
              }}
            />

            {/* Plotted Pulsing Anomaly Blips */}
            {anomalies.map((a) => {
              const rad = (a.angleDeg * Math.PI) / 180;
              const r = a.radiusRatio * 140; // Max radius ~140px
              const x = 160 + r * Math.cos(rad);
              const y = 160 + r * Math.sin(rad);
              const isSelected = selectedBlipId === a.id;

              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedBlipId(a.id)}
                  style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 20,
                  }}
                >
                  {/* Blip Outer Halo */}
                  <motion.div
                    animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      inset: '-6px',
                      borderRadius: '50%',
                      border: `1.5px solid ${a.color}`,
                    }}
                  />

                  {/* Blip Center Dot */}
                  <div
                    style={{
                      width: isSelected ? '14px' : '10px',
                      height: isSelected ? '14px' : '10px',
                      borderRadius: '50%',
                      background: a.color,
                      boxShadow: `0 0 12px ${a.color}`,
                      border: '2px solid #FFFFFF',
                      transition: 'all 0.2s ease',
                    }}
                  />

                  {isSelected && (
                    <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: a.color, fontWeight: 900, background: '#000', padding: '0.15rem 0.35rem', borderRadius: '3px', border: `1px solid ${a.color}` }}>
                      {a.id}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
            <span>360° TRIAGE RADAR ACTIVE • 5 ANOMALIES TRACKED</span>
          </div>
        </div>

        {/* Right Column: Selected Anomaly Diagnostic HUD */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: selectedAnomaly.color, fontWeight: 800 }}>
                LOCKED TARGET // {selectedAnomaly.id}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', margin: '0.25rem 0 0' }}>
                {selectedAnomaly.type}
              </h3>
            </div>

            <div style={{ background: '#07080E', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93' }}>
              DETECTED: <strong style={{ color: '#EDEDED' }}>{selectedAnomaly.source}</strong>
            </div>
          </div>

          <div style={{ background: '#07080E', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.2rem' }}>
              DISCREPANCY MAGNITUDE:
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 900, color: selectedAnomaly.color }}>
              {selectedAnomaly.discrepancy}
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#EDEDED', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            <strong>Diagnostic Breakdown:</strong> {selectedAnomaly.cause}
          </p>

          <div style={{ background: '#07080E', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93', marginBottom: '0.25rem' }}>
              ISOLATED EXCEPTION PAYLOAD:
            </div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: selectedAnomaly.color }}>
              {selectedAnomaly.payload}
            </code>
          </div>

          <button
            onClick={onRemediate}
            style={{
              background: selectedAnomaly.color,
              color: '#000000',
              border: 'none',
              borderRadius: '6px',
              padding: '0.8rem 1.6rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: `0 0 25px ${selectedAnomaly.color}44`,
            }}
          >
            {selectedAnomaly.actionText} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
