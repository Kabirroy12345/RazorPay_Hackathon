import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  sendOtp: (email: string) => Promise<{ success: boolean; message: string; previewOtp?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  oauthLogin: (provider: 'google' | 'facebook' | 'gmail', email?: string, name?: string) => Promise<void>;
  demoLogin: (preset: 'judge' | 'auditor' | 'cfo' | 'operator') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from token on mount
  useEffect(() => {
    let isMounted = true;
    authService.verifySession().then((verifiedUser) => {
      if (isMounted) {
        if (verifiedUser) {
          setUser(verifiedUser);
          setToken(authService.getToken());
        } else {
          setUser(null);
          setToken(null);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, pass);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.signup(name, email, pass);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    return await authService.sendOtp(email);
  };

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(email, otp);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const oauthLogin = async (provider: 'google' | 'facebook' | 'gmail', email?: string, name?: string) => {
    setIsLoading(true);
    try {
      const res = await authService.oauthLogin(provider, email, name);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (preset: 'judge' | 'auditor' | 'cfo' | 'operator') => {
    setIsLoading(true);
    try {
      const res = await authService.demoLogin(preset);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        sendOtp,
        verifyOtp,
        oauthLogin,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
