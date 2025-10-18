const fromGlobal = typeof __API_BASE_URL__ !== 'undefined' ? __API_BASE_URL__ : '';
const fromProcess =
  typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL
    ? process.env.VITE_API_BASE_URL
    : '';

const rawBaseUrl = fromGlobal || fromProcess || '/api';

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');
