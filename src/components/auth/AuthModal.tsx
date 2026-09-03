import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Clock
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
      setSuccessMsg('Authentication successful. Generating JWT token...');
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
      setError('Please enter a valid email or Gmail address');
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
      setSuccessMsg('Code verified! JWT issued successfully.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Social OAuth (Google, Facebook, Gmail)
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'gmail') => {
    setError(null);
    setIsLoading(true);
    try {
      await oauthLogin(provider);
      setSuccessMsg(`Authenticated via ${provider.toUpperCase()}`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `${provider} login failed`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 1-Click Demo Login
  const handleDemoAccess = async (preset: 'judge' | 'auditor' | 'cfo' | 'operator') => {
    setError(null);
    setIsLoading(true);
    try {
      await demoLogin(preset);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo access failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 7, 9, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#0F1015',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 210, 255, 0.12)',
          padding: '2rem 2.25rem',
          color: '#EDEDED',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: '#8E8E93',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00D2FF 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)',
            }}
          >
            <ShieldCheck size={20} color="#000" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.25rem' }}>
            OPERATOR AUTHENTICATION
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', margin: 0 }}>
            JWT SECURE ACCESS • RAZORPAY BUILDATHON 2026
          </p>
        </div>

        {/* Auth Method Navigation Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.35rem',
            backgroundColor: '#070709',
            padding: '0.3rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => { setActiveTab('PASSWORD'); setError(null); }}
            style={{
              background: activeTab === 'PASSWORD' ? '#1A1B22' : 'transparent',
              color: activeTab === 'PASSWORD' ? '#00D2FF' : '#8E8E93',
              border: activeTab === 'PASSWORD' ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid transparent',
              borderRadius: '4px',
              padding: '0.45rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            PASSWORD
          </button>

          <button
            onClick={() => { setActiveTab('OTP'); setError(null); }}
            style={{
              background: activeTab === 'OTP' ? '#1A1B22' : 'transparent',
              color: activeTab === 'OTP' ? '#00D2FF' : '#8E8E93',
              border: activeTab === 'OTP' ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid transparent',
              borderRadius: '4px',
              padding: '0.45rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            EMAIL OTP
          </button>

          <button
            onClick={() => { setActiveTab('DEMO'); setError(null); }}
            style={{
              background: activeTab === 'DEMO' ? '#1A1B22' : 'transparent',
              color: activeTab === 'DEMO' ? '#10B981' : '#8E8E93',
              border: activeTab === 'DEMO' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              borderRadius: '4px',
              padding: '0.45rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚡ 1-CLICK DEMO
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
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

        {/* ------------------------------------------------------------------- */}
        {/* TAB 1: PASSWORD LOGIN & SIGNUP                                      */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'PASSWORD' && (
          <div>
            <form onSubmit={handleSubmitPasswordAuth} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {isSignUp && (
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                    FULL OPERATOR NAME
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="#8E8E93" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Kabir Roy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                      style={{
                        width: '100%',
                        backgroundColor: '#070709',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                  OPERATOR EMAIL
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#8E8E93" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder="operator@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: '#070709',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                  PASSWORD / ACCESS KEY
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#8E8E93" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: '#070709',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#00D2FF',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 0 20px rgba(0, 210, 255, 0.25)',
                }}
              >
                {isLoading ? 'SIGNING JWT TOKEN...' : isSignUp ? 'CREATE ACCOUNT & ISSUE JWT' : 'INITIALIZE SESSION ➔'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8E8E93',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {isSignUp ? '[ ALREADY HAVE A KEY? SIGN IN ]' : '[ NEW OPERATOR? REGISTER HERE ]'}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 2: EMAIL / GMAIL 6-DIGIT OTP VERIFICATION                       */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'OTP' && (
          <div>
            {otpStep === 'INPUT_EMAIL' ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.82rem', color: '#8E8E93', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
                  Enter your email or Gmail to receive an instant, cryptographically signed 6-digit one-time code.
                </p>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                    EMAIL / GMAIL ADDRESS
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#8E8E93" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      placeholder="user@gmail.com"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        backgroundColor: '#070709',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#00D2FF',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isLoading ? 'DISPATCHING CODE...' : 'DISPATCH 6-DIGIT OTP ➔'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#8E8E93' }}>
                    SENT TO: <strong style={{ color: '#FFFFFF' }}>{otpEmail}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpStep('INPUT_EMAIL')}
                    style={{ background: 'none', border: 'none', color: '#00D2FF', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                  >
                    Change
                  </button>
                </div>

                {/* Development Preview Banner for Judges */}
                {previewOtp && (
                  <div
                    style={{
                      background: 'rgba(0, 210, 255, 0.08)',
                      border: '1px dashed rgba(0, 210, 255, 0.4)',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: '#00D2FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>⚡ HACKATHON TEST OTP:</span>
                    <strong style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>{previewOtp}</strong>
                    <button
                      type="button"
                      onClick={() => setOtpCode(previewOtp)}
                      style={{ background: '#00D2FF', color: '#000', border: 'none', borderRadius: '3px', padding: '0.2rem 0.45rem', fontSize: '0.68rem', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8E8E93', marginBottom: '0.35rem' }}>
                    ENTER 6-DIGIT VERIFICATION CODE
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} color="#8E8E93" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="884120"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      required
                      style={{
                        width: '100%',
                        backgroundColor: '#070709',
                        border: '1px solid #00D2FF',
                        borderRadius: '6px',
                        padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.2rem',
                        letterSpacing: '0.35em',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8E8E93', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  <Clock size={13} />
                  <span>Code expires in: {Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  style={{
                    backgroundColor: '#10B981',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: isLoading || otpCode.length !== 6 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isLoading ? 'VERIFYING CODE...' : 'VERIFY & ISSUE JWT ➔'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 3: 1-CLICK DEMO ACCESS FOR JUDGES & AUDITORS                   */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'DEMO' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#8E8E93', margin: '0 0 0.25rem', fontFamily: 'var(--font-mono)' }}>
              Instant 1-Click Role Presets (Signed with 24h JWT):
            </p>

            <button
              onClick={() => handleDemoAccess('judge')}
              disabled={isLoading}
              style={{
                background: 'rgba(0, 210, 255, 0.08)',
                border: '1px solid rgba(0, 210, 255, 0.35)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#00D2FF' }}>
                  ⚡ Razorpay Buildathon Judge
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginTop: '0.2rem' }}>
                  judge@razorpay.com • [ROLE: JUDGE_ADMIN]
                </div>
              </div>
              <ArrowRight size={16} color="#00D2FF" />
            </button>

            <button
              onClick={() => handleDemoAccess('auditor')}
              disabled={isLoading}
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#10B981' }}>
                  Big 4 Lead GAAP Auditor
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginTop: '0.2rem' }}>
                  auditor@big4.com • [ROLE: LEAD_AUDITOR]
                </div>
              </div>
              <ArrowRight size={16} color="#10B981" />
            </button>

            <button
              onClick={() => handleDemoAccess('cfo')}
              disabled={isLoading}
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#F59E0B' }}>
                  Enterprise Chief Financial Officer
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginTop: '0.2rem' }}>
                  cfo@enterprise.com • [ROLE: TREASURY_CFO]
                </div>
              </div>
              <ArrowRight size={16} color="#F59E0B" />
            </button>

            <button
              onClick={() => handleDemoAccess('operator')}
              disabled={isLoading}
              style={{
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#A855F7' }}>
                  FinTech Treasury Operator
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93', marginTop: '0.2rem' }}>
                  operator@omnisettle.ai • [ROLE: OPERATOR]
                </div>
              </div>
              <ArrowRight size={16} color="#A855F7" />
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SOCIAL LOGINS (GOOGLE, GMAIL, FACEBOOK)                             */}
        {/* ------------------------------------------------------------------- */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8E8E93' }}>
              OR AUTHENTICATE WITH ENTERPRISE SSO
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              style={{
                background: '#070709',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                color: '#EDEDED',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              Google
            </button>

            {/* Gmail Direct OAuth Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('gmail')}
              disabled={isLoading}
              style={{
                background: '#070709',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                color: '#EDEDED',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.573l8.073-6.08C21.691 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
              </svg>
              Gmail
            </button>

            {/* Facebook OAuth Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              style={{
                background: '#070709',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                color: '#EDEDED',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
