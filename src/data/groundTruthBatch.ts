import type { BankTransaction, GatewayRecord, ERPInvoice, GroundTruthEntry } from '../types/finance';

/**
 * Frozen 52-Record Ground-Truth Dataset (aura-ledger.jsx Specification)
 * 
 * 1. 35 Clean 1-to-1 Matches (Deterministic amounts, exact reference ID cross-referencing)
 * 2. 8 Records forming Adversarial Bundle (₹52,000 across 8 ERP invoices -> 1 bank payout of ₹48,272.80 after 2% fee, 18% GST, and ₹2,500 refund on ORD-BUN-04)
 * 3. 3 FX Records settled within ±0.5% tolerance (USD 500 @ ref rate 83.3)
 * 4. 6 Engineered Exceptions:
 *    - 2x Fee Discrepancy (2.5% charged vs 2.36% contracted)
 *    - 1x Duplicate/Ghost Bank Credit (Bank credit with no gateway trace)
 *    - 1x Missing ERP Invoice (Gateway + Bank exist, ERP missing)
 *    - 1x FX Slippage (1.2% variance)
 *    - 1x Unresolved Chargeback (Bank shows withheld amount)
 */

// 1. CLEAN 1-TO-1 TRANSACTIONS (35 Clean Records)
const cleanBankTxns: BankTransaction[] = [];
const cleanGatewayRecords: GatewayRecord[] = [];
const cleanERPInvoices: ERPInvoice[] = [];
const cleanGroundTruth: GroundTruthEntry[] = [];

for (let i = 1; i <= 35; i++) {
  const pad = i.toString().padStart(3, '0');
  const gross = 1000 + i * 250;
  const fee = Number((gross * 0.02).toFixed(2));
  const gst = Number((fee * 0.18).toFixed(2));
  const net = Number((gross - fee - gst).toFixed(2));
  const date = `2026-08-${(10 + (i % 15)).toString().padStart(2, '0')}`;
  const txnId = `RZP-TXN-${pad}`;
  const orderId = `ORD-2026-${pad}`;
  const invId = `INV-2026-${pad}`;
  const bankId = `BANK-202608-${pad}`;

  cleanBankTxns.push({
    id: bankId,
    date,
    description: `RAZORPAY SETTLEMENT REF #${txnId} NET INR ${net}`,
    amount: net,
    type: 'CREDIT',
    referenceNo: txnId,
    currency: 'INR',
  });

  cleanGatewayRecords.push({
    id: txnId,
    settlementId: `SET-${pad}`,
    orderId,
    customerName: `Acme Corp ${i}`,
    grossAmount: gross,
    feeAmount: fee,
    gstAmount: gst,
    netAmount: net,
    status: 'SETTLED',
    timestamp: `${date}T10:30:00Z`,
    currency: 'INR',
  });

  cleanERPInvoices.push({
    id: invId,
    orderId,
    customerName: `Acme Corp ${i}`,
    amount: gross,
    currency: 'INR',
    date,
    status: 'PAID',
  });

  cleanGroundTruth.push({
    bankId,
    gatewayIds: [txnId],
    erpIds: [invId],
    expectedStatus: 'FAST_PATH_MATCHED',
    expectedCategory: 'FAST_PATH',
  });
}

// 2. ADVERSARIAL 1-TO-N BUNDLED PAYOUT CASE (8 ERP Invoices -> 1 Bank Credit of ₹48,272.80)
const BUNDLE_SETTLEMENT_ID = 'SET-BUNDLE-88412';
const BUNDLE_BANK_ID = 'BANK-SETTLE-88412';

