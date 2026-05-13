import { createContext, useContext, useEffect, useMemo, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [booting, setBooting] =
    useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const userInfo =
        localStorage.getItem('userInfo');

      if (!userInfo) {
        setBooting(false);
        return;
      }

      try {
        const { data } = await api.get(
          '/auth/me'
        );

        setUser(data.user);
      } catch (_error) {
        localStorage.removeItem(
          'userInfo'
        );

        setUser(null);
      } finally {
        setBooting(false);
      }
    };

    loadSession();
  }, []);

  const login = async (
    email,
    password
  ) => {
    const { data } = await api.post(
      '/auth/login',
      {
        email,
        password
      }
    );

    localStorage.setItem(
      'userInfo',
      JSON.stringify(data)
    );

    setUser(data);

    return data;
  };

  const signup = async (
    name,
    email,
    password
  ) => {
    const { data } = await api.post(
      '/auth/signup',
      {
        name,
        email,
        password
      }
    );

    localStorage.setItem(
      'userInfo',
      JSON.stringify(data)
    );

    setUser(data);

    return data;
  };

  const logout = () => {
    localStorage.removeItem(
      'userInfo'
    );

    setUser(null);

    navigate('/');
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      booting,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout
    }),
    [booting, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
};