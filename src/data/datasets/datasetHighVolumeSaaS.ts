import type { FinancialDataset, BankTransaction, GatewayRecord, ERPInvoice, GroundTruthEntry } from '../../types/finance';

const bankTxns: BankTransaction[] = [];
const gatewayRecords: GatewayRecord[] = [];
const erpInvoices: ERPInvoice[] = [];
const groundTruthVector: GroundTruthEntry[] = [];

let orderCounter = 1;

// 15 Daily Payout Bundles, each bundling 8 SaaS subscription orders
for (let day = 1; day <= 15; day++) {
  const dayStr = day.toString().padStart(2, '0');
  const date = `2026-08-${dayStr}`;
  const settlementId = `SET-SAAS-DAY-${dayStr}`;
  const bankId = `BANK-SAAS-PAYOUT-${dayStr}`;

  let bundleGross = 0;
  let bundleFee = 0;
  let bundleGst = 0;
  const currentBatchTxnIds: string[] = [];
  const currentBatchInvIds: string[] = [];

  for (let item = 1; item <= 8; item++) {
    const pad = orderCounter.toString().padStart(3, '0');
    const gross = 299 + (item % 4) * 200; // e.g. ₹299, ₹499, ₹699, ₹899 SaaS monthly tiers
    const fee = Number((gross * 0.02).toFixed(2));
    const gst = Number((fee * 0.18).toFixed(2));
    const net = Number((gross - fee - gst).toFixed(2));

    bundleGross += gross;
    bundleFee += fee;
    bundleGst += gst;

    const txnId = `RZP-SAAS-${pad}`;
    const orderId = `ORD-SAAS-${pad}`;
    const invId = `INV-SAAS-${pad}`;

    currentBatchTxnIds.push(txnId);
    currentBatchInvIds.push(invId);

    gatewayRecords.push({
      id: txnId,
      settlementId,
      orderId,
      customerName: `SaaS Customer #${orderCounter}`,
      grossAmount: gross,
      feeAmount: fee,
      gstAmount: gst,
      netAmount: net,
      status: 'SETTLED',
      timestamp: `${date}T16:00:00Z`,
      currency: 'INR',
    });

    erpInvoices.push({
      id: invId,
      orderId,
      customerName: `SaaS Customer #${orderCounter}`,
      amount: gross,
      currency: 'INR',
      date,
      status: 'PAID',
    });

    orderCounter++;
  }

  const netBankPayout = Number((bundleGross - bundleFee - bundleGst).toFixed(2));

  bankTxns.push({
    id: bankId,
    date,
    description: `RAZORPAY SAAS BATCH #${settlementId} (8 SUBSCRIPTIONS NET ₹${netBankPayout})`,
    amount: netBankPayout,
    type: 'CREDIT',
    referenceNo: settlementId,
    currency: 'INR',
  });

  groundTruthVector.push({
    bankId,
    gatewayIds: currentBatchTxnIds,
    erpIds: currentBatchInvIds,
    expectedStatus: 'AGENTIC_BUNDLE_MATCHED',
    expectedCategory: 'AGENTIC',
  });
}

export const datasetHighVolumeSaaS: FinancialDataset = {
  id: 'HIGH_VOLUME_SAAS',
  name: 'High-Volume SaaS Recurring Subscription Suite',
  description: '120 Micro-Transaction SaaS Subscription Payments bundled into 15 daily Razorpay settlement payouts.',
  recordCount: 120,
  bankTxns,
  gatewayRecords,
  erpInvoices,
  groundTruthVector,
};
