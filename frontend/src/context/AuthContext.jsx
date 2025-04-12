
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setIsAdmin(userData.role === 'admin');
      
      // Verify token validity with backend
      checkAuthStatus();
    }
    setLoading(false);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data) {
        setCurrentUser(response.data);
        setIsAdmin(response.data.role === 'admin');
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      // If token is invalid, logout
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      
      toast.success("Login successful");
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password 
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      
      toast.success("Registration successful");
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAdmin(false);
    toast.success("Logged out successfully");
  };

  const value = {
    currentUser,
    setCurrentUser,
    isAdmin,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
