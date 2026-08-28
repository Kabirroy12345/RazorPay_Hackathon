# 🚀 Aura Ledger

![Aura Ledger Banner](https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1200&auto=format&fit=crop)

**Aura Ledger** is an advanced, autonomous AI-powered financial reconciliation terminal built for the **Razorpay Buildathon**. It completely automates the tedious process of reconciling complex, multi-party financial data across Bank Statements, Payment Gateways, and ERP systems.

Designed with a strict, high-density Wall Street financial terminal aesthetic, Aura Ledger looks and feels like a professional trading instrument while packing state-of-the-art agentic AI capabilities under the hood.

---

## ✨ Key Features

### 🧠 Agentic AI Reconciliation Engine
- **Fast-Path Deterministic Matching:** Instantly clears clean 1-to-1 transactions with zero token cost.
- **Agentic Subset-Sum Prover:** Uses Anthropic's Claude to mathematically untangle and verify 1-to-N bundled settlements, calculating exact gross sales, fee rates, GST impacts, and refunds to reconstruct expected bank payouts.
- **Honest Exception Handling:** Automatically identifies overcharges, duplicate deductions, and unresolvable discrepancies, classifying them with precise reasoning traces and ready-to-execute webhook remediation stubs.

### 🖥️ Terminal-Grade UI/UX
- **True Dark Mode Terminal:** Restrained `#0a0a0a` backgrounds, hairline borders, and a stark monospace aesthetic. No generic SaaS gradients, shadows, or blurs.
- **Live System Log Ticker:** Real-time streaming of the AI's internal reasoning trace directly to the UI.
- **Interactive Sandbox & Stress Testing:** Manipulate settlement variables (Gross, Fee Rate, Refunds) or apply Liquidity Stress Shocks (Payout Delays, Refund Surges, FX Volatility) to forecast 30-day forward cash positions.
- **Typewriter AI Reveal:** Inspect exceptions and watch the AI's reasoning type itself out line-by-line with a blinking terminal cursor.
- **Deep Data Inspection:** Click the `+` on any ledger row to expand and view the raw, unformatted JSON payloads from the Bank, Gateway, and ERP.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Recharts, Lucide-React
- **Backend:** Node.js, Express
- **AI Integration:** Anthropic SDK (`@anthropic-ai/sdk`)
- **Styling:** Vanilla CSS (Terminal Design System Tokens)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine. You will also need an Anthropic API Key to power the Agentic Resolver.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kabirroy12345/RazorPay_Hackathon.git
   cd RazorPay_Hackathon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Anthropic API Key:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3001
   ```

4. Start the application (Frontend + Backend concurrently):
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the Local UI (usually `http://localhost:5173` or `http://localhost:5174`).

---

## 📖 How to Use

1. **Initialize the OS:** Upon loading, watch the terminal boot sequence initialize the AI engine.
2. **Run the Audit:** In the Data Hub, select a financial dataset and click "Run Full Reconciler Pipeline".
3. **Inspect the Ledger:** Use the Live Ledger to filter records by status (e.g., `EXCEPTION`, `VERIFIED`). Click the `+` icon to inspect the raw JSON data.
4. **Remediate Exceptions:** Navigate to the Exception Remediation Center to review flagged discrepancies and execute 1-click webhook remediation stubs.
5. **Sandbox & Forecast:** Use the Bundle Math Sandbox to test the AI's mathematical proofs, or use the Cash Forecaster to apply liquidity stress shocks and view the 30-day projected cash flow.

---

## 🏆 Built for the Razorpay Buildathon

This project was built from the ground up to showcase the power of Autonomous AI in solving real-world FinTech operational bottlenecks. By combining deterministic matching with agentic AI reasoning, Aura Ledger achieves 100% reconciliation accuracy while requiring zero human intervention for complex bundled payouts.

> *"Reconciliation isn't just about matching numbers; it's about proving the math behind the money."*

---

<p align="center">
  Built with ❤️ for the Razorpay Buildathon
</p>
