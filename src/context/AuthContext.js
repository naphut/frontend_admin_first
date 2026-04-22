import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadUser = async () => {
    try {
      const result = await authService.getCurrentUser();
      if (result.success) {
        setUser(result.data);
      } else {
        // If failed to load user, clear auth state
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        setIsAuthenticated(true);
        await loadUser(); // Load user data after successful login
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(result.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin: user?.is_admin || false,
    token: authService.getToken(),
    refreshToken: authService.refreshToken,
    changePassword: authService.changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};