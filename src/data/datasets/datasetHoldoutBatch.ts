import type { FinancialDataset } from '../../types/finance';
import {
  HOLDOUT_BANK_TRANSACTIONS,
  HOLDOUT_GATEWAY_RECORDS,
  HOLDOUT_ERP_INVOICES,
  HOLDOUT_GROUND_TRUTH_VECTOR,
} from '../holdoutBatch';

export const datasetHoldoutBatch: FinancialDataset = {
  id: 'HOLDOUT_BATCH',
  name: 'Holdout Batch B (Generalization Proof)',
  description: 'Unseen batch with separate bundles and edge cases (incl. malformed record) to prove the agent generalizes.',
  recordCount: 30,
  bankTxns: HOLDOUT_BANK_TRANSACTIONS,
  gatewayRecords: HOLDOUT_GATEWAY_RECORDS,
  erpInvoices: HOLDOUT_ERP_INVOICES,
  groundTruthVector: HOLDOUT_GROUND_TRUTH_VECTOR,
};