const bundleInvoices: ERPInvoice[] = [
  { id: 'INV-BUN-01', orderId: 'ORD-BUN-01', customerName: 'Apex Cloud Solutions', amount: 8500, currency: 'INR', date: '2026-08-20', status: 'PAID' },
  { id: 'INV-BUN-02', orderId: 'ORD-BUN-02', customerName: 'Nexus Tech Labs', amount: 6200, currency: 'INR', date: '2026-08-20', status: 'PAID' },
  { id: 'INV-BUN-03', orderId: 'ORD-BUN-03', customerName: 'Vortex Global', amount: 12000, currency: 'INR', date: '2026-08-21', status: 'PAID' },
  { id: 'INV-BUN-04', orderId: 'ORD-BUN-04', customerName: 'Starlight Retail', amount: 4500, currency: 'INR', date: '2026-08-21', status: 'PAID' },
  { id: 'INV-BUN-05', orderId: 'ORD-BUN-05', customerName: 'Hyperion Systems', amount: 7300, currency: 'INR', date: '2026-08-21', status: 'PAID' },
  { id: 'INV-BUN-06', orderId: 'ORD-BUN-06', customerName: 'Zenith Logistics', amount: 3500, currency: 'INR', date: '2026-08-22', status: 'PAID' },
  { id: 'INV-BUN-07', orderId: 'ORD-BUN-07', customerName: 'Pulse Analytics', amount: 5000, currency: 'INR', date: '2026-08-22', status: 'PAID' },
  { id: 'INV-BUN-08', orderId: 'ORD-BUN-08', customerName: 'Quantum AI Works', amount: 5000, currency: 'INR', date: '2026-08-22', status: 'PAID' },
];

const bundleGatewayRecords: GatewayRecord[] = bundleInvoices.map((inv, idx) => {
  const isRefunded = idx === 3; // ORD-BUN-04 refunded ₹2,500
  const gross = inv.amount;
  const fee = Number((gross * 0.02).toFixed(2));
  const gst = Number((fee * 0.18).toFixed(2));
  const net = isRefunded ? gross - fee - gst - 2500 : gross - fee - gst;
  return {
    id: `RZP-BUN-${idx + 1}`,
    settlementId: BUNDLE_SETTLEMENT_ID,
    orderId: inv.orderId,
    customerName: inv.customerName,
    grossAmount: gross,
    feeAmount: fee,
    gstAmount: gst,
    netAmount: net,
    status: isRefunded ? 'REFUNDED' : 'SETTLED',
    timestamp: '2026-08-22T18:00:00Z',
    currency: 'INR',
  };
});

const bundleBankTxn: BankTransaction = {
  id: BUNDLE_BANK_ID,
  date: '2026-08-23',
  description: `RAZORPAY PAYOUT BUNDLE #${BUNDLE_SETTLEMENT_ID} (8 TXNS NET OF FEES & REFUND)`,
  amount: 48272.80,
  type: 'CREDIT',
  referenceNo: BUNDLE_SETTLEMENT_ID,
  currency: 'INR',
};

const bundleGroundTruth: GroundTruthEntry = {
  bankId: BUNDLE_BANK_ID,
  gatewayIds: bundleGatewayRecords.map(r => r.id),
  erpIds: bundleInvoices.map(i => i.id),
  expectedStatus: 'AGENTIC_BUNDLE_MATCHED',
  expectedCategory: 'AGENTIC',
};

// 3. FX MULTI-CURRENCY MATCHES WITHIN ±0.5% TOLERANCE (3 Records)
const fxBankTxns: BankTransaction[] = [
  { id: 'BANK-FX-01', date: '2026-08-15', description: 'INWARD REMITTANCE USD 500 @ 83.30 INR/USD', amount: 41650.00, type: 'CREDIT', referenceNo: 'RZP-USD-01', currency: 'INR' },
  { id: 'BANK-FX-02', date: '2026-08-16', description: 'INWARD REMITTANCE USD 1200 @ 83.35 INR/USD', amount: 100020.00, type: 'CREDIT', referenceNo: 'RZP-USD-02', currency: 'INR' },
  { id: 'BANK-FX-03', date: '2026-08-17', description: 'INWARD REMITTANCE USD 850 @ 83.28 INR/USD', amount: 70788.00, type: 'CREDIT', referenceNo: 'RZP-USD-03', currency: 'INR' },
];

