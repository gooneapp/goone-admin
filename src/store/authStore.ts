import { create } from 'zustand';
import { AdminUser, AdminRole } from '../types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  setAuth: (token: string, refreshToken: string, user: AdminUser) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  hasPermission: (requiredRoles: AdminRole[]) => boolean;
}

const getSanitizedStorageItem = (key: string): string | null => {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === 'undefined' || val === 'null' || val.trim() === '') {
      return null;
    }
    return val;
  } catch {
    return null;
  }
};

const initialToken = getSanitizedStorageItem('goone_admin_token');
const initialRefreshToken = getSanitizedStorageItem('goone_admin_refresh_token');
const initialUserString = getSanitizedStorageItem('goone_admin_user');

let initialUser: AdminUser | null = null;
if (initialUserString) {
  try {
    initialUser = JSON.parse(initialUserString);
  } catch {
    initialUser = null;
  }
}

const hasInitialAuth = !!initialToken && !!initialUser;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  token: initialToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: hasInitialAuth,
  isCheckingAuth: hasInitialAuth, // Verify token on startup if we have an existing session

  setAuth: (token: string, refreshToken: string, user: AdminUser) => {
    try {
      localStorage.setItem('goone_admin_token', token);
      localStorage.setItem('goone_admin_refresh_token', refreshToken);
      localStorage.setItem('goone_admin_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    set({ token, refreshToken, user, isAuthenticated: true, isCheckingAuth: false });
  },

  logout: () => {
    try {
      localStorage.removeItem('goone_admin_token');
      localStorage.removeItem('goone_admin_refresh_token');
      localStorage.removeItem('goone_admin_user');
      localStorage.removeItem('auth-storage');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isCheckingAuth: false });
  },

  checkAuth: async () => {
    const currentToken = get().token;
    if (!currentToken) {
      set({ isAuthenticated: false, user: null, isCheckingAuth: false });
      return;
    }

    try {
      const { apiClient } = await import('../api/client');
      const res = await apiClient.get('/admin/auth/me');
      const adminData = res.data?.admin || res.data;
      if (adminData && adminData.id) {
        set({ user: adminData, isAuthenticated: true, isCheckingAuth: false });
        localStorage.setItem('goone_admin_user', JSON.stringify(adminData));
      } else {
        get().logout();
      }
    } catch (err) {
      // If validation fails and no valid token remains in store, log out
      if (!get().token) {
        get().logout();
      } else {
        set({ isCheckingAuth: false });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  hasPermission: (requiredRoles: AdminRole[]) => {
    const currentUser = get().user;
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return requiredRoles.includes(currentUser.role);
  },
}));
