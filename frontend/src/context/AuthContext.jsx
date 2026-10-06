import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('taskmaster_token');
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.error('Session verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleExpired = () => {
      setUser(null);
      setAuthModalOpen(true);
    };

    window.addEventListener('auth_session_expired', handleExpired);
    return () => window.removeEventListener('auth_session_expired', handleExpired);
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem('taskmaster_token', res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('taskmaster_token', res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    return res;
  };

  const loginAsDemo = async () => {
    return login({ email: 'demo@taskmaster.com', password: 'password123' });
  };

  const logout = () => {
    localStorage.removeItem('taskmaster_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authModalOpen,
        setAuthModalOpen,
        login,
        register,
        loginAsDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
