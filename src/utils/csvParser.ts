import type { FinancialDataset, BankTransaction, GatewayRecord, ERPInvoice } from '../types/finance';

export function parseCustomCSVText(
  bankCsvText: string,
  gatewayCsvText: string,
  erpCsvText: string
): FinancialDataset {
  const bankTxns = parseBankCSV(bankCsvText);
  const gatewayRecords = parseGatewayCSV(gatewayCsvText);
  const erpInvoices = parseERPCSV(erpCsvText);

  return {
    id: 'CUSTOM_UPLOAD',
    name: 'Custom User Uploaded Financial Data',
    description: `Parsed from custom user CSV files: ${bankTxns.length} Bank, ${gatewayRecords.length} Gateway, ${erpInvoices.length} ERP Invoices.`,
    recordCount: bankTxns.length + gatewayRecords.length + erpInvoices.length,
    bankTxns,
    gatewayRecords,
    erpInvoices,
    groundTruthVector: [],
  };
}

function parseBankCSV(text: string): BankTransaction[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) return [];

  const results: BankTransaction[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
    if (cols.length >= 4) {
      results.push({
        id: cols[0] || `BANK-USER-${i}`,
        date: cols[1] || '2026-08-28',
        description: cols[2] || 'USER BANK CREDIT',
        amount: parseFloat(cols[3]) || 0,
        type: 'CREDIT',
        referenceNo: cols[4] || cols[0] || '',
        currency: (cols[5] as any) || 'INR',
      });
    }
  }
  return results;
}

function parseGatewayCSV(text: string): GatewayRecord[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) return [];

  const results: GatewayRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
    if (cols.length >= 5) {
      const gross = parseFloat(cols[3]) || 0;
      const fee = parseFloat(cols[4]) || Number((gross * 0.02).toFixed(2));
      const gst = Number((fee * 0.18).toFixed(2));
      const net = gross - fee - gst;

      results.push({
        id: cols[0] || `RZP-USER-${i}`,
        orderId: cols[1] || `ORD-USER-${i}`,
        customerName: cols[2] || `User Customer ${i}`,
        grossAmount: gross,
        feeAmount: fee,
        gstAmount: gst,
        netAmount: net,
        status: 'SETTLED',
        timestamp: '2026-08-28T12:00:00Z',
        currency: 'INR',
      });
    }
  }
  return results;
}

function parseERPCSV(text: string): ERPInvoice[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) return [];

  const results: ERPInvoice[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
    if (cols.length >= 4) {
      results.push({
        id: cols[0] || `INV-USER-${i}`,
        orderId: cols[1] || `ORD-USER-${i}`,
        customerName: cols[2] || `User Customer ${i}`,
        amount: parseFloat(cols[3]) || 0,
        currency: 'INR',
        date: cols[4] || '2026-08-28',
        status: 'PAID',
      });
    }
  }
  return results;
}
