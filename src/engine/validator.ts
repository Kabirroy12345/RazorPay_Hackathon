import type { BankTransaction, GatewayRecord, ERPInvoice, MatchResult } from '../types/finance';

export interface ValidationResult {
  validBankTxns: BankTransaction[];
  validGatewayRecords: GatewayRecord[];
  validERPInvoices: ERPInvoice[];
  pipelineParseExceptions: MatchResult[];
}

export function validateReconciliationBatch(
  bankTxns: BankTransaction[],
  gatewayRecords: GatewayRecord[],
  erpInvoices: ERPInvoice[]
): ValidationResult {
  const pipelineParseExceptions: MatchResult[] = [];
  const validBankTxns: BankTransaction[] = [];
  const validGatewayRecords: GatewayRecord[] = [];
  const validERPInvoices: ERPInvoice[] = [];

  // Validate Bank Transactions
  for (const bTxn of bankTxns) {
    if (bTxn.isMalformed || !isFinite(bTxn.amount) || !bTxn.id) {
      pipelineParseExceptions.push({
        id: `MATCH-ERR-${bTxn.id || 'UNKNOWN'}`,
        bankRecordId: bTxn.id,
        gatewayRecordIds: [],
        erpInvoiceIds: [],
        status: 'PIPELINE_PARSE_CORRECTION_FALLBACK',
        matchType: 'EXCEPTION',
        confidenceScore: 1.0,
        reconciledAmount: 0,
        discrepancyAmount: 0,
        reasoningTrace: [
          `[Engine Pre-Flight Check] Malformed record or NaN amount detected on Bank Txn ${bTxn.id || 'UNKNOWN'}.`,
          `[Validation Layer] Safely isolated and bypassed corrupted line. Continued processing remaining batch.`
        ],
      });
    } else {
      validBankTxns.push(bTxn);
    }
  }

  // Validate Gateway Records
  for (const gRec of gatewayRecords) {
    if (!isFinite(gRec.grossAmount) || !gRec.id) {
      pipelineParseExceptions.push({
        id: `MATCH-ERR-GW-${gRec.id || 'UNKNOWN'}`,
        bankRecordId: undefined,
        gatewayRecordIds: [gRec.id],
        erpInvoiceIds: [],
        status: 'PIPELINE_PARSE_CORRECTION_FALLBACK',
        matchType: 'EXCEPTION',
        confidenceScore: 1.0,
        reconciledAmount: 0,
        discrepancyAmount: 0,
        reasoningTrace: [
          `[Engine Pre-Flight Check] Malformed Gateway record detected: ${gRec.id || 'UNKNOWN'}.`
        ],
      });
    } else {
      validGatewayRecords.push(gRec);
    }
  }

  // Validate ERP Invoices
  for (const erp of erpInvoices) {
    if (!isFinite(erp.amount) || !erp.id) {
      pipelineParseExceptions.push({
        id: `MATCH-ERR-ERP-${erp.id || 'UNKNOWN'}`,
        bankRecordId: undefined,
        gatewayRecordIds: [],
        erpInvoiceIds: [erp.id],
        status: 'PIPELINE_PARSE_CORRECTION_FALLBACK',
        matchType: 'EXCEPTION',
        confidenceScore: 1.0,
        reconciledAmount: 0,
        discrepancyAmount: 0,
        reasoningTrace: [
          `[Engine Pre-Flight Check] Malformed ERP record detected: ${erp.id || 'UNKNOWN'}.`
        ],
      });
    } else {
      validERPInvoices.push(erp);
    }
  }

  return {
    validBankTxns,
    validGatewayRecords,
    validERPInvoices,
    pipelineParseExceptions
  };
}
