import React from 'react';
import { HeaderMetrics } from '../HeaderMetrics';
import { VerifiedCashCard } from '../VerifiedCashCard';
import { AdversarialSpotlight } from '../AdversarialSpotlight';
import { ThreeWayGrid } from '../ThreeWayGrid';
import { ExceptionDrawer } from '../ExceptionDrawer';
import { Database, Zap, Cpu, ShieldAlert, FileCheck, Download, Sparkles } from 'lucide-react';
import type { FullReconciliationOutput } from '../../engine/reconciler';
import type { BankTransaction, GatewayRecord, ERPInvoice, MatchResult, AppView } from '../../types/finance';

interface ExecutiveDashboardViewProps {
  output: FullReconciliationOutput;
  datasetName?: string;
  isProcessing: boolean;
  isSimulatingFault: boolean;
  selectedMatch: MatchResult | null;
  bankTxns: BankTransaction[];
  gatewayRecords: GatewayRecord[];
  erpInvoices: ERPInvoice[];
  onRunBatch: () => void;
  onToggleFaultSimulation: () => void;
  onSelectMatch: (match: MatchResult | null) => void;
  onNavigateView?: (view: AppView) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  output,
  datasetName,
  isProcessing,
  isSimulatingFault,
  selectedMatch,
  bankTxns,
  gatewayRecords,
  erpInvoices,
  onRunBatch,
  onToggleFaultSimulation,
  onSelectMatch,
  onNavigateView,
}) => {
  const bundleMatch = output.allMatches.find(m => m.status === 'AGENTIC_BUNDLE_MATCHED');

  // Dynamically calculate pending gateway float from unsettled/unmatched records
  const reconciledGatewayIds = new Set(
    output.allMatches
      .filter(m => m.status === 'FAST_PATH_MATCHED' || m.status.startsWith('AGENTIC'))
      .flatMap(m => m.gatewayRecordIds)
  );
  const pendingSettlementINR = gatewayRecords
    .filter(g => !reconciledGatewayIds.has(g.id))
    .reduce((acc, g) => acc + g.netAmount, 0);

  const handleExportSummaryJSON = () => {
    const summary = {
      engine: 'OmniSettle AI Autonomous Controller',
      timestamp: new Date().toISOString(),
      dataset: datasetName || 'Core Ground Truth',
      metrics: output.metrics,
      reconciledCashINR: output.metrics.totalReconciledINR,
      pendingSettlementFloatINR: pendingSettlementINR,
      exceptionCount: output.metrics.exceptionCount,
      accuracy: `${output.metrics.classificationAccuracy}% Ground Truth Precision`,
      matchRate: `${output.metrics.reconciliationRate}% Closed Loop`,
      matchesSample: output.allMatches.slice(0, 10),
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniSettle_Executive_Summary_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      <HeaderMetrics
        metrics={output.metrics}
        datasetName={datasetName}
        isProcessing={isProcessing}
        isSimulatingFault={isSimulatingFault}
        onRunBatch={onRunBatch}
        onToggleFaultSimulation={onToggleFaultSimulation}
      />

      {/* Executive Quick Actions Bar */}
      {onNavigateView && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
            background: 'linear-gradient(135deg, rgba(12, 16, 30, 0.8) 0%, rgba(5, 7, 15, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '0.65rem 1.1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={14} color="#F5D061" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              QUICK_JUMP:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateView('reconciler')}
              className="btn-terminal"
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
            >
              <Zap size={13} color="#0C8CE9" /> 3-Way Live Ledger
            </button>
            <button
              onClick={() => onNavigateView('bundle_lab')}
              className="btn-terminal"
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
            >
              <Cpu size={13} color="#F5D061" /> 1-to-N Bundle Lab
            </button>
            <button
              onClick={() => onNavigateView('exceptions')}
              className="btn-terminal"
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem', color: '#F43F5E', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              <ShieldAlert size={13} /> Exceptions ({output.metrics.exceptionCount})
            </button>
            <button
              onClick={() => onNavigateView('gaap_audit')}
              className="btn-terminal"
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
            >
              <FileCheck size={13} color="#10B981" /> GAAP Certificate
            </button>
            <button
              onClick={() => onNavigateView('data_hub')}
              className="btn-terminal"
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
            >
              <Database size={13} color="#38BDF8" /> Switch Dataset
            </button>
          </div>

          <button
            onClick={handleExportSummaryJSON}
            className="btn-terminal"
            style={{ fontSize: '0.74rem', padding: '0.35rem 0.85rem', borderColor: 'rgba(245, 208, 97, 0.3)', color: '#F5D061' }}
          >
            <Download size={13} /> EXPORT SUMMARY JSON
          </button>
        </div>
      )}

      <VerifiedCashCard 
        reconciledCashINR={output.metrics.totalReconciledINR} 
        pendingSettlementINR={pendingSettlementINR}
      />

      <AdversarialSpotlight bundleMatch={bundleMatch} />

      <ThreeWayGrid
        allMatches={output.allMatches}
        bankTxns={bankTxns}
        gatewayRecords={gatewayRecords}
        erpInvoices={erpInvoices}
        onSelectMatch={onSelectMatch}
      />

      <ExceptionDrawer
        selectedMatch={selectedMatch}
        bankTxns={bankTxns}
        gatewayRecords={gatewayRecords}
        erpInvoices={erpInvoices}
        onClose={() => onSelectMatch(null)}
      />
    </div>
  );
};
