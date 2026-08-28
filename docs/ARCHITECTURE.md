# OmniSettle AI Architecture

## Data Flow Diagram

```mermaid
graph TD
    A[Data Ingestion (Bank, Gateway, ERP)] --> B(Fast-Path Matcher)
    B -->|Matched (100% Certainty)| E{Independent Metrics Engine}
    B -->|Unmatched (Ambiguous)| C(Agentic Resolver - LLM)
    C -->|Bundle/FX Judgement| E
    C -->|Unresolved| D(Exception Classifier)
    D --> E
    E --> F[Dashboard UI / Output]
```

## Architectural Decisions

1. **Deterministic Rules First**: The `fastPathMatcher` processes all 1-to-1 exact ID and net amount matches using rigid algorithmic rules, ensuring 0 LLM tokens are wasted on trivial reconciliations.
2. **LLM for Ambiguity**: The `agenticResolver` is exclusively used for NP-hard subset-sum bundle decompositions and fuzzy FX/fee tolerance judgements, returning structured JSON.
3. **Model Choice**: `claude-3-5-sonnet-20240620` via the Anthropic API is chosen for its superior JSON constraint adherence and logical reasoning trace capabilities on financial math.
4. **Tolerance Thresholds**: FX float is restricted to a strict ±0.5% tolerance band, and fee variance is restricted to >10bps. Anything outside these bands is formally classified as an exception rather than silently absorbed.
5. **Decoupled Metrics Calculation**: The engine does *not* self-report its own accuracy. The `metrics.ts` module independently compares the engine's outputs against the frozen ground truth matrix.
6. **Backend Proxy**: To ensure the Anthropic API key is never exposed to the client bundle, the React frontend strictly interfaces with a Node/Express backend at `/api/resolve`.