const fxGatewayRecords: GatewayRecord[] = [
  { id: 'RZP-USD-01', settlementId: 'SET-FX-01', orderId: 'ORD-USD-01', customerName: 'Silicon Valley Corp', grossAmount: 500, feeAmount: 10, gstAmount: 1.8, netAmount: 488.2, status: 'SETTLED', timestamp: '2026-08-15T09:00:00Z', currency: 'USD', fxRate: 83.30 },
  { id: 'RZP-USD-02', settlementId: 'SET-FX-02', orderId: 'ORD-USD-02', customerName: 'Boston BioHealth', grossAmount: 1200, feeAmount: 24, gstAmount: 4.32, netAmount: 1171.68, status: 'SETTLED', timestamp: '2026-08-16T11:00:00Z', currency: 'USD', fxRate: 83.35 },
  { id: 'RZP-USD-03', settlementId: 'SET-FX-03', orderId: 'ORD-USD-03', customerName: 'Austin SaaSOps', grossAmount: 850, feeAmount: 17, gstAmount: 3.06, netAmount: 829.94, status: 'SETTLED', timestamp: '2026-08-17T14:00:00Z', currency: 'USD', fxRate: 83.28 },
];

const fxERPInvoices: ERPInvoice[] = [
  { id: 'INV-USD-01', orderId: 'ORD-USD-01', customerName: 'Silicon Valley Corp', amount: 500, currency: 'USD', date: '2026-08-14', status: 'PAID' },
  { id: 'INV-USD-02', orderId: 'ORD-USD-02', customerName: 'Boston BioHealth', amount: 1200, currency: 'USD', date: '2026-08-15', status: 'PAID' },
  { id: 'INV-USD-03', orderId: 'ORD-USD-03', customerName: 'Austin SaaSOps', amount: 850, currency: 'USD', date: '2026-08-16', status: 'PAID' },
];

const fxGroundTruth: GroundTruthEntry[] = [
  { bankId: 'BANK-FX-01', gatewayIds: ['RZP-USD-01'], erpIds: ['INV-USD-01'], expectedStatus: 'AGENTIC_FX_MATCHED', expectedCategory: 'AGENTIC' },
  { bankId: 'BANK-FX-02', gatewayIds: ['RZP-USD-02'], erpIds: ['INV-USD-02'], expectedStatus: 'AGENTIC_FX_MATCHED', expectedCategory: 'AGENTIC' },
  { bankId: 'BANK-FX-03', gatewayIds: ['RZP-USD-03'], erpIds: ['INV-USD-03'], expectedStatus: 'AGENTIC_FX_MATCHED', expectedCategory: 'AGENTIC' },
];

// 4. PURPOSELY ENGINEERED HONEST EXCEPTIONS (6 Records)

