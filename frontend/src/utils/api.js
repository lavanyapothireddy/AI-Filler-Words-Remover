import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const analyzeText = (text) =>
  api.post('/analyze', { text }).then(r => r.data);

export const removeFillers = (text, mode = 'balanced') =>
  api.post('/remove', { text, mode }).then(r => r.data);

export const getSuggestions = (text) =>
  api.post('/suggest', { text }).then(r => r.data);

export const healthCheck = () =>
  api.get('/health').then(r => r.data);

export default api;
