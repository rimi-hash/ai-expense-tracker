/**
 * API Service
 * Centralized HTTP client for all API calls
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Expense endpoints
export const expenseAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`)
};

// Insights endpoints
export const insightAPI = {
  getMonthly: (month) => api.get('/insights/monthly', { params: { month } }),
  getCategories: (month) => api.get('/insights/categories', { params: { month } }),
  getAnomalies: () => api.get('/insights/anomalies'),
  getTrend: (months) => api.get('/insights/trend', { params: { months } })
};

// Chat endpoints
export const chatAPI = {
  send: (data) => api.post('/chat', data),
  getHistory: (conversationId) => api.get(`/chat/history/${conversationId}`)
};

export default api;
