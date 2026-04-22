import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add token
api.interceptors.request.use(
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (error.response.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.response.status === 404) {
        toast.error('Resource not found.');
      } else if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Cannot connect to server. Please check if the backend is running.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    
    return api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  getMe: () => api.get('/auth/me'),
  register: (userData) => api.post('/auth/register', userData),
  createAdmin: () => api.post('/auth/create-admin'),
};

// Products API
// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  
  create: (formData) => {
    // Log the FormData before sending
    console.log('Sending FormData to backend:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0], 'File:', pair[1].name, pair[1].type, pair[1].size);
      } else {
        console.log(pair[0], pair[1]);
      }
    }
    
    return api.post('/products/', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  delete: (id) => api.delete(`/products/${id}`),
  deleteImage: (id, imageIndex) => api.delete(`/products/${id}/images/${imageIndex}`),
  getByCategory: (category) => api.get('/products', { params: { category } }),
  getFeatured: () => api.get('/products', { params: { featured: true } }),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  uploadMultipleImages: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  deleteImage: (imagePath) => api.delete(`/upload/image/${encodeURIComponent(imagePath)}`),
  
  getImageUrl: (imagePath) => `${API_URL}/${imagePath}`,
};

export default api;