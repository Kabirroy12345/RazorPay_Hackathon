import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthTab = 'PASSWORD' | 'OTP' | 'DEMO';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, signup, sendOtp, verifyOtp, oauthLogin, demoLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('PASSWORD');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP states
  const [otpStep, setOtpStep] = useState<'INPUT_EMAIL' | 'INPUT_CODE'>('INPUT_EMAIL');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState<number>(300);

  if (!isOpen) return null;

  // Handle standard password auth
  const handleSubmitPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      setSuccessMsg('Authentication verified. Generating JWT token...');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!otpEmail || !otpEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp(otpEmail);
      setPreviewOtp(res.previewOtp || '884120');
      setOtpStep('INPUT_CODE');
      setOtpCountdown(300);
      setSuccessMsg(`6-digit code dispatched to ${otpEmail}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit numeric verification code');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(otpEmail, otpCode.trim());
      setSuccessMsg('Code verified! JWT session active.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid or expired OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 1-Click Demo Presets
  const handleDemoPreset = async (preset: 'judge' | 'auditor' | 'cfo' | 'operator') => {
    setError(null);
    setIsLoading(true);
    try {
      await demoLogin(preset);
      setSuccessMsg(`Session established as ${preset.toUpperCase()}`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initialize demo session');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Social OAuth
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'gmail') => {
    setError(null);
    setIsLoading(true);
    try {
      await oauthLogin(provider);
      setSuccessMsg(`Authenticated via ${provider.toUpperCase()}`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Social OAuth failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 4, 10, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1.5rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(180deg, rgba(14, 18, 35, 0.96) 0%, rgba(8, 10, 20, 0.98) 100%)',
          border: '1px solid rgba(0, 210, 255, 0.35)',
          borderRadius: '16px',
          padding: '2.25rem',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 210, 255, 0.2)',
          color: '#EDEDED',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Top Accent Glow Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #00D2FF, #7C3AED, transparent)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#8E8E93',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = '#00D2FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#8E8E93';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem',
              boxShadow: '0 0 25px rgba(0, 210, 255, 0.35)',
            }}
          >
            <ShieldCheck size={22} color="#00D2FF" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.3rem', letterSpacing: '0.04em' }}>
            OMNISETTLE TERMINAL ACCESS
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', margin: 0 }}>
            JWT SECURE SESSION • RAZORPAY BUILDATHON 2026
          </p>
        </div>

        {/* Auth Method Navigation Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            backgroundColor: '#04060C',
            padding: '0.35rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => { setActiveTab('PASSWORD'); setError(null); }}
            style={{
              background: activeTab === 'PASSWORD' ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
              color: activeTab === 'PASSWORD' ? '#00D2FF' : '#8E8E93',
              border: activeTab === 'PASSWORD' ? '1px solid #00D2FF' : '1px solid transparent',
              borderRadius: '6px',
              padding: '0.5rem 0.3rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            PASSWORD
          </button>

          <button
            onClick={() => { setActiveTab('OTP'); setError(null); }}
            style={{
              background: activeTab === 'OTP' ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
              color: activeTab === 'OTP' ? '#00D2FF' : '#8E8E93',
              border: activeTab === 'OTP' ? '1px solid #00D2FF' : '1px solid transparent',
              borderRadius: '6px',
              padding: '0.5rem 0.3rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            EMAIL OTP
          </button>

          <button
            onClick={() => { setActiveTab('DEMO'); setError(null); }}
            style={{
              background: activeTab === 'DEMO' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeTab === 'DEMO' ? '#10B981' : '#8E8E93',
              border: activeTab === 'DEMO' ? '1px solid #10B981' : '1px solid transparent',
              borderRadius: '6px',
              padding: '0.5rem 0.3rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚡ 1-CLICK DEMO
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid #10B981',
              color: '#10B981',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={15} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: PASSWORD */}
        {activeTab === 'PASSWORD' && (
          <div>
            <form onSubmit={handleSubmitPasswordAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isSignUp && (
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                    OPERATOR NAME
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="#00D2FF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Kabir Roy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                      style={{
                        width: '100%',
                        backgroundColor: '#070A14',
                        border: '1px solid rgba(0, 210, 255, 0.3)',
                        borderRadius: '7px',
                        padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                  OPERATOR EMAIL
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#00D2FF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder="operator@omnisettle.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: '#070A14',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                      borderRadius: '7px',
                      padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                  PASSWORD / ACCESS KEY
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#00D2FF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: '#070A14',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                      borderRadius: '7px',
                      padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #00D2FF 0%, #0284C7 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 0 25px rgba(0, 210, 255, 0.4)',
                }}
              >
                {isLoading ? 'VERIFYING...' : isSignUp ? 'CREATE ACCOUNT & ISSUE JWT' : 'INITIALIZE SESSION ➔'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                style={{ background: 'none', border: 'none', color: '#8E8E93', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#00D2FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E93')}
              >
                {isSignUp ? '[ ALREADY REGISTERED? LOG IN HERE ]' : '[ NEW OPERATOR? REGISTER HERE ]'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL OTP */}
        {activeTab === 'OTP' && (
          <div>
            {otpStep === 'INPUT_EMAIL' ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                    ENTER EMAIL FOR 6-DIGIT OTP
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#00D2FF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        backgroundColor: '#070A14',
                        border: '1px solid rgba(0, 210, 255, 0.3)',
                        borderRadius: '7px',
                        padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: '#00D2FF',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 0 25px rgba(0, 210, 255, 0.4)',
                  }}
                >
                  {isLoading ? 'DISPATCHING...' : 'DISPATCH 6-DIGIT OTP ➔'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                    <span>ENTER 6-DIGIT OTP CODE</span>
                    <span style={{ color: '#00D2FF' }}>EXPIRES: {otpCountdown}s</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={15} color="#00D2FF" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      required
                      style={{
                        width: '100%',
                        backgroundColor: '#070A14',
                        border: '1px solid rgba(0, 210, 255, 0.4)',
                        borderRadius: '7px',
                        padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                        color: '#00D2FF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.2rem',
                        letterSpacing: '0.35em',
                        textAlign: 'center',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Convenient Test Autofill for Judges */}
                {previewOtp && (
                  <div style={{ background: '#04060C', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(0, 210, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                    <span style={{ color: '#8E8E93' }}>TEST OTP: <strong style={{ color: '#00D2FF' }}>{previewOtp}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(previewOtp)}
                      style={{ background: 'rgba(0, 210, 255, 0.15)', border: '1px solid #00D2FF', color: '#00D2FF', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 800 }}
                    >
                      AUTO-FILL
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #00D2FF 0%, #10B981 100%)',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  {isLoading ? 'VERIFYING...' : 'CONFIRM CODE & LOGIN ➔'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: 1-CLICK DEMO */}
        {activeTab === 'DEMO' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E93', marginBottom: '0.25rem' }}>
              SELECT PRESET ROLE FOR INSTANT SIGNED JWT:
            </div>

            {[
              { id: 'judge', name: 'Razorpay Buildathon Judge', email: 'judge@razorpay.com', role: 'JUDGE_ADMIN', color: '#00D2FF' },
              { id: 'auditor', name: 'Big 4 Lead GAAP Auditor', email: 'auditor@big4.com', role: 'LEAD_AUDITOR', color: '#F59E0B' },
              { id: 'cfo', name: 'Enterprise Treasury CFO', email: 'cfo@enterprise.com', role: 'TREASURY_CFO', color: '#10B981' },
              { id: 'operator', name: 'FinTech Treasury Operator', email: 'operator@omnisettle.ai', role: 'OPERATOR', color: '#A855F7' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => handleDemoPreset(d.id as 'judge' | 'auditor' | 'cfo' | 'operator')}
                disabled={isLoading}
                style={{
                  background: 'rgba(8, 12, 24, 0.95)',
                  border: `1px solid ${d.color}44`,
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = d.color;
                  e.currentTarget.style.boxShadow = `0 0 15px ${d.color}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${d.color}44`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {d.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93' }}>
                    {d.email}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: d.color, background: `${d.color}15`, padding: '0.2rem 0.5rem', borderRadius: '4px', border: `1px solid ${d.color}44`, fontWeight: 800 }}>
                  {d.role}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Enterprise SSO Divider & Social Buttons */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93', marginBottom: '0.75rem' }}>
            OR AUTHENTICATE WITH ENTERPRISE SSO
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              style={{
                background: '#070A14',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.5rem',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              Google
            </button>

            <button
              onClick={() => handleSocialLogin('gmail')}
              disabled={isLoading}
              style={{
                background: '#070A14',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.5rem',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              Gmail
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              style={{
                background: '#070A14',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.5rem',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              Facebook
            </button>
          </div>
        </div>

        {/* Security Footer Cipher */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#8E8E93', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <Lock size={12} color="#10B981" />
          <span>SHA-256 JWT ENCRYPTION // 24H VALIDITY</span>
        </div>
      </div>
    </div>
  );
};