// Exception A: Fee Overcharge (Billed 2.50% vs Contracted 2.00%) - 2 Records
const feeExBankTxns: BankTransaction[] = [
  { id: 'BANK-ERR-FEE1', date: '2026-08-24', description: 'RAZORPAY PAYOUT REF #RZP-FEE-ERR1', amount: 9705.00, type: 'CREDIT', referenceNo: 'RZP-FEE-ERR1', currency: 'INR' },
  { id: 'BANK-ERR-FEE2', date: '2026-08-25', description: 'RAZORPAY PAYOUT REF #RZP-FEE-ERR2', amount: 19410.00, type: 'CREDIT', referenceNo: 'RZP-FEE-ERR2', currency: 'INR' },
];
const feeExGatewayRecords: GatewayRecord[] = [
  { id: 'RZP-FEE-ERR1', settlementId: 'SET-FEE-1', orderId: 'ORD-ERR-FEE1', customerName: 'Delta Marketing', grossAmount: 10000, feeAmount: 250, gstAmount: 45, netAmount: 9705.00, status: 'SETTLED', timestamp: '2026-08-24T10:00:00Z', currency: 'INR' },
  { id: 'RZP-FEE-ERR2', settlementId: 'SET-FEE-2', orderId: 'ORD-ERR-FEE2', customerName: 'Epsilon Retail', grossAmount: 20000, feeAmount: 500, gstAmount: 90, netAmount: 19410.00, status: 'SETTLED', timestamp: '2026-08-25T11:00:00Z', currency: 'INR' },
];
const feeExERPInvoices: ERPInvoice[] = [
  { id: 'INV-ERR-FEE1', orderId: 'ORD-ERR-FEE1', customerName: 'Delta Marketing', amount: 10000, currency: 'INR', date: '2026-08-23', status: 'PAID' },
  { id: 'INV-ERR-FEE2', orderId: 'ORD-ERR-FEE2', customerName: 'Epsilon Retail', amount: 20000, currency: 'INR', date: '2026-08-24', status: 'PAID' },
];
const feeExGroundTruth: GroundTruthEntry[] = [
  { bankId: 'BANK-ERR-FEE1', gatewayIds: ['RZP-FEE-ERR1'], erpIds: ['INV-ERR-FEE1'], expectedStatus: 'EXCEPTION_FEE_MISMATCH', expectedCategory: 'EXCEPTION' },
  { bankId: 'BANK-ERR-FEE2', gatewayIds: ['RZP-FEE-ERR2'], erpIds: ['INV-ERR-FEE2'], expectedStatus: 'EXCEPTION_FEE_MISMATCH', expectedCategory: 'EXCEPTION' },
];

// Exception B: Duplicate/Ghost Bank Credit (Bank credit with no gateway trace) - 1 Record
const dupBankTxn: BankTransaction = {
  id: 'BANK-DUP-99120',
  date: '2026-08-26',
  description: 'RAZORPAY PAYOUT DUPLICATE REF #RZP-DUP-99120',
  amount: 14500.00,
  type: 'CREDIT',
  referenceNo: 'RZP-DUP-99120',
  currency: 'INR',
};
const dupGroundTruth: GroundTruthEntry = {
  bankId: 'BANK-DUP-99120',
  gatewayIds: [],
  erpIds: [],
  expectedStatus: 'EXCEPTION_DUPLICATE_PAYOUT',
  expectedCategory: 'EXCEPTION',
};

// Exception C: Missing ERP Invoice (Gateway + Bank exist, ERP missing) - 1 Record
const missingErpGatewayRecord: GatewayRecord = {
  id: 'RZP-GHOST-77',
  settlementId: 'SET-GHOST-77',
  orderId: 'ORD-GHOST-77',
  customerName: 'Shadow Enterprise Inc',
  grossAmount: 8400,
  feeAmount: 168,
  gstAmount: 30.24,
  netAmount: 8201.76,
  status: 'SETTLED',
  timestamp: '2026-08-26T15:30:00Z',
  currency: 'INR',
};
const missingErpBankTxn: BankTransaction = {
  id: 'BANK-GHOST-77',
  date: '2026-08-27',
  description: 'RAZORPAY PAYOUT REF #RZP-GHOST-77',
  amount: 8201.76,
  type: 'CREDIT',
  referenceNo: 'RZP-GHOST-77',
  currency: 'INR',
};
const missingErpGroundTruth: GroundTruthEntry = {
  bankId: 'BANK-GHOST-77',
  gatewayIds: ['RZP-GHOST-77'],
  erpIds: [],
  expectedStatus: 'EXCEPTION_MISSING_ERP_INVOICE',
  expectedCategory: 'EXCEPTION',
};

