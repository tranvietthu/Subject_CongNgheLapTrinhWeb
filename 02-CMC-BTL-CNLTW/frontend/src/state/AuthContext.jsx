import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { findDemoUser, toSafeDemoUser } from '../data/demoUsers.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('techblue_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('techblue_token')) return;
    api('/auth/me')
      .then((me) => {
        setUser(me);
        localStorage.setItem('techblue_user', JSON.stringify(me));
      })
      .catch(() => {
        const token = localStorage.getItem('techblue_token');
        const rawUser = localStorage.getItem('techblue_user');
        if (token?.startsWith('demo-') && rawUser) {
          setUser(JSON.parse(rawUser));
          return;
        }
        logout();
      });
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('techblue_token', data.token);
      localStorage.setItem('techblue_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      const demoUser = toSafeDemoUser(findDemoUser(email, password));
      if (!demoUser) throw error;
      localStorage.setItem('techblue_token', `demo-${demoUser.role.toLowerCase()}-token`);
      localStorage.setItem('techblue_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    localStorage.setItem('techblue_token', data.token);
    localStorage.setItem('techblue_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('techblue_token');
    localStorage.removeItem('techblue_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
