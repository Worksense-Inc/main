import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { api, setAuthToken } from '../services/api';

export type Role = 'manager' | 'employee';
export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      const res = await api.me();
      if (res?.success && res.data) {
        setUser(res.data as AuthUser);
      } else {
        setAuthToken(undefined);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res?.success && res.data?.token) {
      setAuthToken(res.data.token);
      // fetch current user
      const me = await api.me();
      if (me?.success && me.data) {
        setUser(me.data as AuthUser);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setAuthToken(undefined);
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await api.me();
    if (res?.success && res.data) {
      setUser(res.data as AuthUser);
    }
  };

  const value = useMemo(() => ({ user, loading, login, logout, refreshUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
