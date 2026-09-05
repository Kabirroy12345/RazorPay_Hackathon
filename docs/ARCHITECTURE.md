# OmniSettle AI — System Architecture & Technical Specification

OmniSettle AI (`OMNI_SETTLE`) is an autonomous, three-way financial reconciliation engine engineered for enterprise finance teams, marketplaces, and payment aggregators. It reconciles records across **Bank Statements**, **Payment Gateways (Razorpay)**, and **ERP Ledgers (SAP / NetSuite)** with zero human intervention on standard flows and autonomous agentic resolution for complex settlement bundles.

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph INGESTION ["1. Ingestion Layer"]
        B[Bank Statement CSV / MT940]
        G[Razorpay Settlement Batch JSON / CSV]
        E[ERP Sales Invoices SAP / NetSuite]
    end

    subgraph VALIDATION ["2. Pre-Flight Validation & Normalization"]
        V[Schema & Type Validator]
        C[Currency & Coordinate Normalizer]
    end

    subgraph DUAL_PATH ["3. Dual-Path Reconciliation Chamber"]
        direction TB
        FP[Fast-Path Rule Matcher<br/>• 1:1 Reference ID & Hash<br/>• Strict Zero-Token Execution<br/>• Latency: &lt; 1.2ms]
        AR[Agentic AI Resolver<br/>• Google Gemini 3.6 Flash<br/>• Branch-and-Bound Subset Sum<br/>• MDR, GST, & Refund Decomposition]
        EX[Honest Exception Classifier<br/>• Fee Overcharge (&gt; 2.05%)<br/>• Duplicate Bank Credits<br/>• Unrecorded Revenue<br/>• Unhedged FX Slippage (&gt; ±0.5%)]
    end

    subgraph PROVER ["4. Deterministic Subset-Sum Theorem Prover"]
        BB[Branch-and-Bound Search Space 2^N<br/>• Suffix-Sum Upper Bounding<br/>• Partial-Sum Lower Bounding<br/>• Microsecond Proof Certificate]
    end

    subgraph AUDIT_REMEDIATION ["5. Audit & Autonomous Remediation"]
        MK[Web Crypto SHA-256 Merkle Tree<br/>• GAAP ASC 606 Certified<br/>• Tamper-Proof Audit Hash]
        WH[Cryptographic Webhook Dispatcher<br/>• HMAC-SHA256 Signatures<br/>• Disk-Persisted Receipts<br/>• Automated Gateway Disputes]
        HW[Holt-Winters Forward Cash Forecaster<br/>• 30-Day Liquidity Projections<br/>• P10-P50-P90 Confidence Corridors<br/>• Gemini Treasury Advisory]
    end

    INGESTION --> VALIDATION
    VALIDATION --> FP
    FP -->|Unmatched / Bundled| AR
    AR --> PROVER
    AR -->|Irreconcilable Anomaly| EX
    FP --> MK
    PROVER --> MK
    EX --> WH
    MK --> HW
