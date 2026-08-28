# Failure Log: Aura Ledger

This log documents genuine API failures, malformed data edge cases, and systemic breakage encountered during the development of the LLM-backed agentic resolver, along with the implemented self-healing solutions.

## Incident 1: LLM JSON Malformation (Trailing Commas)
**Date**: 2026-08-28
**Context**: During early tests of the subset-sum reasoning prompt, Claude occasionally returned valid JSON but with a trailing comma in the `matchedInvoiceIds` array (e.g., `["INV-1", "INV-2",]`).
**Impact**: `JSON.parse()` threw a `SyntaxError`, causing the entire batch reconciliation to crash and leaving records unresolved.
**Fix**: Added a formal structured JSON schema in the system prompt demanding stringent JSON adherence, and implemented a `try/catch` wrapper in the backend proxy route. On parse failure, the backend immediately triggers a 1x retry prompt: `Your previous response contained invalid JSON. Return strictly valid JSON.`

## Incident 2: Malformed Dataset Record Missing Amount
**Date**: 2026-08-28
**Context**: A record in the holdout batch arrived with `amount: null` (simulating a malformed CSV export).
**Impact**: The Fast-Path matcher choked because `NaN === NaN` is false, and it leaked into the Agentic Resolver, which hallucinated a massive variance amount.
**Fix**: Added a strict Zod-style validation layer at the start of the reconciliation pipeline. If `!isFinite(record.amount)`, the engine safely ejects the record *before* Fast-Path matching, assigning it a `PIPELINE_PARSE_CORRECTION_FALLBACK` status. The batch run completes safely.

## Incident 3: API Timeout on Heavy Bundles
**Date**: 2026-08-28
**Context**: When testing against a massive 20-invoice bundle, the Anthropic API took > 25 seconds to stream the reasoning trace.
**Impact**: The client-side `fetch` request timed out (default 15s in our frontend config), breaking the progressive run.
**Fix**: Extended the backend `fetch` timeout to 45s, and implemented real latency measurement (`performance.now()`). The frontend now correctly awaits the long resolution, displaying a loading state, rather than prematurely crashing.
