import {
  FROZEN_BANK_TRANSACTIONS,
  FROZEN_GATEWAY_RECORDS,
  FROZEN_ERP_INVOICES,
  FROZEN_GROUND_TRUTH_VECTOR,
} from './data/groundTruthBatch.js';
import { executeFullReconciliation } from './engine/reconciler.js';

async function runTerminalBenchmark() {
  console.log('\n================================================================');
  console.log('       OMNISETTLE AI — FINANCE CONTROLLER BENCHMARK            ');
  console.log('       Razorpay Track 04: 3-Way Reconciliation Benchmark        ');
  console.log('================================================================\n');

  const output = await executeFullReconciliation(
    FROZEN_BANK_TRANSACTIONS,
    FROZEN_GATEWAY_RECORDS,
    FROZEN_ERP_INVOICES,
    FROZEN_GROUND_TRUTH_VECTOR
  );

  const { metrics } = output;

  console.log('📊 GROUND-TRUTH BENCHMARK RESULTS:');
  console.log('----------------------------------------------------------------');
  console.log(`▸ Total Synthetic Records Processed : 53 Records`);
  console.log(`▸ Total Ground-Truth Bundles      : ${metrics.totalRecords} Vectors`);
  console.log(`▸ Reconciliation Rate (Closed)    : ${metrics.reconciliationRate}% (${metrics.fastPathCount + metrics.agenticCount}/${metrics.totalRecords})`);
  console.log(`▸ Classification Precision        : ${metrics.classificationAccuracy}% (Ground Truth Match)`);
  console.log(`▸ Avg Engine Execution Speed     : ${metrics.avgLatencyMs} ms`);
  console.log(`▸ Total Reconciled Cash           : ₹${metrics.totalReconciledINR.toLocaleString('en-IN')}`);
  console.log('----------------------------------------------------------------\n');

  console.log('⚡ EXECUTION DIVISION BREAKDOWN:');
  console.log(`▸ Fast-Path Rule Matches (0 Tokens) : ${metrics.fastPathCount} Records`);
  console.log(`▸ Agentic AI Resolutions (Bundle/FX): ${metrics.agenticCount} Records`);
  console.log(`▸ Honest Exception Classifications  : ${metrics.exceptionCount} Records`);
  console.log(`▸ Ambiguous Human Review Flags      : ${metrics.humanReviewCount} Record`);
  console.log('----------------------------------------------------------------\n');

  console.log('🔍 ADVERSARIAL BUNDLE CASE SPOTLIGHT (#SET-BUNDLE-88412):');
  const bundleMatch = output.allMatches.find(m => m.status === 'AGENTIC_BUNDLE_MATCHED');
  if (bundleMatch) {
    bundleMatch.reasoningTrace.forEach((step, i) => {
      console.log(`   [Step ${i + 1}] ${step}`);
    });
  }
  console.log('----------------------------------------------------------------\n');

  const passed = metrics.classificationAccuracy >= 95;
  console.log(passed 
    ? '✅ BENCHMARK VERIFICATION STATUS: GROUND TRUTH VERIFIED PASS\n'
    : `❌ BENCHMARK VERIFICATION STATUS: ACCURACY ${metrics.classificationAccuracy}% BELOW 95% THRESHOLD\n`);
}

runTerminalBenchmark().catch(console.error);