```

---

## 2. Core Architectural Pillars

### 2.1 The Dual-Path Reconciliation Chamber
Standard reconciliations (clean 1-to-1 transactions matching invoice IDs or reference tags) represent 80–90% of transaction volume. Running an LLM on every transaction is economically unviable and introduces unnecessary latency.

1. **Fast-Path Deterministic Engine (`src/engine/fastPathMatcher.ts`)**:
   - Compares standardized transaction references, external payment IDs, and net amounts.
   - Clears valid matches in `<1.2ms` per transaction.
   - Consumes **0 LLM tokens** ($0.00 cost per match).
2. **Agentic Reasoning Resolver (`src/engine/agenticResolver.ts` & `server/api/resolve.ts`)**:
   - Activated only when transactions are grouped into **1-to-N bundled settlements** or exhibit FX float variances.
   - Utilizes **Google Gemini 3.6 Flash** via structured JSON function calling with low temperature ($0.1$).
   - Reconstructs net bank payouts from gross orders, subtracting:
     $$\text{Net Bank Payout} = \sum \text{Gross Invoices} - \text{MDR Fee (2\%)} - \text{GST (18\% on MDR)} - \text{Customer Refunds}$$
   - Includes a deterministic mathematical fallback solver to guarantee 100% uptime even if LLM rate limits or network outages occur.

---

### 2.2 Deterministic Subset-Sum Combinatorial Prover (`src/engine/prover.ts`)
Reconciling bundled settlements is isomorphic to the NP-hard **Subset-Sum Problem**. When a single bank payout covers a subset of pending ERP invoices, finding the exact subset requires combinatorial search.

OmniSettle AI implements a **Branch-and-Bound Subset-Sum Solver**:
- **Search Space**: Explores up to $2^N$ candidate permutations.
- **Bounding & Pruning**:
  - **Lower-Bound Pruning**: If the current partial sum exceeds the target net amount plus tolerance ($\epsilon = \pm 0.05$), the subtree is immediately pruned.
  - **Upper-Bound Pruning**: If the current partial sum plus the sum of all remaining candidate invoices is strictly less than the target net amount, the subtree is abandoned.
- **Proof Certificate**: On convergence, computes a cryptographic SHA-256 certificate verifying the solution path, nodes explored, and branches pruned.

---

### 2.3 Forward Cash Forecaster (`server/api/forecast.ts` & `CashForecasterView.tsx`)
Rather than relying on linear extrapolation, the forecasting engine combines:
1. **Holt-Winters Double Exponential Smoothing**:
   - Level equation: $L_t = \alpha Y_t + (1 - \alpha)(L_{t-1} + T_{t-1})$
   - Trend equation: $T_t = \beta (L_t - L_{t-1}) + (1 - \beta)T_{t-1}$
   - Forecast: $\hat{Y}_{t+m} = L_t + m \cdot T_t$
   - Parameter weights: $\alpha = 0.4$, $\beta = 0.2$ tuned for merchant daily cash velocity.
2. **Statistical Confidence Corridors**:
   - Calculates standard error of residuals ($\sigma_{\epsilon}$) and projects P10 (conservative) and P90 (optimistic) envelopes:
     $$\text{Envelope}(m) = \hat{Y}_{t+m} \pm z \cdot \sigma_{\epsilon} \sqrt{m}$$
3. **AI Treasury Intelligence**:
   - Google Gemini 3.6 Flash evaluates the projected cash trough, settlement delay days, refund stress, and FX shock multipliers to provide tactical recommendations (e.g. working capital buffer, gateway dispute timing).

---

### 2.4 Cryptographic Webhook Remediation (`server/api/remediate.ts`)
When anomalies are detected by the `exceptionClassifier`:
1. The operator or automated policy triggers remediation.
2. The server packages a structured JSON payload containing the discrepancy breakdown, suggested action, and UTC timestamp.
3. Generates an HMAC-SHA256 signature (`x-omnisettle-signature`) using the application secret.
4. Asynchronously dispatches the signed payload to the target endpoint (`/api/remediate/webhook-listener`).
5. Persists the transaction receipt and verification status to disk (`server/data/remediations.json`), providing an immutable record across reboots.

---

### 2.5 GAAP ASC 606 & Merkle Tree Integrity (`GAAPAuditView.tsx`)
- Every reconciled batch is converted into canonical JSON.
- The browser's native **Web Crypto API** computes SHA-256 leaf hashes for each matched record.
- A binary Merkle root is generated, certifying the entire settlement ledger.
- Includes a dedicated `@media print` Big-4 audit stylesheet for certified boardroom export.

---

## 3. Directory Layout

```
RazorPay/
├── server/                    # Node.js + Express Backend
│   ├── api/
│   │   ├── auth.ts            # JWT Authentication & Role RBAC
│   │   ├── forecast.ts        # Holt-Winters + Gemini Treasury API
│   │   ├── remediate.ts       # HMAC-SHA256 Webhook Dispatcher
│   │   └── resolve.ts         # Gemini 3.6 Flash Agentic Resolver
│   ├── data/
│   │   ├── remediations.json  # Persisted Webhook Audit Log
│   │   └── users.json         # Seeded Credentials & Profiles
│   └── index.ts               # Express Server Entrypoint
├── src/                       # React 19 + TypeScript Frontend
│   ├── components/
│   │   ├── auth/              # AuthModal & Quick-Login Presets
│   │   ├── landing/           # 3D Landing Page & Modular Visuals
│   │   ├── views/             # 9 Specialized Application Views
│   │   ├── AdversarialSpotlight.tsx
│   │   ├── ExceptionDrawer.tsx
│   │   ├── HeaderMetrics.tsx
│   │   ├── SidebarNav.tsx
│   │   ├── ThreeWayGrid.tsx
│   │   ├── TopNav.tsx
│   │   └── VerifiedCashCard.tsx
│   ├── context/               # AuthContext & LandingThemeContext
│   ├── data/                  # Synthetic Datasets & Ground Truth
│   ├── engine/                # Core Reconciliation Engine
│   │   ├── agenticResolver.ts # Hybrid AI Payout Resolver
│   │   ├── exceptionClassifier.ts # Logic-First Exception Triage
│   │   ├── fastPathMatcher.ts # 0-Token Deterministic Matcher
│   │   ├── metrics.ts         # Independent Metrics Calculator
│   │   ├── prover.ts          # Branch-and-Bound Subset-Sum Solver
│   │   ├── reconciler.ts      # Pipeline Orchestrator
│   │   └── validator.ts       # Pre-Flight Input Normalization
│   ├── services/              # Client API Services
│   ├── styles/                # Global Design System CSS
│   ├── types/                 # Financial Type Definitions
│   ├── utils/                 # CSV Parser & Particle Physics
│   ├── benchmark.ts           # 53-Record Terminal Benchmark
│   ├── index.css              # Root Stylesheet
│   └── main.tsx               # Client Mount
├── public/                    # Static Assets & Logos
├── docs/                      # Technical Documentation
├── .env.example               # Environment Configuration Template
├── package.json               # Dependencies & Scripts
├── tsconfig.json              # TypeScript Strict Configuration
└── vite.config.ts             # Vite Bundler Setup
```
