import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ALL_DATASETS } from './data/datasets';
import { executeFullReconciliation } from './engine/reconciler';
import type { FullReconciliationOutput } from './engine/reconciler';
import type { MatchResult, BankTransaction, FinancialDataset, AppView } from './types/finance';
import { SidebarNav } from './components/SidebarNav';
import { RoyalTopNav } from './components/RoyalTopNav';
import { ExecutiveDashboardView } from './components/views/ExecutiveDashboardView';
import { StreamingReconcilerView } from './components/views/StreamingReconcilerView';
import { BundleMathLabView } from './components/views/BundleMathLabView';
import { ExceptionResolutionView } from './components/views/ExceptionResolutionView';
import { CashForecasterView } from './components/views/CashForecasterView';
import { SettlementQAView } from './components/views/SettlementQAView';
import { DataHubView } from './components/views/DataHubView';
import { GAAPAuditView } from './components/views/GAAPAuditView';
import { LandingPageView } from './components/views/LandingPageView';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/index.css';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeDataset, setActiveDataset] = useState<FinancialDataset>(ALL_DATASETS.CORE_BENCHMARK);
  const [isSimulatingFault, setIsSimulatingFault] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const [output, setOutput] = useState<FullReconciliationOutput | null>(null);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case '1': setCurrentView('dashboard'); break;
        case '2': setCurrentView('reconciler'); break;
        case '3': setCurrentView('bundle_lab'); break;
        case '4': setCurrentView('exceptions'); break;
        case '5': setCurrentView('settlement_qa'); break;
        case '6': setCurrentView('cash_forecast'); break;
        case '7': setCurrentView('data_hub'); break;
        case '8': setCurrentView('gaap_audit'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Run on mount or dataset change
  useEffect(() => {
    const runInitial = async () => {
      setIsProcessing(true);
      const newOutput = await executeFullReconciliation(
        activeDataset.bankTxns,
        activeDataset.gatewayRecords,
        activeDataset.erpInvoices,
        activeDataset.groundTruthVector
      );
      setOutput(newOutput);
      setIsProcessing(false);
    };
    runInitial();
  }, [activeDataset]);

  const handleSelectDataset = (dataset: FinancialDataset) => {
    setActiveDataset(dataset);
    setIsSimulatingFault(false);
    setSelectedMatch(null);
  };

  const getEffectiveBankTxns = (simFault: boolean): BankTransaction[] => {
    if (!simFault) return activeDataset.bankTxns;
    // Malformed transaction to test self-healing PIPELINE_PARSE_CORRECTION_FALLBACK
    const corruptedLine: BankTransaction = {
      id: 'BANK-CORRUPTED-ERR999',
      date: '2026-08-28',
      description: 'CORRUPTED_GATEWAY_PAYLOAD_LINE_MALFORMED_JSON_%%%_RECOVERY_TEST',
      amount: NaN,
      type: 'CREDIT',
      referenceNo: 'INVALID-REF',
      currency: 'INR',
      isMalformed: true,
    };
    return [corruptedLine, ...activeDataset.bankTxns];
  };

  const handleRunBatch = async () => {
    setIsProcessing(true);
    setSelectedMatch(null);

    const activeBank = getEffectiveBankTxns(isSimulatingFault);
    const newOutput = await executeFullReconciliation(
      activeBank,
      activeDataset.gatewayRecords,
      activeDataset.erpInvoices,
      activeDataset.groundTruthVector
    );

    if (isSimulatingFault && newOutput.metrics.recoveredFaultCount) {
      newOutput.metrics.recoveredFaultCount = 1;
    }

    setOutput(newOutput);
    setIsProcessing(false);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleToggleFaultSimulation = async () => {
    const nextFault = !isSimulatingFault;
    setIsSimulatingFault(nextFault);
    setIsProcessing(true);

    const activeBank = getEffectiveBankTxns(nextFault);
    const newOutput = await executeFullReconciliation(
      activeBank,
      activeDataset.gatewayRecords,
      activeDataset.erpInvoices,
      activeDataset.groundTruthVector
    );

    if (nextFault && newOutput.metrics.recoveredFaultCount) {
      newOutput.metrics.recoveredFaultCount = 1;
    }

    setOutput(newOutput);
    setIsProcessing(false);
  };

  // Strictly 1 Landing Page Gateway
  if (!isAuthenticated) {
    return (
      <LandingPageView 
        onAuthSuccess={(targetView?: AppView) => {
          if (targetView) setCurrentView(targetView);
        }} 
      />
    );
  }

  if (isBooting) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#000', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ width: '400px' }}>
          <div className="font-mono data-flicker" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            OMNI_OS v4.1.2 [KERNEL_LOAD]<br/>
            MEMORY_ALLOC... OK<br/>
            MOUNTING_LEDGERS... OK<br/>
            INIT_AI_ENGINE... OK
          </div>
          <div className="font-mono pulse-indicator" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {'>'} BOOTING_TERMINAL_INTERFACE... █
          </div>
        </div>
      </div>
    );
  }

  if (!output) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="font-mono data-flicker" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>[ INITIALIZING_SYS_MODULES ]</h2>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      {/* Master Left Sidebar Navigation */}
      <SidebarNav
        currentView={currentView}
        activeDataset={activeDataset}
        exceptionCount={output.metrics.exceptionCount}
        isMockMode={output.isMockMode}
        onSelectView={view => setCurrentView(view)}
        onLogout={logout}
      />

      {/* Main Active Module Content View */}
      <main style={{ flex: 1, padding: '0 2rem 2.5rem 2rem', overflowX: 'hidden' }}>
        <RoyalTopNav
          currentView={currentView}
          activeDataset={activeDataset}
          onSelectView={view => setCurrentView(view)}
          onRunBatch={handleRunBatch}
          isProcessing={isProcessing}
        />

        {currentView === 'dashboard' && (
          <ExecutiveDashboardView
            output={output}
            datasetName={activeDataset.name}
            isProcessing={isProcessing}
            isSimulatingFault={isSimulatingFault}
            selectedMatch={selectedMatch}
            bankTxns={activeDataset.bankTxns}
            gatewayRecords={activeDataset.gatewayRecords}
            erpInvoices={activeDataset.erpInvoices}
            onRunBatch={handleRunBatch}
            onToggleFaultSimulation={handleToggleFaultSimulation}
            onSelectMatch={match => setSelectedMatch(match)}
          />
        )}

        {currentView === 'reconciler' && (
          <StreamingReconcilerView output={output} />
        )}

        {currentView === 'bundle_lab' && (
          <BundleMathLabView />
        )}

        {currentView === 'exceptions' && (
          <ExceptionResolutionView output={output} />
        )}

        {currentView === 'settlement_qa' && (
          <SettlementQAView output={output} activeDataset={activeDataset} />
        )}

        {currentView === 'cash_forecast' && (
          <CashForecasterView 
            reconciledCashINR={output.metrics.totalReconciledINR} 
            activeDataset={activeDataset}
          />
        )}

        {currentView === 'data_hub' && (
          <DataHubView
            activeDataset={activeDataset}
            onSelectDataset={handleSelectDataset}
          />
        )}

        {currentView === 'gaap_audit' && (
          <GAAPAuditView output={output} activeDataset={activeDataset} />
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
