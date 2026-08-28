import type { FinancialDataset } from '../../types/finance';
import {
  FROZEN_BANK_TRANSACTIONS,
  FROZEN_GATEWAY_RECORDS,
  FROZEN_ERP_INVOICES,
  FROZEN_GROUND_TRUTH_VECTOR,
} from '../groundTruthBatch';

export const datasetCoreGroundTruth: FinancialDataset = {
  id: 'CORE_BENCHMARK',
  name: 'Razorpay Core Ground-Truth Benchmark',
  description: '53 Realistic Razorpay Settlement records featuring 3-way reconciliation, 8-to-1 bundled payouts, fee overcharges, duplicate debits, and FX float.',
  recordCount: 53,
  bankTxns: FROZEN_BANK_TRANSACTIONS,
  gatewayRecords: FROZEN_GATEWAY_RECORDS,
  erpInvoices: FROZEN_ERP_INVOICES,
  groundTruthVector: FROZEN_GROUND_TRUTH_VECTOR,
};
