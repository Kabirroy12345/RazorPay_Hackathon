import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu } from 'lucide-react';

export const DualPathChamber: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'FAST_PATH' | 'AGENTIC_BUNDLE'>('FAST_PATH');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string>('System Idle. Click a test scenario above to watch live packet routing.');

  const triggerSimulation = (mode: 'FAST_PATH' | 'AGENTIC_BUNDLE') => {
    setActiveMode(mode);
    setIsSimulating(true);

    if (mode === 'FAST_PATH') {
      setSimulationLog('Injecting clean 1:1 transaction TXN-1082... Sub-millisecond rule evaluation in progress...');
      setTimeout(() => {
        setSimulationLog('✓ MATCH APPROVED: Exactly matched in 0.94ms. Token Cost: 0.00. Mathematical Delta: 0.0000 INR.');
        setIsSimulating(false);
      }, 700);
    } else {
      setSimulationLog('Injecting blended settlement SET-88412 (₹48,272.80)... Discovered 8 candidate invoices... Routing to Claude 3.5 Sonnet...');
      setTimeout(() => {
        setSimulationLog('✓ BUNDLE SOLVED in 43ms: Identified exact 8-invoice subset [INV-BUN-01..08]. Recalculated 2% MDR & GST. Delta: 0.0000 INR.');
        setIsSimulating(false);
      }, 1100);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Interactive Trigger Row */}
      <div
        style={{
          background: 'rgba(11, 15, 25, 0.92)',
          border: '1px solid rgba(0, 210, 255, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00D2FF', fontWeight: 800 }}>
            INTERACTIVE ROUTING BENCHMARK:
          </span>
          <span style={{ fontSize: '0.8rem', color: '#8E8E93' }}>
            Trigger real simulated transactions into both paths
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => triggerSimulation('FAST_PATH')}
            disabled={isSimulating}
            style={{
              background: activeMode === 'FAST_PATH' ? 'rgba(0, 210, 255, 0.2)' : '#07080E',
              border: '1px solid #00D2FF',
              color: '#00D2FF',
              padding: '0.55rem 1.1rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Zap size={14} /> TEST 1:1 FAST-PATH (&lt;1.2ms)
          </button>

          <button
            onClick={() => triggerSimulation('AGENTIC_BUNDLE')}
            disabled={isSimulating}
            style={{
              background: activeMode === 'AGENTIC_BUNDLE' ? 'rgba(168, 85, 247, 0.2)' : '#07080E',
              border: '1px solid #A855F7',
              color: '#A855F7',
              padding: '0.55rem 1.1rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Cpu size={14} /> TEST 1:N BUNDLE (CLAUDE 3.5)
          </button>
        </div>
      </div>

      {/* Real-Time Routing Chamber Visual */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
        {/* Track A: Deterministic Railgun */}
        <div
          style={{
            background: activeMode === 'FAST_PATH' ? 'rgba(0, 210, 255, 0.08)' : '#0A0C16',
            border: activeMode === 'FAST_PATH' ? '2px solid #00D2FF' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: activeMode === 'FAST_PATH' ? '0 0 35px rgba(0, 210, 255, 0.2)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(0, 210, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="#00D2FF" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#00D2FF', fontWeight: 800 }}>
                  PATH A // DETERMINISTIC RAILGUN
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93' }}>
                  STANDARD 1:1 SETTLEMENTS
                </div>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#000', background: '#00D2FF', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 800 }}>
              92% VOLUME
            </span>
          </div>

          <h4 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.75rem' }}>
            &lt;1.2ms Sub-Millisecond Rules
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Bypasses large language models entirely. Evaluates exact reference hashes, bank credit dates, and contracted fee tiers with pure algorithmic speed.
          </p>

          {/* Animated Speed Rail */}
          <div style={{ position: 'relative', height: '12px', background: '#07080E', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(0, 210, 255, 0.3)', marginBottom: '1.5rem' }}>
            <motion.div
              animate={{ x: ['-20%', '120%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: '35px',
                height: '100%',
                background: '#00D2FF',
                boxShadow: '0 0 12px #00D2FF',
                borderRadius: '6px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            <div style={{ background: '#07080E', padding: '0.65rem', borderRadius: '6px' }}>
              <div style={{ color: '#8E8E93', marginBottom: '0.2rem' }}>LATENCY</div>
              <div style={{ color: '#00D2FF', fontWeight: 800 }}>&lt;1.2ms</div>
            </div>
            <div style={{ background: '#07080E', padding: '0.65rem', borderRadius: '6px' }}>
              <div style={{ color: '#8E8E93', marginBottom: '0.2rem' }}>TOKEN COST</div>
              <div style={{ color: '#10B981', fontWeight: 800 }}>0 TOKENS</div>
            </div>
            <div style={{ background: '#07080E', padding: '0.65rem', borderRadius: '6px' }}>
              <div style={{ color: '#8E8E93', marginBottom: '0.2rem' }}>ACCURACY</div>
              <div style={{ color: '#FFFFFF', fontWeight: 800 }}>100.0%</div>
            </div>
          </div>
        </div>

        {/* Track B: Claude 3.5 Sonnet Chamber */}
        <div
          style={{
            background: activeMode === 'AGENTIC_BUNDLE' ? 'rgba(168, 85, 247, 0.08)' : '#0A0C16',
            border: activeMode === 'AGENTIC_BUNDLE' ? '2px solid #A855F7' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: activeMode === 'AGENTIC_BUNDLE' ? '0 0 35px rgba(168, 85, 247, 0.2)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={18} color="#A855F7" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#A855F7', fontWeight: 800 }}>
                  PATH B // CLAUDE 3.5 REASONING
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93' }}>
                  ADVERSARIAL 1:N BUNDLES
                </div>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#000', background: '#A855F7', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 800 }}>
              8% COMPLEX
            </span>
          </div>

          <h4 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.75rem' }}>
            Combinatorial Subset Solver
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#8E8E93', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Solves multi-invoice knapsack combinations, partial credits, GST surcharges, and FX rate deviations while maintaining strict zero-delta guardrails.
          </p>

          {/* Animated Reasoning Pulse */}
          <div style={{ position: 'relative', height: '12px', background: '#07080E', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(168, 85, 247, 0.3)', marginBottom: '1.5rem' }}>
            <motion.div
              animate={{ x: ['-20%', '120%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: '50px',
                height: '100%',
                background: '#A855F7',
                boxShadow: '0 0 12px #A855F7',
                borderRadius: '6px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            <div style={{ background: '#07080E', padding: '0.65rem', borderRadius: '6px' }}>
              <div style={{ color: '#8E8E93', marginBottom: '0.2rem' }}>AI LATENCY</div>
              <div style={{ color: '#A855F7', fontWeight: 800 }}>43ms</div>
            </div>
            <div style={{ background: '#07080E', padding: '0.65rem', borderRadius: '6px' }}>
              <div style={{ color: '#8E8E93', marginBottom: '0.2rem' }}>GUARDRAIL</div>
              <div style={{ color: '#F59E0B', fontWeight: 800 }}>0.0000 DELTA</div>
            </div>
            <div style={{ background: '#07080E', padding: '0.65rem', borderRadius: '6px' }}>
              <div style={{ color: '#8E8E93', marginBottom: '0.2rem' }}>REASONING</div>
              <div style={{ color: '#FFFFFF', fontWeight: 800 }}>KNAPSACK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Simulation Terminal Output */}
      <div
        style={{
          background: '#07080E',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: isSimulating ? '#F59E0B' : '#10B981',
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSimulating ? '#F59E0B' : '#10B981', boxShadow: isSimulating ? '0 0 8px #F59E0B' : '0 0 8px #10B981' }} />
        <span>{simulationLog}</span>
      </div>
    </div>
  );
};
