import { User, Assessment, AIRecommendation, LeaderboardItem, CoachFeedback, AthleteProfile } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('st_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  register: async (userData: any) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Profile
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/users/profile`, { headers: getHeaders() });
    return res.json();
  },

  updateProfile: async (data: any) => {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Assessments
  createAssessment: async (data: { sport: string; assessmentType?: string; metrics: any; notes?: string }) => {
    const res = await fetch(`${API_BASE}/assessments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to record assessment');
    }
    return res.json();
  },

  getHistory: async () => {
    const res = await fetch(`${API_BASE}/assessments/history`, { headers: getHeaders() });
    return res.json();
  },

  getAssessmentById: async (id: string) => {
    const res = await fetch(`${API_BASE}/assessments/${id}`, { headers: getHeaders() });
    return res.json();
  },

  getResultsById: async (id: string) => {
    const res = await fetch(`${API_BASE}/assessments/results/${id}`, { headers: getHeaders() });
    return res.json();
  },

  // AI Recommendations
  getRecommendations: async () => {
    const res = await fetch(`${API_BASE}/recommendations`, { headers: getHeaders() });
    return res.json();
  },

  // Leaderboard
  getLeaderboard: async (params?: { sport?: string; location?: string; ageCategory?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/leaderboard?${query}`);
    return res.json();
  },

  // Coach APIs
  getCoachAthletes: async (params?: { search?: string; sport?: string; minScore?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/coach/athletes?${query}`, { headers: getHeaders() });
    return res.json();
  },

  getCoachAthleteById: async (id: string) => {
    const res = await fetch(`${API_BASE}/coach/athlete/${id}`, { headers: getHeaders() });
    return res.json();
  },

  submitCoachFeedback: async (feedback: any) => {
    const res = await fetch(`${API_BASE}/coach/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feedback)
    });
    return res.json();
  },

  // Admin APIs
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: getHeaders() });
    return res.json();
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: getHeaders() });
    return res.json();
  },

  updateUserRole: async (id: string, role: string) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role })
    });
    return res.json();
  }
};
