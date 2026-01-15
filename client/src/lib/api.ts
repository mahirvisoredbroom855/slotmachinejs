import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:5001/api';

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const api = {
  init: () => apiRequest('/init', { method: 'POST' }),
  
  spin: (lines: number, betPerLine: number) =>
    apiRequest('/spin', {
      method: 'POST',
      body: JSON.stringify({ lines, betPerLine }),
    }),
  
  getStats: () => apiRequest('/stats'),
  
  simulate: (trials: number, lines: number, betPerLine: number) =>
    apiRequest('/simulate', {
      method: 'POST',
      body: JSON.stringify({ trials, lines, betPerLine }),
    }),
  
  exportJSON: async () => {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/export/json`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slotlab-export-${Date.now()}.json`;
    a.click();
  },
  
  exportXML: async () => {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/export/xml`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slotlab-export-${Date.now()}.xml`;
    a.click();
  },
};