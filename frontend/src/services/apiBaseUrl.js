const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const ensureApiSuffix = (rawUrl) => {
  const trimmed = String(rawUrl || '').trim().replace(/\/+$/, '');
  if (!trimmed) return DEFAULT_API_BASE_URL;
  if (/\/api$/i.test(trimmed)) return trimmed;
  return `${trimmed}/api`;
};

export const API_BASE_URL = ensureApiSuffix(import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL);
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/i, '');
