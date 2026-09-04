import React from 'react';
import { HeaderMetrics } from '../HeaderMetrics';
import { VerifiedCashCard } from '../VerifiedCashCard';
import { AdversarialSpotlight } from '../AdversarialSpotlight';
import { ThreeWayGrid } from '../ThreeWayGrid';
import { ExceptionDrawer } from '../ExceptionDrawer';
import type { FullReconciliationOutput } from '../../engine/reconciler';
import type { BankTransaction, GatewayRecord, ERPInvoice, MatchResult } from '../../types/finance';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <HeaderMetrics
        metrics={output.metrics}
        datasetName={datasetName}
        isProcessing={isProcessing}
        isSimulatingFault={isSimulatingFault}
        onRunBatch={onRunBatch}
        onToggleFaultSimulation={onToggleFaultSimulation}
      />

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