// Exception D: FX Slippage (1.2% rate deviation) - 1 Record
const fxSlipBankTxn: BankTransaction = {
  id: 'BANK-FX-SLIP',
  date: '2026-08-27',
  description: 'INWARD REMITTANCE USD 2000 @ 81.20 INR/USD (FX SLIPPAGE)',
  amount: 162400.00,
  type: 'CREDIT',
  referenceNo: 'RZP-USD-SLIP',
  currency: 'INR',
};
const fxSlipGatewayRecord: GatewayRecord = {
  id: 'RZP-USD-SLIP',
  settlementId: 'SET-FX-SLIP',
  orderId: 'ORD-USD-SLIP',
  customerName: 'Global Horizon Tech',
  grossAmount: 2000,
  feeAmount: 40,
  gstAmount: 7.2,
  netAmount: 1952.8,
  status: 'SETTLED',
  timestamp: '2026-08-27T08:00:00Z',
  currency: 'USD',
  fxRate: 83.30,
};
const fxSlipERPInvoice: ERPInvoice = {
  id: 'INV-USD-SLIP',
  orderId: 'ORD-USD-SLIP',
  customerName: 'Global Horizon Tech',
  amount: 2000,
  currency: 'USD',
  date: '2026-08-26',
  status: 'PAID',
};
const fxSlipGroundTruth: GroundTruthEntry = {
  bankId: 'BANK-FX-SLIP',
  gatewayIds: ['RZP-USD-SLIP'],
  erpIds: ['INV-USD-SLIP'],
  expectedStatus: 'EXCEPTION_UNHEDGED_FX_SLIPPAGE',
  expectedCategory: 'EXCEPTION',
};

// Exception E: Unresolved Chargeback (Bank shows withheld amount) - 1 Record
const chargebackGatewayRecord: GatewayRecord = {
  id: 'RZP-DISP-01',
  settlementId: 'SET-DISP-01',
  orderId: 'ORD-DISP-01',
  customerName: 'Contested Payment User',
  grossAmount: 15000,
  feeAmount: 300,
  gstAmount: 54,
  netAmount: 14646,
  status: 'DISPUTED',
  timestamp: '2026-08-27T16:00:00Z',
  currency: 'INR',
};
const chargebackERPInvoice: ERPInvoice = {
  id: 'INV-DISP-01',
  orderId: 'ORD-DISP-01',
  customerName: 'Contested Payment User',
  amount: 15000,
  currency: 'INR',
  date: '2026-08-26',
  status: 'PAID',
};
const chargebackGroundTruth: GroundTruthEntry = {
  bankId: undefined,
  gatewayIds: ['RZP-DISP-01'],
  erpIds: ['INV-DISP-01'],
  expectedStatus: 'EXCEPTION_UNRESOLVED_CHARGEBACK',
  expectedCategory: 'EXCEPTION',
};

// COMBINED FROZEN BATCH (EXACTLY 52 TOTAL RECORDS)
export const FROZEN_BANK_TRANSACTIONS: BankTransaction[] = [
  ...cleanBankTxns,
  bundleBankTxn,
  ...fxBankTxns,
  ...feeExBankTxns,
  dupBankTxn,
  missingErpBankTxn,
  fxSlipBankTxn,
];

export const FROZEN_GATEWAY_RECORDS: GatewayRecord[] = [
  ...cleanGatewayRecords,
  ...bundleGatewayRecords,
  ...fxGatewayRecords,
  ...feeExGatewayRecords,
  missingErpGatewayRecord,
  fxSlipGatewayRecord,
  chargebackGatewayRecord,
];

export const FROZEN_ERP_INVOICES: ERPInvoice[] = [
  ...cleanERPInvoices,
  ...bundleInvoices,
  ...fxERPInvoices,
  ...feeExERPInvoices,
  fxSlipERPInvoice,
  chargebackERPInvoice,
];

export const FROZEN_GROUND_TRUTH_VECTOR: GroundTruthEntry[] = [
  ...cleanGroundTruth,
  bundleGroundTruth,
  ...fxGroundTruth,
  ...feeExGroundTruth,
  dupGroundTruth,
  missingErpGroundTruth,
  fxSlipGroundTruth,
  chargebackGroundTruth,
];
