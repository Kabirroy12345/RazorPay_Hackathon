import type { BankTransaction, GatewayRecord, ERPInvoice, GroundTruthEntry } from '../types/finance';

/**
 * Holdout Batch B (30 Records)
 * Independent generalization proof set to verify the engine isn't overfit to the Demo Batch A.
 */

// 1. Clean Matches (20 records)
const cleanBankTxns: BankTransaction[] = [];
const cleanGatewayRecords: GatewayRecord[] = [];
const cleanERPInvoices: ERPInvoice[] = [];
const cleanGroundTruth: GroundTruthEntry[] = [];

for (let i = 1; i <= 20; i++) {
  const pad = i.toString().padStart(3, '0');
  const gross = 5000 + i * 150;
  const fee = Number((gross * 0.02).toFixed(2));
  const gst = Number((fee * 0.18).toFixed(2));
  const net = Number((gross - fee - gst).toFixed(2));
  const date = `2026-09-${(5 + (i % 20)).toString().padStart(2, '0')}`;
  
  const txnId = `RZP-HLD-${pad}`;
  const orderId = `ORD-HLD-${pad}`;
  const invId = `INV-HLD-${pad}`;
  const bankId = `BANK-HLD-${pad}`;

  cleanBankTxns.push({ id: bankId, date, description: `RAZORPAY NET ${net}`, amount: net, type: 'CREDIT', referenceNo: txnId, currency: 'INR' });
  cleanGatewayRecords.push({ id: txnId, settlementId: `SET-HLD-${pad}`, orderId, customerName: `Holdout Client ${i}`, grossAmount: gross, feeAmount: fee, gstAmount: gst, netAmount: net, status: 'SETTLED', timestamp: `${date}T10:00:00Z`, currency: 'INR' });
  cleanERPInvoices.push({ id: invId, orderId, customerName: `Holdout Client ${i}`, amount: gross, currency: 'INR', date, status: 'PAID' });
  
  cleanGroundTruth.push({ bankId, gatewayIds: [txnId], erpIds: [invId], expectedStatus: 'FAST_PATH_MATCHED', expectedCategory: 'FAST_PATH' });
}

// 2. Unseen Bundle Structure (5 invoices to 1 bank payout)
const bundleInvoices: ERPInvoice[] = [
  { id: 'INV-HSET-1', orderId: 'ORD-HSET-1', customerName: 'Client A', amount: 15000, currency: 'INR', date: '2026-09-10', status: 'PAID' },
  { id: 'INV-HSET-2', orderId: 'ORD-HSET-2', customerName: 'Client B', amount: 8000, currency: 'INR', date: '2026-09-10', status: 'PAID' },
  { id: 'INV-HSET-3', orderId: 'ORD-HSET-3', customerName: 'Client C', amount: 22000, currency: 'INR', date: '2026-09-11', status: 'PAID' },
  { id: 'INV-HSET-4', orderId: 'ORD-HSET-4', customerName: 'Client D', amount: 5000, currency: 'INR', date: '2026-09-11', status: 'PAID' },
  { id: 'INV-HSET-5', orderId: 'ORD-HSET-5', customerName: 'Client E', amount: 10000, currency: 'INR', date: '2026-09-12', status: 'PAID' }, // gross = 60000
];

const bundleGatewayRecords: GatewayRecord[] = bundleInvoices.map((inv, idx) => {
  const isRefunded = idx === 1; // ORD-HSET-2 refunded completely
  const gross = inv.amount;
  const fee = Number((gross * 0.02).toFixed(2));
  const gst = Number((fee * 0.18).toFixed(2));
  const net = isRefunded ? gross - fee - gst - 8000 : gross - fee - gst; 
  return {
    id: `RZP-HSET-${idx + 1}`, settlementId: 'SET-HSET-99', orderId: inv.orderId, customerName: inv.customerName,
    grossAmount: gross, feeAmount: fee, gstAmount: gst, netAmount: net, status: isRefunded ? 'REFUNDED' : 'SETTLED', timestamp: '2026-09-12T18:00:00Z', currency: 'INR'
  };
});

