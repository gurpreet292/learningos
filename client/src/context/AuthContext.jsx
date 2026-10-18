import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('learningos_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('learningos_token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
      localStorage.setItem('learningos_user', JSON.stringify(response.data));
    } catch (error) {
      localStorage.removeItem('learningos_token');
      localStorage.removeItem('learningos_user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    const authUser = response.data.user;
    const authToken = response.data.token;

    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('learningos_token', authToken);
    localStorage.setItem('learningos_user', JSON.stringify(authUser));

    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    const authUser = response.data.user;
    const authToken = response.data.token;

    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('learningos_token', authToken);
    localStorage.setItem('learningos_user', JSON.stringify(authUser));

    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('learningos_token');
    localStorage.removeItem('learningos_user');
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, fetchProfile }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
