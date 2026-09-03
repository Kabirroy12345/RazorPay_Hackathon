import type {
  BankTransaction,
  GatewayRecord,
  ERPInvoice,
  MatchResult,
  DualMetrics,
  GroundTruthEntry,
} from '../types/finance';
import { runFastPathMatcher } from './fastPathMatcher';
import { runAgenticResolver } from './agenticResolver';
import { classifyExceptions } from './exceptionClassifier';
import { calculateIndependentMetrics } from './metrics';
import { validateReconciliationBatch } from './validator';

export interface FullReconciliationOutput {
  allMatches: MatchResult[];
  fastPathMatches: MatchResult[];
  agenticMatches: MatchResult[];
  exceptionMatches: MatchResult[];
  metrics: DualMetrics;
  isMockMode: boolean;
}

export async function executeFullReconciliation(
  bankTxns: BankTransaction[],
  gatewayRecords: GatewayRecord[],
  erpInvoices: ERPInvoice[],
  groundTruthVector: GroundTruthEntry[] = []
): Promise<FullReconciliationOutput> {
  const startTime = performance.now();

  // Phase 0: Zod-style Validation Layer
  const validationResult = validateReconciliationBatch(bankTxns, gatewayRecords, erpInvoices);

  // Phase 1: Fast-Path Rule Matcher
  const fastPathResult = runFastPathMatcher(
    validationResult.validBankTxns, 
    validationResult.validGatewayRecords, 
    validationResult.validERPInvoices
  );

  // Phase 2: Agentic AI Resolver (Real LLM Calls)
  const agenticResult = await runAgenticResolver(
    fastPathResult.unmatchedBankTxns,
    fastPathResult.unmatchedGatewayRecords,
    fastPathResult.unmatchedERPInvoices
  );

  // Phase 3: Honest Exception Classification & Ambiguity Detection
  const exceptionMatches = classifyExceptions(
    agenticResult.remainingBankTxns,
    agenticResult.remainingGatewayRecords,
    agenticResult.remainingERPInvoices
  );

  const endTime = performance.now();
  const latencyMs = Number((endTime - startTime).toFixed(2));

  const allMatches = [
    ...validationResult.pipelineParseExceptions,
    ...fastPathResult.matchedResults,
    ...agenticResult.agenticMatchedResults,
    ...exceptionMatches,
  ];

  // Independent Metrics Calculation (never trusts the engine's status logic)
  const metrics = calculateIndependentMetrics(
    allMatches,
    groundTruthVector,
    gatewayRecords,
    latencyMs
  );

  return {
    allMatches,
    fastPathMatches: fastPathResult.matchedResults,
    agenticMatches: agenticResult.agenticMatchedResults,
    exceptionMatches,
    metrics,
    isMockMode: agenticResult.isMockMode
  };
}
