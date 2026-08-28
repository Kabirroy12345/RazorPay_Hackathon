import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Lock, Mail, User } from 'lucide-react';

interface LandingPageViewProps {
  onAuthSuccess: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    // Simulate network request / authentication delay
    setIsLoading(true);
    setTimeout(() => {
      // Mock successful authentication
      onAuthSuccess();
    }, 1200);
  };

  return (
    <div className="epic-bg-container">
      {/* Epic Dynamic Background Elements */}
      <div className="epic-bg-grid"></div>
      <div className="epic-orb-1"></div>
      <div className="epic-orb-2"></div>
      <div className="epic-orb-3"></div>

      {/* Auth Card Content */}
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} color="var(--accent-amber)" style={{ margin: '0 auto 1rem', filter: 'drop-shadow(0 0 10px rgba(217, 164, 65, 0.5))' }} />
          <h1 className="font-mono" style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            AURA_LEDGER
          </h1>
          <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            [ AUTONOMOUS_FINANCIAL_RECONCILIATION ]
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(192, 82, 74, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <label>Operator Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="auth-input" 
                  style={{ width: '100%', paddingLeft: '2.5rem' }} 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Secure Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                className="auth-input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
                placeholder="operator@auraledger.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Access Key (Password)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                className="auth-input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={isLoading} style={{ marginTop: '2rem' }}>
            {isLoading ? (
              <span className="data-flicker">ESTABLISHING_UPLINK...</span>
            ) : (
              <>
                {isLogin ? 'INITIALIZE_SESSION' : 'PROVISION_ACCOUNT'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            disabled={isLoading}
            className="font-mono"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? '[ REQUEST_NEW_CREDENTIALS ]' : '[ AUTHENTICATE_EXISTING_KEY ]'}
          </button>
        </div>
      </div>
    </div>
  );
};
