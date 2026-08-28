import type { BankTransaction, GatewayRecord, ERPInvoice, MatchResult } from '../types/finance';

export interface FastPathResult {
  matchedResults: MatchResult[];
  unmatchedBankTxns: BankTransaction[];
  unmatchedGatewayRecords: GatewayRecord[];
  unmatchedERPInvoices: ERPInvoice[];
}

/**
 * FastPathMatcher: Deterministic fast-path engine
 * Matches exact 1-to-1 records where Reference ID, Net Amount, Gross Amount, and Contract Fee (2.00%) align perfectly.
 * Uses 0 AI tokens and completes instantaneously.
 */
export function runFastPathMatcher(
  bankTxns: BankTransaction[],
  gatewayRecords: GatewayRecord[],
  erpInvoices: ERPInvoice[]
): FastPathResult {
  const matchedResults: MatchResult[] = [];
  const matchedBankIds = new Set<string>();
  const matchedGatewayIds = new Set<string>();
  const matchedERPIds = new Set<string>();

  for (const bTxn of bankTxns) {
    if (matchedBankIds.has(bTxn.id)) continue;

    // Search for direct Gateway record match via reference ID or descriptor inclusion
    const gMatch = gatewayRecords.find(g => {
      if (matchedGatewayIds.has(g.id)) return false;
      const refMatch = bTxn.description.includes(g.id) || bTxn.referenceNo === g.id;
      const netMatch = Math.abs(bTxn.amount - g.netAmount) < 0.01;
      return refMatch && netMatch;
    });

    if (!gMatch) continue;

    // Search for direct ERP Invoice match via order ID
    const erpMatch = erpInvoices.find(e => {
      if (matchedERPIds.has(e.id)) return false;
      const orderMatch = e.orderId === gMatch.orderId;
      const grossMatch = Math.abs(e.amount - gMatch.grossAmount) < 0.01;
      return orderMatch && grossMatch;
    });

    if (!erpMatch) continue;

    // Verify Fee Rate is contracted 2.00% rate
    const feeRate = (gMatch.feeAmount / gMatch.grossAmount) * 100;
    const isFeeContracted = Math.abs(feeRate - 2.00) < 0.05;

    if (isFeeContracted) {
      matchedBankIds.add(bTxn.id);
      matchedGatewayIds.add(gMatch.id);
      matchedERPIds.add(erpMatch.id);

      matchedResults.push({
        id: `MATCH-FP-${bTxn.id}`,
        bankRecordId: bTxn.id,
        gatewayRecordIds: [gMatch.id],
        erpInvoiceIds: [erpMatch.id],
        status: 'FAST_PATH_MATCHED',
        matchType: 'RULE_BASED',
        confidenceScore: 1.0,
        reconciledAmount: bTxn.amount,
        discrepancyAmount: 0,
        feeRateBps: 200,
        reasoningTrace: [
          `[Rule Fast-Path 100% Precision] Exact reference ID match: ${gMatch.id}`,
          `[Rule Fast-Path] Net Bank Credit (₹${bTxn.amount.toFixed(2)}) == Gateway Net (₹${gMatch.netAmount.toFixed(2)})`,
          `[Rule Fast-Path] ERP Invoice (${erpMatch.id}) Gross (₹${erpMatch.amount.toFixed(2)}) == Gateway Gross (₹${gMatch.grossAmount.toFixed(2)})`,
          `[Fee Check] Contract Fee 2.00% Verified (Fee: ₹${gMatch.feeAmount.toFixed(2)}, GST: ₹${gMatch.gstAmount.toFixed(2)})`,
        ],
      });
    }
  }

  return {
    matchedResults,
    unmatchedBankTxns: bankTxns.filter(b => !matchedBankIds.has(b.id)),
    unmatchedGatewayRecords: gatewayRecords.filter(g => !matchedGatewayIds.has(g.id)),
    unmatchedERPInvoices: erpInvoices.filter(e => !matchedERPIds.has(e.id)),
  };
}
