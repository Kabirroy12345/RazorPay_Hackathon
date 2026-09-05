const getApiBase = (): string => {
  const proc = (globalThis as any).process;
  if (typeof proc !== 'undefined' && proc?.env?.VITE_API_URL) {
    return proc.env.VITE_API_URL;
  }
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
      return (import.meta as any).env.VITE_API_URL;
    }
  } catch {}
  if (typeof window !== 'undefined' && window.location?.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '';
  }
  return 'http://localhost:3001';
};

export const API_BASE = getApiBase();
