import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ShieldCheck } from 'lucide-react';

interface PipelineStage {
  id: number;
  name: string;
  tagline: string;
  metric: string;
  color: string;
  description: string;
  payload: string;
}

export const PipelineConveyor: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const stages: PipelineStage[] = [
    {
      id: 0,
      name: '1. MULTI-SOURCE INGESTION',
      tagline: 'Raw SFTP, Webhooks & Open Banking',
      metric: '10,000+ TXNS/SEC',
      color: '#00D2FF',
      description: 'Asynchronously pulls raw bank clearing statements, gateway settlement batches, and enterprise ERP ledgers into memory buffers without data loss.',
      payload: '{\n  "source": "HDFC_NET_SETTLEMENT",\n  "rawReference": "HDFC-CLR-9912",\n  "batchAmount": 48272.80,\n  "currency": "INR",\n  "timestamp": "2026-08-28T14:32:00Z"\n}',
    },
    {
      id: 1,
      name: '2. CANONICAL NORMALIZATION',
      tagline: 'Unified Multi-Currency Schema',
      metric: '<0.4ms PER RECORD',
      color: '#A855F7',
      description: 'Parses disparate date formats, extracts fee structures, isolates GST surcharges, and maps order IDs into an immutable canonical vector schema.',
      payload: '{\n  "canonicalId": "TXN-NORM-8841",\n  "grossINR": 52000.00,\n  "contractedMdrFee": 1040.00,\n  "gstSurcharge": 187.20,\n  "customerRefundHold": 2500.00,\n  "targetNetINR": 48272.80\n}',
    },
    {
      id: 2,
      name: '3. DUAL-PATH MATCHING ROUTER',
      tagline: 'Deterministic vs Agentic AI',
      metric: '92% FAST-PATH / 8% AI',
      color: '#10B981',
      description: 'Clean 1:1 records execute on deterministic rule trees in <1.2ms with zero LLM token cost. Complex 1-to-N bundles route to Google Gemini 3.6 Flash.',
      payload: '{\n  "routingDecision": "AGENTIC_AI_BUNDLE",\n  "reasoningEngine": "Google Gemini 3.6 Flash",\n  "candidatePoolSize": 8,\n  "latency": "43ms",\n  "aiMatchConfidence": 0.9998\n}',
    },
    {
      id: 3,
      name: '4. ZERO-DELTA PROOF GUARDRAIL',
      tagline: 'Strict Mathematical Verification',
      metric: '0.0000 INR DELTA',
      color: '#F59E0B',
      description: 'Deterministic Python & TypeScript mathematical guardrails recalculate Gross - Deductions == Net. No match is approved until math balances perfectly.',
      payload: '{\n  "equation": "Gross(52000) - Fee(1040) - GST(187.2) - Refund(2500)",\n  "expectedNet": 48272.80,\n  "actualNet": 48272.80,\n  "delta": 0.0000,\n  "guardrailApproved": true\n}',
    },
    {
      id: 4,
      name: '5. IMMUTABLE GAAP RESOLUTION',
      tagline: 'Boardroom-Ready Audit Trail',
      metric: 'SHA-256 HASH CHAIN',
      color: '#EC4899',
      description: 'Signs resolved batches into GAAP-compliant balance sheet vectors, updates the 30-day cash forecaster, and files exception reports.',
      payload: '{\n  "gaapLedgerVector": "VEC-GAAP-2026-88412",\n  "cryptographicHash": "sha256:e88f41...d720c4",\n  "status": "BOARDROOM_AUDIT_READY",\n  "reconciledCash": 48272.80\n}',
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Conveyor Track Visual */}
      <div
        style={{
          background: 'rgba(11, 15, 25, 0.92)',
          border: '1px solid rgba(0, 210, 255, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 210, 255, 0.1)',
          marginBottom: '2rem',
        }}
      >
        {/* Conveyor Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', fontWeight: 800 }}>
              KINETIC MULTI-STAGE RECONCILIATION CONVEYOR
            </div>
            <div style={{ fontSize: '0.85rem', color: '#8E8E93', marginTop: '0.2rem' }}>
              Illuminated packets stream through 5 automated gates to guarantee zero data loss
            </div>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: '#07080E',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: isPlaying ? '#10B981' : '#8E8E93',
              borderRadius: '6px',
              padding: '0.45rem 0.9rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'FLOWING LIVE' : 'PAUSED'}
          </button>
        </div>

        {/* 5 Stages Conveyor Gates Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', position: 'relative' }}>
          {stages.map((stage) => {
            const isSelected = activeStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                style={{
                  background: isSelected ? 'rgba(0, 210, 255, 0.12)' : '#07080E',
                  border: isSelected ? `2px solid ${stage.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1.25rem 1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected ? `0 0 25px ${stage.color}33` : 'none',
                }}
              >
                {/* Gate Status Pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: stage.color, fontWeight: 800 }}>
                    GATE 0{stage.id + 1}
                  </span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color, boxShadow: `0 0 8px ${stage.color}` }} />
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                  {stage.name.split('. ')[1]}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#8E8E93', lineHeight: 1.4, marginBottom: '0.85rem' }}>
                  {stage.tagline}
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: stage.color, background: 'rgba(255, 255, 255, 0.04)', padding: '0.25rem 0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                  {stage.metric}
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Laser Travel Conduit with Travelling Packets */}
        <div style={{ position: 'relative', height: '18px', background: '#07080E', borderRadius: '9px', marginTop: '1.5rem', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <motion.div
            animate={isPlaying ? { x: ['-10%', '110%'] } : {}}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: '3px',
              width: '45px',
              height: '10px',
              borderRadius: '5px',
              background: 'linear-gradient(90deg, #00D2FF 0%, #10B981 100%)',
              boxShadow: '0 0 15px #00D2FF',
            }}
          />
          <motion.div
            animate={isPlaying ? { x: ['-10%', '110%'] } : {}}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', delay: 1.4 }}
            style={{
              position: 'absolute',
              top: '3px',
              width: '45px',
              height: '10px',
              borderRadius: '5px',
              background: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 100%)',
              boxShadow: '0 0 15px #EC4899',
            }}
          />
        </div>
      </div>

      {/* Interactive Stage Inspector Panel */}
      <div
        style={{
          background: '#07080E',
          border: `1px solid ${stages[activeStage].color}44`,
          borderRadius: '12px',
          padding: '2.25rem',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '2.5rem',
          boxShadow: `0 20px 45px rgba(0, 0, 0, 0.6), 0 0 30px ${stages[activeStage].color}18`,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: stages[activeStage].color, fontWeight: 800 }}>
              ACTIVE GATE INSPECTOR // {stages[activeStage].name}
            </span>
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 1rem' }}>
            {stages[activeStage].tagline}
          </h3>

          <p style={{ fontSize: '0.95rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            {stages[activeStage].description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981' }}>
              <ShieldCheck size={16} />
              <span>GUARANTEED MATHEMATICALLY ROBUST</span>
            </div>
            <div style={{ color: stages[activeStage].color }}>
              PERFORMANCE: {stages[activeStage].metric}
            </div>
          </div>
        </div>

        {/* Live Payload Preview */}
        <div style={{ background: '#0A0C16', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93' }}>
              STAGE JSON VECTOR TRANSFORM
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: stages[activeStage].color }}>
              SCHEMA VALIDATED
            </span>
          </div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: stages[activeStage].color, margin: 0, overflowX: 'auto', lineHeight: 1.5 }}>
            {stages[activeStage].payload}
          </pre>
        </div>
      </div>
    </div>
  );
};