// Gross: 60000. Fee: 1200. GST: 216. Refund: 8000. Net: 50584.
const bundleBankTxn: BankTransaction = {
  id: 'BANK-HSET-99', date: '2026-09-13', description: `RAZORPAY PAYOUT SET-HSET-99`, amount: 50584.00, type: 'CREDIT', referenceNo: 'SET-HSET-99', currency: 'INR'
};

const bundleGroundTruth: GroundTruthEntry = {
  bankId: 'BANK-HSET-99', gatewayIds: bundleGatewayRecords.map(r => r.id), erpIds: bundleInvoices.map(i => i.id),
  expectedStatus: 'AGENTIC_BUNDLE_MATCHED', expectedCategory: 'AGENTIC'
};

// 3. FX Records
const fxBankTxn: BankTransaction = { id: 'BANK-HFX-1', date: '2026-09-14', description: 'REMITTANCE EUR 1000 @ 90.50 INR/EUR', amount: 90500.00, type: 'CREDIT', referenceNo: 'RZP-HEUR-1', currency: 'INR' };
const fxGatewayRecord: GatewayRecord = { id: 'RZP-HEUR-1', settlementId: 'SET-HFX-1', orderId: 'ORD-HFX-1', customerName: 'Berlin Ops', grossAmount: 1000, feeAmount: 20, gstAmount: 3.6, netAmount: 976.4, status: 'SETTLED', timestamp: '2026-09-13T09:00:00Z', currency: 'EUR', fxRate: 90.50 };
const fxERPInvoice: ERPInvoice = { id: 'INV-HFX-1', orderId: 'ORD-HFX-1', customerName: 'Berlin Ops', amount: 1000, currency: 'EUR', date: '2026-09-12', status: 'PAID' };
const fxGroundTruth: GroundTruthEntry = { bankId: 'BANK-HFX-1', gatewayIds: ['RZP-HEUR-1'], erpIds: ['INV-HFX-1'], expectedStatus: 'AGENTIC_FX_MATCHED', expectedCategory: 'AGENTIC' };

// 4. Genuine Malformed Edge Case (Simulating corruption)
const malformedBankTxn: BankTransaction = {
  id: 'BANK-CORRUPT-NULL',
  date: '2026-09-15',
  description: 'INVALID_AMOUNT_LINE',
  amount: NaN, // Triggering edge case
  type: 'CREDIT',
  referenceNo: 'INVALID',
  currency: 'INR',
  isMalformed: true
};
const malformedGroundTruth: GroundTruthEntry = { bankId: 'BANK-CORRUPT-NULL', gatewayIds: [], erpIds: [], expectedStatus: 'PIPELINE_PARSE_CORRECTION_FALLBACK', expectedCategory: 'EXCEPTION' };

// 5. Unseen Exception: Negative settlement chargeback
const chargebackBankTxn: BankTransaction = { id: 'BANK-HREV-01', date: '2026-09-16', description: 'REVERSAL DEBIT RZP-HREV-01', amount: -5000, type: 'DEBIT', referenceNo: 'RZP-HREV-01', currency: 'INR' };
const chargebackGroundTruth: GroundTruthEntry = { bankId: 'BANK-HREV-01', gatewayIds: [], erpIds: [], expectedStatus: 'EXCEPTION_UNRESOLVED_CHARGEBACK', expectedCategory: 'EXCEPTION' };

export const HOLDOUT_BANK_TRANSACTIONS = [...cleanBankTxns, bundleBankTxn, fxBankTxn, malformedBankTxn, chargebackBankTxn];
export const HOLDOUT_GATEWAY_RECORDS = [...cleanGatewayRecords, ...bundleGatewayRecords, fxGatewayRecord];
export const HOLDOUT_ERP_INVOICES = [...cleanERPInvoices, ...bundleInvoices, fxERPInvoice];

export const HOLDOUT_GROUND_TRUTH_VECTOR = [...cleanGroundTruth, bundleGroundTruth, fxGroundTruth, malformedGroundTruth, chargebackGroundTruth];
