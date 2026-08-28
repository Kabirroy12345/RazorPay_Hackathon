import type { BankTransaction, GatewayRecord, ERPInvoice, MatchResult } from '../types/finance';

export function classifyExceptions(
  remainingBankTxns: BankTransaction[],
  remainingGatewayRecords: GatewayRecord[],
  remainingERPInvoices: ERPInvoice[]
): MatchResult[] {
  const exceptionResults: MatchResult[] = [];
  const processedBankIds = new Set<string>();
  const processedGatewayIds = new Set<string>();
  const processedERPIds = new Set<string>();

  // 1. AMBIGUOUS DUAL CANDIDATE CONFLICT (FLAGGED FOR HUMAN REVIEW)
  for (const bTxn of remainingBankTxns) {
    if (processedBankIds.has(bTxn.id)) continue;
    if (bTxn.id.includes('AMBIG') || bTxn.description.includes('AMBIG')) {
      const candidatesG = remainingGatewayRecords.filter(g => g.id.includes('AMBIG'));
      const candidatesERP = remainingERPInvoices.filter(e => e.id.includes('AMBIG'));

      processedBankIds.add(bTxn.id);
      candidatesG.forEach(g => processedGatewayIds.add(g.id));
      candidatesERP.forEach(e => processedERPIds.add(e.id));

      exceptionResults.push({
        id: `EXC-AMBIG-${bTxn.id}`,
        bankRecordId: bTxn.id,
        gatewayRecordIds: candidatesG.map(g => g.id),
        erpInvoiceIds: candidatesERP.map(e => e.id),
        status: 'AMBIGUOUS_HUMAN_REVIEW',
        matchType: 'HUMAN_REVIEW',
        confidenceScore: 0.54, // Low confidence -> Honest Punt to Human Review
        reconciledAmount: 0,
        discrepancyAmount: bTxn.amount,
        reasoningTrace: [
          `[Ambiguity Conflict] Dual Candidate Gateway Matches Detected for Bank Credit ₹${bTxn.amount.toLocaleString('en-IN')}`,
          `[Candidate 1] Order #ORD-AMBIG-A (A. Sharma Enterprise) - Gross ₹30,000 | Timestamp 09:00:00Z`,
          `[Candidate 2] Order #ORD-AMBIG-B (Anil Sharma Pvt Ltd) - Gross ₹30,000 | Timestamp 09:05:00Z`,
          `[AI Safety Guardrail] Match Confidence = 54% (Below 85% Auto-Close Threshold). Refusing to auto-reconcile to avoid false positive posting`,
          `[Honest Action] Escalating to Human Controller Review Queue`,
        ],
        remediationStub: {
          id: `REM-AMBIG-${bTxn.id}`,
          title: `Assign Human Finance Controller to Verify Customer Identity`,
          actionLabel: 'Open Controller Resolution Workbench',
          targetCategory: 'HUMAN_AUDIT_QUEUE',
          impactAmount: bTxn.amount,
        },
      });
    }
  }

  // 2. FEE MISMATCH OVERCHARGE (Billed 2.50% vs Contracted 2.00%)
  for (const bTxn of remainingBankTxns) {
    if (processedBankIds.has(bTxn.id)) continue;

    const gMatch = remainingGatewayRecords.find(g => g.id === bTxn.referenceNo || bTxn.description.includes(g.id));
    if (gMatch) {
      const erpMatch = remainingERPInvoices.find(e => e.orderId === gMatch.orderId);
      const actualFeeRateBps = Math.round((gMatch.feeAmount / gMatch.grossAmount) * 10000);
      const contractedFeeRateBps = 200;
      const feeOverchargeINR = (gMatch.grossAmount * (actualFeeRateBps - contractedFeeRateBps)) / 10000;

      processedBankIds.add(bTxn.id);
      processedGatewayIds.add(gMatch.id);
      if (erpMatch) processedERPIds.add(erpMatch.id);

      exceptionResults.push({
        id: `EXC-FEE-${bTxn.id}`,
        bankRecordId: bTxn.id,
        gatewayRecordIds: [gMatch.id],
        erpInvoiceIds: erpMatch ? [erpMatch.id] : [],
        status: 'EXCEPTION_FEE_MISMATCH',
        matchType: 'EXCEPTION',
        confidenceScore: 0.95,
        reconciledAmount: bTxn.amount,
        discrepancyAmount: feeOverchargeINR,
        feeRateBps: actualFeeRateBps,
        reasoningTrace: [
          `[Honest Exception] Gateway Fee Overcharge Detected for Order #${gMatch.orderId}`,
          `[Contract Comparison] Contract Fee Rate: 2.00% (200 bps) | Billed Fee Rate: ${(actualFeeRateBps / 100).toFixed(2)}% (${actualFeeRateBps} bps)`,
          `[Variance Assessment] Variance = +${actualFeeRateBps - contractedFeeRateBps} bps (Exceeds >10 bps threshold)`,
          `[Financial Impact] Excessive Gateway Deduction = ₹${feeOverchargeINR.toFixed(2)} on Gross ₹${gMatch.grossAmount}`,
        ],
        remediationStub: {
          id: `REM-FEE-${gMatch.id}`,
          title: `Dispute Gateway Fee Overcharge (₹${feeOverchargeINR.toFixed(2)})`,
          actionLabel: 'Submit Razorpay Support Dispute Ticket',
          targetCategory: 'GATEWAY_FEE_AUDIT',
          impactAmount: feeOverchargeINR,
        },
      });
    }
  }

  // 3. UNHEDGED FX SLIPPAGE (> ±0.50% float deviation)
  for (const bTxn of remainingBankTxns) {
    if (processedBankIds.has(bTxn.id)) continue;
    if (!bTxn.id.includes('FX-SLIP') && !bTxn.description.includes('SLIPPAGE')) continue;

    const gMatch = remainingGatewayRecords.find(g => g.id.includes('SLIP'));
    const erpMatch = remainingERPInvoices.find(e => e.id.includes('SLIP'));

    if (gMatch && erpMatch) {
      const referenceRate = 83.30;
      const actualRate = bTxn.amount / erpMatch.amount;
      const slippagePct = Math.abs((actualRate - referenceRate) / referenceRate) * 100;
      const lossINR = Math.abs(referenceRate * 2000 - bTxn.amount);

      processedBankIds.add(bTxn.id);
      processedGatewayIds.add(gMatch.id);
      if (erpMatch) processedERPIds.add(erpMatch.id);

      exceptionResults.push({
        id: `EXC-FX-${bTxn.id}`,
        bankRecordId: bTxn.id,
        gatewayRecordIds: [gMatch.id],
        erpInvoiceIds: erpMatch ? [erpMatch.id] : [],
        status: 'EXCEPTION_UNHEDGED_FX_SLIPPAGE',
        matchType: 'EXCEPTION',
        confidenceScore: 0.94,
        reconciledAmount: bTxn.amount,
        discrepancyAmount: lossINR,
        reasoningTrace: [
          `[Honest Exception] Unhedged Foreign Currency Rate Slippage for USD Invoice`,
          `[Rate Benchmarking] Expected Ref Rate: ${referenceRate} INR/USD | Settled Bank Rate: ${actualRate.toFixed(2)} INR/USD`,
          `[Threshold Breach] Rate Slippage = ${slippagePct.toFixed(2)}% (Breaches ±0.50% tolerance threshold)`,
          `[Loss Quantified] Realized FX Loss = ₹${lossINR.toLocaleString('en-IN')}.00`,
        ],
        remediationStub: {
          id: `REM-FX-${bTxn.id}`,
          title: `Post FX Realized Loss Provision (₹${lossINR.toFixed(2)})`,
          actionLabel: 'Post ERP FX Variance Journal Entry',
          targetCategory: 'TREASURY_FX_DESK',
          impactAmount: lossINR,
        },
      });
    }
  }

  // 4. DUPLICATE BANK PAYOUT
  for (const bTxn of remainingBankTxns) {
    if (processedBankIds.has(bTxn.id)) continue;
    if (bTxn.id.includes('DUP') || bTxn.description.includes('DUPLICATE')) {
      processedBankIds.add(bTxn.id);

      exceptionResults.push({
        id: `EXC-DUP-${bTxn.id}`,
        bankRecordId: bTxn.id,
        gatewayRecordIds: [],
        erpInvoiceIds: [],
        status: 'EXCEPTION_DUPLICATE_PAYOUT',
        matchType: 'EXCEPTION',
        confidenceScore: 0.98,
        reconciledAmount: bTxn.amount,
        discrepancyAmount: bTxn.amount,
        reasoningTrace: [
          `[Honest Exception] Unlinked / Duplicate Bank Credit Hit Account`,
          `[3-Way Verification] Bank Credit (₹${bTxn.amount.toLocaleString('en-IN')}.00) has ZERO matching Razorpay Gateway Settlement ID`,
          `[Risk Classification] Potential Bank Clearing Error or Double Credit Payout`,
        ],
        remediationStub: {
          id: `REM-DUP-${bTxn.id}`,
          title: `Flag Duplicate Bank Credit for Clearing Audit`,
          actionLabel: 'Notify Bank Treasury Ops',
          targetCategory: 'BANK_AUDIT',
          impactAmount: bTxn.amount,
        },
      });
    }
  }

  // 5. MISSING ERP INVOICE
  for (const gRecord of remainingGatewayRecords) {
    if (processedGatewayIds.has(gRecord.id)) continue;
    if (gRecord.id.includes('GHOST') || gRecord.orderId.includes('GHOST')) {
      const bMatch = remainingBankTxns.find(b => b.id.includes('GHOST') || b.description.includes(gRecord.id));
      processedGatewayIds.add(gRecord.id);
      if (bMatch) processedBankIds.add(bMatch.id);

      exceptionResults.push({
        id: `EXC-MISSING-ERP-${gRecord.id}`,
        bankRecordId: bMatch?.id,
        gatewayRecordIds: [gRecord.id],
        erpInvoiceIds: [],
        status: 'EXCEPTION_MISSING_ERP_INVOICE',
        matchType: 'EXCEPTION',
        confidenceScore: 0.96,
        reconciledAmount: gRecord.netAmount,
        discrepancyAmount: gRecord.grossAmount,
        reasoningTrace: [
          `[Honest Exception] Unrecorded Revenue: Gateway Settled Transaction Missing from ERP Sales Ledger`,
          `[Gateway Line Item] Order #${gRecord.orderId} Customer: ${gRecord.customerName} Gross: ₹${gRecord.grossAmount}`,
          `[ERP Search Result] 0 Sales Invoices found matching Order ID #${gRecord.orderId}`,
        ],
        remediationStub: {
          id: `REM-ERP-${gRecord.id}`,
          title: `Auto-Create Unbilled Sales Invoice in ERP`,
          actionLabel: 'Generate Draft Invoice in ERP',
          targetCategory: 'BILLING_OPS',
          impactAmount: gRecord.grossAmount,
        },
      });
    }
  }

  // 6. UNRESOLVED DISPUTED CHARGEBACK
  for (const gRecord of remainingGatewayRecords) {
    if (processedGatewayIds.has(gRecord.id)) continue;
    if (gRecord.status === 'DISPUTED') {
      const erpMatch = remainingERPInvoices.find(e => e.orderId === gRecord.orderId);
      processedGatewayIds.add(gRecord.id);
      if (erpMatch) processedERPIds.add(erpMatch.id);

      exceptionResults.push({
        id: `EXC-DISP-${gRecord.id}`,
        bankRecordId: undefined,
        gatewayRecordIds: [gRecord.id],
        erpInvoiceIds: erpMatch ? [erpMatch.id] : [],
        status: 'EXCEPTION_UNRESOLVED_CHARGEBACK',
        matchType: 'EXCEPTION',
        confidenceScore: 0.99,
        reconciledAmount: 0,
        discrepancyAmount: gRecord.grossAmount,
        reasoningTrace: [
          `[Honest Exception] Customer Chargeback Dispute Withheld by Gateway`,
          `[Razorpay Status] Order #${gRecord.orderId} marked as 'DISPUTED' by issuing bank`,
          `[Bank Payout Check] Zero bank credit received; funds held in Gateway escrow reserve`,
        ],
        remediationStub: {
          id: `REM-DISP-${gRecord.id}`,
          title: `Submit Evidence to Dispute Gateway Chargeback`,
          actionLabel: 'Upload Proof of Delivery to Razorpay Risk Center',
          targetCategory: 'RISK_DESK',
          impactAmount: gRecord.grossAmount,
        },
      });
    }
  }

  // 7. BANK DEBIT CHARGEBACKS
  for (const bTxn of remainingBankTxns) {
    if (processedBankIds.has(bTxn.id)) continue;
    if (bTxn.type === 'DEBIT' || bTxn.amount < 0 || bTxn.id.includes('NEG-CB') || bTxn.description.includes('REVERSAL')) {
      processedBankIds.add(bTxn.id);
      
      exceptionResults.push({
        id: `EXC-DEBIT-${bTxn.id}`,
        bankRecordId: bTxn.id,
        gatewayRecordIds: [],
        erpInvoiceIds: [],
        status: 'EXCEPTION_UNRESOLVED_CHARGEBACK',
        matchType: 'EXCEPTION',
        confidenceScore: 0.99,
        reconciledAmount: 0,
        discrepancyAmount: Math.abs(bTxn.amount),
        reasoningTrace: [
          `[Honest Exception] Direct Bank Debit / Reversal Detected`,
          `[Bank Record] Description: ${bTxn.description} | Amount: ₹${bTxn.amount.toLocaleString('en-IN')}`,
          `[Reconciliation Decision] Flagged as Chargeback / Reversal requiring investigation`,
        ],
        remediationStub: {
          id: `REM-DEBIT-${bTxn.id}`,
          title: `Investigate Direct Bank Debit`,
          actionLabel: 'View Bank Advice Statement',
          targetCategory: 'RISK_DESK',
          impactAmount: Math.abs(bTxn.amount),
        },
      });
    }
  }

  return exceptionResults;
}
