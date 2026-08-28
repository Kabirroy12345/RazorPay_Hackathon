import type { FinancialDataset, BankTransaction, GatewayRecord, ERPInvoice, GroundTruthEntry } from '../../types/finance';

const bankTxns: BankTransaction[] = [];
const gatewayRecords: GatewayRecord[] = [];
const erpInvoices: ERPInvoice[] = [];
const groundTruthVector: GroundTruthEntry[] = [];

const currencies: Array<{ code: 'USD' | 'EUR' | 'GBP' | 'SGD'; refRate: number; name: string }> = [
  { code: 'USD', refRate: 83.30, name: 'North America Corp' },
  { code: 'EUR', refRate: 90.15, name: 'EuroZone Enterprise GmbH' },
  { code: 'GBP', refRate: 105.40, name: 'London Tech Holdings Ltd' },
  { code: 'SGD', refRate: 61.80, name: 'Singapore SaaSOps Pte' },
];

let counter = 1;
currencies.forEach(curr => {
  for (let i = 1; i <= 10; i++) {
    const pad = counter.toString().padStart(3, '0');
    const grossForeign = 500 + i * 250;
    const feeForeign = Number((grossForeign * 0.025).toFixed(2)); // 2.5% FX cross-border fee
    const gstForeign = Number((feeForeign * 0.18).toFixed(2));
    const netForeign = Number((grossForeign - feeForeign - gstForeign).toFixed(2));

    const spotRate = curr.refRate * (1 + (i % 3 === 0 ? 0.003 : -0.002));
    const bankInwardINR = Number((netForeign * spotRate).toFixed(2));

    const date = `2026-08-${(5 + (i % 20)).toString().padStart(2, '0')}`;
    const txnId = `RZP-FX-${pad}`;
    const orderId = `ORD-FX-${pad}`;
    const invId = `INV-FX-${pad}`;
    const bankId = `BANK-FX-${pad}`;

    bankTxns.push({
      id: bankId,
      date,
      description: `INWARD REMITTANCE ${curr.code} ${netForeign} @ ${spotRate.toFixed(2)} INR/${curr.code}`,
      amount: bankInwardINR,
      type: 'CREDIT',
      referenceNo: txnId,
      currency: 'INR',
    });

    gatewayRecords.push({
      id: txnId,
      settlementId: `SET-FX-${pad}`,
      orderId,
      customerName: `${curr.name} #${i}`,
      grossAmount: grossForeign,
      feeAmount: feeForeign,
      gstAmount: gstForeign,
      netAmount: netForeign,
      status: 'SETTLED',
      timestamp: `${date}T12:00:00Z`,
      currency: curr.code,
      fxRate: spotRate,
    });

    erpInvoices.push({
      id: invId,
      orderId,
      customerName: `${curr.name} #${i}`,
      amount: grossForeign,
      currency: curr.code,
      date,
      status: 'PAID',
    });

    groundTruthVector.push({
      bankId,
      gatewayIds: [txnId],
      erpIds: [invId],
      expectedStatus: 'AGENTIC_FX_MATCHED',
      expectedCategory: 'AGENTIC',
    });

    counter++;
  }
});

export const datasetMultiCurrencyFX: FinancialDataset = {
  id: 'MULTI_CURRENCY_FX',
  name: 'Enterprise Multi-Currency FX Float Suite',
  description: '40 Cross-Border Remittances across USD, EUR, GBP, and SGD with floating spot exchange rates, cross-border fee structures, and hedging variance checks.',
  recordCount: 40,
  bankTxns,
  gatewayRecords,
  erpInvoices,
  groundTruthVector,
};
