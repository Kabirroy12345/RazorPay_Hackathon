import type { FinancialDataset, BankTransaction, GatewayRecord, ERPInvoice, GroundTruthEntry } from '../../types/finance';

const bankTxns: BankTransaction[] = [];
const gatewayRecords: GatewayRecord[] = [];
const erpInvoices: ERPInvoice[] = [];
const groundTruthVector: GroundTruthEntry[] = [];

// 1. Fee Overcharges (8 Records)
for (let i = 1; i <= 8; i++) {
  const pad = i.toString().padStart(3, '0');
  const gross = 15000 + i * 5000;
  const fee = Number((gross * 0.03).toFixed(2)); // Billed at 3.00% rate vs 2.00% contracted!
  const gst = Number((fee * 0.18).toFixed(2));
  const net = Number((gross - fee - gst).toFixed(2));
  const date = `2026-08-${(10 + i).toString().padStart(2, '0')}`;
  const txnId = `RZP-ADV-FEE-${pad}`;
  const orderId = `ORD-ADV-FEE-${pad}`;
  const invId = `INV-ADV-FEE-${pad}`;
  const bankId = `BANK-ADV-FEE-${pad}`;

  bankTxns.push({
    id: bankId,
    date,
    description: `RAZORPAY PAYOUT REF #${txnId} (OVERCHARGED FEE)`,
    amount: net,
    type: 'CREDIT',
    referenceNo: txnId,
    currency: 'INR',
  });

  gatewayRecords.push({
    id: txnId,
    settlementId: `SET-ADV-FEE-${pad}`,
    orderId,
    customerName: `Fee Discrepancy Customer #${i}`,
    grossAmount: gross,
    feeAmount: fee,
    gstAmount: gst,
    netAmount: net,
    status: 'SETTLED',
    timestamp: `${date}T10:00:00Z`,
    currency: 'INR',
  });

  erpInvoices.push({
    id: invId,
    orderId,
    customerName: `Fee Discrepancy Customer #${i}`,
    amount: gross,
    currency: 'INR',
    date,
    status: 'PAID',
  });

  groundTruthVector.push({
    bankId,
    gatewayIds: [txnId],
    erpIds: [invId],
    expectedStatus: 'EXCEPTION_FEE_MISMATCH',
    expectedCategory: 'EXCEPTION',
  });
}

// 2. Disputed Chargebacks Withheld by Gateway (6 Records)
for (let i = 1; i <= 6; i++) {
  const pad = i.toString().padStart(3, '0');
  const gross = 25000 + i * 2500;
  const date = `2026-08-${(15 + i).toString().padStart(2, '0')}`;
  const txnId = `RZP-ADV-DISP-${pad}`;
  const orderId = `ORD-ADV-DISP-${pad}`;
  const invId = `INV-ADV-DISP-${pad}`;

  gatewayRecords.push({
    id: txnId,
    settlementId: `SET-ADV-DISP-${pad}`,
    orderId,
    customerName: `Disputed Risk User #${i}`,
    grossAmount: gross,
    feeAmount: gross * 0.02,
    gstAmount: gross * 0.02 * 0.18,
    netAmount: gross * 0.9764,
    status: 'DISPUTED',
    timestamp: `${date}T14:00:00Z`,
    currency: 'INR',
  });

  erpInvoices.push({
    id: invId,
    orderId,
    customerName: `Disputed Risk User #${i}`,
    amount: gross,
    currency: 'INR',
    date,
    status: 'PAID',
  });

  groundTruthVector.push({
    gatewayIds: [txnId],
    erpIds: [invId],
    expectedStatus: 'EXCEPTION_UNRESOLVED_CHARGEBACK',
    expectedCategory: 'EXCEPTION',
  });
}

export const datasetAdversarialAnomalies: FinancialDataset = {
  id: 'ADVERSARIAL_FRAUD',
  name: 'Adversarial Anomalies & Risk Stress Suite',
  description: '14 High-Discrepancy Records featuring fee overcharge surges (3.00% vs 2.00%), escrow chargeback withholdings, and unrecorded sales revenue.',
  recordCount: 14,
  bankTxns,
  gatewayRecords,
  erpInvoices,
  groundTruthVector,
};
