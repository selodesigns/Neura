import axios from 'axios';

// API client configuration - uses proxy in development (vite.config.js)
// In production, set VITE_API_URL environment variable
const api = axios.create({
  baseURL: '/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
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

export default api;

// API functions
export const documents = {
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  addCollaborator: (id, userId, permission) =>
    api.post(`/documents/${id}/collaborators`, { userId, permission }),
};

export const ai = {
  research: (query, perspectives, documentId) =>
    api.post('/ai/research', { query, perspectives, documentId }),
  synthesize: (responses) => api.post('/ai/synthesize', { responses }),
  suggest: (context, cursorPosition) =>
    api.post('/ai/suggest', { context, cursorPosition }),
  expand: (text, direction) => api.post('/ai/expand', { text, direction }),
  getResearchHistory: (documentId) => api.get(`/ai/research/${documentId}`),
};

export const analytics = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getDocument: (id) => api.get(`/analytics/document/${id}`),
};
