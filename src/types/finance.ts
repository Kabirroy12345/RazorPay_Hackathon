export type TransactionType = 'CREDIT' | 'DEBIT';

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  referenceNo: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'SGD';
  isMalformed?: boolean;
}

export interface GatewayRecord {
  id: string;
  settlementId?: string;
  orderId: string;
  customerName: string;
  grossAmount: number;
  feeAmount: number;
  gstAmount: number;
  netAmount: number;
  status: 'SETTLED' | 'REFUNDED' | 'DISPUTED' | 'PENDING';
  timestamp: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'SGD';
  fxRate?: number;
}

export interface ERPInvoice {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'SGD';
  date: string;
  status: 'PAID' | 'UNPAID' | 'CANCELLED';
}

export type ReconciliationStatus =
  | 'PENDING'
  | 'FAST_PATH_MATCHED'
  | 'AGENTIC_BUNDLE_MATCHED'
  | 'AGENTIC_FX_MATCHED'
  | 'EXCEPTION_FEE_MISMATCH'
  | 'EXCEPTION_DUPLICATE_PAYOUT'
  | 'EXCEPTION_MISSING_ERP_INVOICE'
  | 'EXCEPTION_UNRESOLVED_CHARGEBACK'
  | 'EXCEPTION_UNHEDGED_FX_SLIPPAGE'
  | 'AMBIGUOUS_HUMAN_REVIEW'
  | 'PIPELINE_PARSE_CORRECTION_FALLBACK';

export interface RemediationStub {
  id: string;
  title: string;
  actionLabel: string;
  targetCategory: string;
  impactAmount: number;
  isExecuted?: boolean;
  generatedArtifactJson?: string;
}

export interface MatchResult {
  id: string;
  bankRecordId?: string;
  gatewayRecordIds: string[];
  erpInvoiceIds: string[];
  status: ReconciliationStatus;
  matchType: 'RULE_BASED' | 'AGENTIC_AI' | 'EXCEPTION' | 'HUMAN_REVIEW';
  confidenceScore: number;
  reconciledAmount: number;
  discrepancyAmount: number;
  feeRateBps?: number;
  reasoningTrace: string[];
  remediationStub?: RemediationStub;
  isMockMode?: boolean;
}

export interface GroundTruthEntry {
  bankId?: string;
  gatewayIds: string[];
  erpIds: string[];
  expectedStatus: ReconciliationStatus;
  expectedCategory: 'FAST_PATH' | 'AGENTIC' | 'EXCEPTION' | 'HUMAN_REVIEW';
}

export interface DualMetrics {
  reconciliationRate: number;
  classificationAccuracy: number;
  totalRecords: number;
  fastPathCount: number;
  agenticCount: number;
  exceptionCount: number;
  humanReviewCount: number;
  totalReconciledINR: number;
  avgLatencyMs: number;
  recoveredFaultCount?: number;
  totalGrossProcessedINR: number;
  totalGatewayFeesINR: number;
  totalTaxDeductedINR: number;
}

export type DatasetCategory =
  | 'CORE_BENCHMARK'
  | 'MULTI_CURRENCY_FX'
  | 'HIGH_VOLUME_SAAS'
  | 'ADVERSARIAL_FRAUD'
  | 'HOLDOUT_BATCH'
  | 'CUSTOM_UPLOAD';

export interface FinancialDataset {
  id: DatasetCategory;
  name: string;
  description: string;
  recordCount: number;
  bankTxns: BankTransaction[];
  gatewayRecords: GatewayRecord[];
  erpInvoices: ERPInvoice[];
  groundTruthVector: GroundTruthEntry[];
}

export type AppView =
  | 'dashboard'
  | 'reconciler'
  | 'bundle_lab'
  | 'exceptions'
  | 'cash_forecast'
  | 'settlement_qa'
  | 'data_hub'
  | 'gaap_audit';
