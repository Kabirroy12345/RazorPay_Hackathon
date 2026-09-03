import React, { createContext, useContext, useState, useEffect } from 'react';

export type LandingThemeMode = 'cosmic' | 'stealth' | 'razorpay' | 'hyperion';

export interface ThemeConfig {
  id: LandingThemeMode;
  name: string;
  badge: string;
  primaryAccent: string;
  secondaryAccent: string;
  bgBase: string;
  bgSurface: string;
  glowColor: string;
  borderSubtle: string;
  starColors: string[];
}

export const THEME_CONFIGS: Record<LandingThemeMode, ThemeConfig> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Cyber',
    badge: '🌌 COSMIC',
    primaryAccent: '#00D2FF',
    secondaryAccent: '#7C3AED',
    bgBase: '#05070E',
    bgSurface: '#0B0F1C',
    glowColor: 'rgba(0, 210, 255, 0.4)',
    borderSubtle: 'rgba(0, 210, 255, 0.25)',
    starColors: ['#FFFFFF', '#C5E6FF', '#00D2FF', '#D8B4FE', '#FDE047'],
  },
  stealth: {
    id: 'stealth',
    name: 'Tactical Stealth',
    badge: '⚡ STEALTH',
    primaryAccent: '#00FF66',
    secondaryAccent: '#059669',
    bgBase: '#000000',
    bgSurface: '#080808',
    glowColor: 'rgba(0, 255, 102, 0.45)',
    borderSubtle: 'rgba(0, 255, 102, 0.3)',
    starColors: ['#00FF66', '#34D399', '#A7F3D0', '#10B981', '#064E3B'],
  },
  razorpay: {
    id: 'razorpay',
    name: 'Razorpay Blue',
    badge: '🔷 RAZORPAY',
    primaryAccent: '#0C8CE9',
    secondaryAccent: '#F2C14E',
    bgBase: '#020817',
    bgSurface: '#08142C',
    glowColor: 'rgba(12, 140, 233, 0.45)',
    borderSubtle: 'rgba(12, 140, 233, 0.3)',
    starColors: ['#FFFFFF', '#93C5FD', '#0C8CE9', '#FDE047', '#38BDF8'],
  },
  hyperion: {
    id: 'hyperion',
    name: 'Hyperion Sunset',
    badge: '🔥 HYPERION',
    primaryAccent: '#FF007F',
    secondaryAccent: '#FFB800',
    bgBase: '#0B0014',
    bgSurface: '#180424',
    glowColor: 'rgba(255, 0, 127, 0.45)',
    borderSubtle: 'rgba(255, 0, 127, 0.3)',
    starColors: ['#FFFFFF', '#FFB800', '#FF007F', '#D946EF', '#F43F5E'],
  },
};

interface LandingThemeContextType {
  theme: LandingThemeMode;
  themeConfig: ThemeConfig;
  setTheme: (theme: LandingThemeMode) => void;
}

const LandingThemeContext = createContext<LandingThemeContextType | undefined>(undefined);

export const LandingThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<LandingThemeMode>(() => {
    const saved = localStorage.getItem('omnisettle_landing_theme');
    if (saved && (saved in THEME_CONFIGS)) {
      return saved as LandingThemeMode;
    }
    return 'cosmic';
  });

  const setTheme = (newTheme: LandingThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('omnisettle_landing_theme', newTheme);
  };

  const themeConfig = THEME_CONFIGS[theme];

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-accent', themeConfig.primaryAccent);
    document.documentElement.style.setProperty('--theme-secondary', themeConfig.secondaryAccent);
    document.documentElement.style.setProperty('--theme-bg', themeConfig.bgBase);
  }, [themeConfig]);

  return (
    <LandingThemeContext.Provider value={{ theme, themeConfig, setTheme }}>
      {children}
    </LandingThemeContext.Provider>
  );
};

export const useLandingTheme = (): LandingThemeContextType => {
  const context = useContext(LandingThemeContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      theme: 'cosmic',
      themeConfig: THEME_CONFIGS.cosmic,
      setTheme: () => {},
    };
  }
  return context;
};
