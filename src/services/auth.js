import api from './api';

// Auth specific service with token management
const TOKEN_KEY = 'token';

const authService = {
  // Store token in localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Login user
  login: async (email, password) => {
    try {
      // Using OAuth2 password flow which expects 'username' field
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      const response = await api.post('/auth/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (response.data.access_token) {
        authService.setToken(response.data.access_token);
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  },

  // Alternative login using JSON
  loginJson: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });
      
      if (response.data.access_token) {
        authService.setToken(response.data.access_token);
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get current user error:', error);
      if (error.response?.status === 401) {
        authService.removeToken();
      }
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to get user info' 
      };
    }
  },

  // Logout user
  logout: () => {
    authService.removeToken();
    // You can also call a logout endpoint if your API has one
    // return api.post('/auth/logout');
  },

  // Create admin user (one-time setup)
  createAdmin: async () => {
    try {
      const response = await api.post('/auth/create-admin');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create admin error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to create admin' 
      };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to change password' 
      };
    }
  },

  // Refresh token (if your API supports it)
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.access_token) {
        authService.setToken(response.data.access_token);
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Failed to refresh token' };
    } catch (error) {
      console.error('Refresh token error:', error);
      authService.removeToken();
      return { success: false, error: 'Session expired' };
    }
  },

  // Verify token validity
  verifyToken: async () => {
    try {
      await api.get('/auth/verify');
      return { success: true };
    } catch (error) {
      console.error('Token verification error:', error);
      authService.removeToken();
      return { success: false };
    }
  },

  // Get auth headers for manual requests
  getAuthHeaders: () => {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Decode JWT token (if you need to access payload)
  decodeToken: () => {
    const token = authService.getToken();
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: () => {
    const decoded = authService.decodeToken();
    if (!decoded || !decoded.exp) return true;
    
    // Check if token is expired (with 5 minute buffer)
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + 300;
  }
};

export default authService;