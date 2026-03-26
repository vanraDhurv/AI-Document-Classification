import axios from 'axios';

// Create axios instance with default configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service methods
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};

export const documentsAPI = {
  getDocuments: (params) => apiClient.get('/documents/', { params }),
  getDocument: (id) => apiClient.get(`/documents/${id}`),
  uploadDocument: (formData) => apiClient.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  downloadDocument: (id) => apiClient.get(`/documents/${id}/download`, {
    responseType: 'blob',
  }),
  deleteDocument: (id) => apiClient.delete(`/documents/${id}`),
  getCategories: () => apiClient.get('/documents/categories/'),
};

export const searchAPI = {
  search: (params) => apiClient.get('/search/', { params }),
  semanticSearch: (data) => apiClient.post('/search/semantic', data),
};

export const usersAPI = {
  getUsers: () => apiClient.get('/users/'),
  createUser: (data) => apiClient.post('/users/', data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

export default apiClient;