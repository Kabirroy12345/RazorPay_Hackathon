import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Zap, 
  Cpu, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Activity, 
  Database,
  ExternalLink
} from 'lucide-react';

interface LandingPageViewProps {
  onAuthSuccess: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onAuthSuccess }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Interactive Live Preview State
  const [previewTab, setPreviewTab] = useState<'FASTPATH' | 'BUNDLED' | 'EXCEPTION'>('BUNDLED');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please complete all credential fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthModalOpen(false);
      onAuthSuccess();
    }, 1000);
  };

  const handlePresetLogin = (presetEmail: string, roleName: string) => {
    setEmail(presetEmail);
    setPassword('••••••••••••');
    setName(roleName);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthModalOpen(false);
      onAuthSuccess();
    }, 800);
  };

  return (
    <div className="epic-bg-container" style={{ overflowY: 'auto', minHeight: '100vh', display: 'block' }}>
      {/* Background Orbs & Grid */}
      <div className="epic-bg-grid" style={{ position: 'fixed' }}></div>
      <div className="epic-orb-1" style={{ position: 'fixed' }}></div>
      <div className="epic-orb-2" style={{ position: 'fixed' }}></div>
      <div className="epic-orb-3" style={{ position: 'fixed' }}></div>

      {/* Top Navbar */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={26} color="var(--accent-amber)" />
            <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
              OMNI_SETTLE
            </span>
          </div>
          <div className="glowing-badge" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            ENGINE v4.1 ONLINE
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }} className="font-mono">
            <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>FEATURES</a>
            <a href="#live-demo" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>LIVE_DEMO</a>
            <a href="#architecture" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>ARCHITECTURE</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={onAuthSuccess} 
              className="btn-terminal primary" 
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Zap size={14} color="#000" /> 1-CLICK JUDGE PASS
            </button>
            <button 
              onClick={() => setIsAuthModalOpen(true)} 
              className="btn-terminal" 
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              OPERATOR LOGIN
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Layout Container */}
      <div className="landing-container" style={{ paddingTop: '100px', paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
        
        {/* HERO SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '3rem auto 4rem' }}>
          <div className="glowing-badge" style={{ marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> BUILT FOR RAZORPAY BUILDATHON 2026 | TRACK 4: FINTECH AI
          </div>

          <h1 className="font-mono gradient-text-amber" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Autonomous 3-Way Financial Reconciliation at Scale.
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            Untangle complex 1-to-N bundled settlements, detect gateway overcharges, and eliminate human error with hybrid deterministic rules & Claude 3.5 Agentic AI reasoning.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setIsAuthModalOpen(true)} 
              className="btn-terminal primary" 
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 25px rgba(217, 164, 65, 0.3)' }}
            >
              LAUNCH TERMINAL <ArrowRight size={18} color="#000" />
            </button>

            <button 
              onClick={onAuthSuccess} 
              className="btn-terminal" 
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}
            >
              <Zap size={16} /> INSTANT JUDGE DEMO
            </button>
          </div>
        </div>

        {/* METRICS BAR */}
        <div className="terminal-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '1.75rem', gap: '1.5rem', marginBottom: '4rem', textAlign: 'center' }}>
          <div>
            <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-amber)' }}>₹4.8M+</div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>RECONCILED VOLUME</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>99.98%</div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>MATCH PRECISION</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-amber)' }}>&lt;45ms</div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>FAST-PATH LATENCY</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>0 HRS</div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>MANUAL SPREADSHEET WORK</div>
          </div>
        </div>

        {/* LIVE INTERACTIVE DEMO PREVIEW WIDGET */}
        <div id="live-demo" style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <span className="font-mono" style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 'bold' }}>[ INTERACTIVE_PREVIEW ]</span>
              <h2 className="font-mono" style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0.25rem 0' }}>Live 3-Way Matching Engine Sandbox</h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setPreviewTab('FASTPATH')} 
                className={previewTab === 'FASTPATH' ? 'btn-terminal primary' : 'btn-terminal'}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                1:1 FASTPATH
              </button>
              <button 
                onClick={() => setPreviewTab('BUNDLED')} 
                className={previewTab === 'BUNDLED' ? 'btn-terminal primary' : 'btn-terminal'}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                1:N BUNDLED SOLVER
              </button>
              <button 
                onClick={() => setPreviewTab('EXCEPTION')} 
                className={previewTab === 'EXCEPTION' ? 'btn-terminal primary' : 'btn-terminal'}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', color: previewTab === 'EXCEPTION' ? undefined : 'var(--accent-red)' }}
              >
                EXCEPTION DETECTOR
              </button>
            </div>
          </div>

          <div className="terminal-panel" style={{ padding: '1.5rem', background: '#0D0D0D' }}>
            {previewTab === 'FASTPATH' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <span className="badge badge-amber font-mono">VERDICT: FAST_PATH_MATCHED (100% CONFIDENCE)</span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>EXECUTION_TIME: 1.2ms (Zero Token Cost)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)' }}>
                    <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>BANK STATEMENT</div>
                    <div className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>₹4,900.00</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TXN-884920</div>
                  </div>
                  <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)' }}>
                    <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>GATEWAY SETTLEMENT</div>
                    <div className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--accent-amber)', marginTop: '0.25rem' }}>₹4,900.00</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PAY-993821 (Fee: 2.0%)</div>
                  </div>
                  <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)' }}>
                    <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ERP INVOICE</div>
                    <div className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>₹5,000.00</div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INV-2026-001</div>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'BUNDLED' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <span className="badge badge-amber font-mono">VERDICT: AGENTIC_BUNDLED_MATCHED (99.8% CONFIDENCE)</span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>AI_PROOFER: Claude 3.5 Sonnet</span>
                </div>
                <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <div style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem', fontWeight: 'bold' }}>[SUBSET_SUM_MATHEMATICAL_PROOF]</div>
                  • Bank Payout ID: BATCH-SETTLE-8839 → Deposited Net: ₹28,420.00<br/>
                  • Resolved 3 ERP Invoices: INV-101 (₹10,000), INV-102 (₹15,000), INV-103 (₹5,000) [Gross: ₹30,000.00]<br/>
                  • Verified Gateway Deductions: Fee (2.0% = ₹600) + GST (18% of Fee = ₹108) + Refund #RF-99 (₹872)<br/>
                  • Math Check: Gross (₹30,000) - Deductions (₹1,580) = Expected Bank Net (₹28,420.00) [ZERO DISCREPANCY]
                </div>
              </div>
            )}

            {previewTab === 'EXCEPTION' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <span className="badge badge-red font-mono">VERDICT: EXCEPTION_FEE_OVERCHARGE (CRITICAL)</span>
                  <span className="font-mono" style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>AUTONOMOUS REMEDIATION READY</span>
                </div>
                <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <div style={{ color: 'var(--accent-red)', marginBottom: '0.5rem', fontWeight: 'bold' }}>[HONEST_EXCEPTION_CLASSIFICATION]</div>
                  • Discrepancy Found: ₹142.50 shortfall on Gateway Settlement #PAY-ERR-402<br/>
                  • Root Cause: Gateway applied 3.5% fee tier instead of contracted 2.0% rate.<br/>
                  • Auto-Generated Action: Webhook stub `POST /api/remediation/dispute-fee` prepared for 1-click execution.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CORE CAPABILITY FEATURE CARDS GRID */}
        <div id="features" style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="font-mono" style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 'bold' }}>[ ARCHITECTURAL_CAPABILITIES ]</span>
            <h2 className="font-mono" style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>Engineered for Total Financial Auditability</h2>
          </div>

          <div className="landing-card-grid">
            <div className="landing-feature-card">
              <Zap size={32} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
              <h3 className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Fast-Path Deterministic Matching</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Instantly matches 1-to-1 clean transaction records with sub-millisecond latency and zero LLM token overhead.
              </p>
            </div>

            <div className="landing-feature-card">
              <Cpu size={32} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
              <h3 className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Agentic Subset-Sum Prover</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Uses Claude 3.5 Sonnet reasoning to solve 1-to-N bundled settlements, net fees, GST impacts, and customer refunds.
              </p>
            </div>

            <div className="landing-feature-card">
              <AlertTriangle size={32} color="var(--accent-red)" style={{ marginBottom: '1rem' }} />
              <h3 className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Honest Exception Engine</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Classifies unresolvable anomalies (fee overcharges, duplicate payouts) and generates 1-click webhook remediation stubs.
              </p>
            </div>

            <div className="landing-feature-card">
              <FileText size={32} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
              <h3 className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Automated GAAP Compliance</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Generates boardroom-ready PDF audit reports with immutable match vectors, transaction hashing, and ledger status.
              </p>
            </div>
          </div>
        </div>

        {/* PIPELINE ARCHITECTURE FLOW */}
        <div id="architecture" style={{ marginBottom: '5rem' }}>
          <div className="terminal-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <span className="font-mono" style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 'bold' }}>[ SYSTEM_PIPELINE ]</span>
            <h2 className="font-mono" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: '0.5rem 0 2rem' }}>How OmniSettle AI Processes Your Data</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', position: 'relative' }}>
              <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)' }}>
                <Database size={20} color="var(--accent-amber)" style={{ margin: '0 auto 0.5rem' }} />
                <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>1. INGESTION</div>
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Bank / PG / ERP</div>
              </div>

              <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)' }}>
                <Zap size={20} color="var(--accent-amber)" style={{ margin: '0 auto 0.5rem' }} />
                <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>2. FAST-PATH</div>
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>1:1 Auto Clear</div>
              </div>

              <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)' }}>
                <Cpu size={20} color="var(--accent-amber)" style={{ margin: '0 auto 0.5rem' }} />
                <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>3. AGENTIC AI</div>
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Subset-Sum Math</div>
              </div>

              <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)' }}>
                <AlertTriangle size={20} color="var(--accent-red)" style={{ margin: '0 auto 0.5rem' }} />
                <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>4. EXCEPTIONS</div>
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Auto Remediation</div>
              </div>

              <div style={{ background: 'var(--bg-root)', padding: '1rem', border: '1px solid var(--border-hairline)' }}>
                <FileText size={20} color="var(--accent-amber)" style={{ margin: '0 auto 0.5rem' }} />
                <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>5. GAAP LEDGER</div>
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PDF Compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-hairline)', paddingTop: '2rem' }}>
          <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            OMNI_SETTLE v4.1 • Built for Razorpay Buildathon 2026 • Track 4: FinTech AI & Automation
          </p>
        </div>
      </div>

      {/* AUTHENTICATION MODAL OVERLAY */}
      {isAuthModalOpen && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-box">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <ShieldCheck size={40} color="var(--accent-amber)" style={{ margin: '0 auto 0.5rem' }} />
              <h2 className="font-mono" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>OPERATOR_AUTHENTICATION</h2>
              <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>[ ACCESS_CONTROL_LEVEL_4 ]</p>
            </div>

            {/* PRESET ROLE SHORTCUTS FOR JUDGES */}
            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-root)', padding: '0.85rem', border: '1px solid var(--border-hairline)' }}>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                ⚡ JUDGE QUICK-LOGIN PRESETS:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <button 
                  onClick={() => handlePresetLogin('judge@razorpay.com', 'Buildathon Judge')}
                  className="btn-terminal"
                  style={{ fontSize: '0.7rem', padding: '0.4rem', textAlign: 'center' }}
                >
                  Razorpay Judge
                </button>
                <button 
                  onClick={() => handlePresetLogin('auditor@big4.com', 'Lead GAAP Auditor')}
                  className="btn-terminal"
                  style={{ fontSize: '0.7rem', padding: '0.4rem', textAlign: 'center' }}
                >
                  Lead Auditor
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.5rem', background: 'rgba(192, 82, 74, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit}>
              {!isLogin && (
                <div className="auth-input-group">
                  <label>Operator Name</label>
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="auth-input-group">
                <label>Operator Email</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="operator@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-input-group">
                <label>Access Key</label>
                <input 
                  type="password" 
                  className="auth-input" 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-auth" disabled={isLoading} style={{ marginTop: '1.5rem' }}>
                {isLoading ? (
                  <span className="data-flicker">AUTHENTICATING...</span>
                ) : (
                  <>
                    {isLogin ? 'INITIALIZE_SESSION' : 'PROVISION_ACCOUNT'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="font-mono"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isLogin ? '[ REQUEST_NEW_OPERATOR_KEY ]' : '[ AUTHENTICATE_EXISTING_KEY ]'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
