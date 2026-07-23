import { create } from 'zustand';
import { AdminUser, AdminRole } from '../types';

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AdminUser) => void;
  logout: () => void;
  switchRole: (role: AdminRole) => void;
  hasPermission: (requiredRoles: AdminRole[]) => boolean;
}

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-001-super',
  email: 'superadmin@goone.in',
  name: 'GoOne Platform Director',
  role: 'super_admin',
  active: true,
  createdAt: new Date().toISOString(),
};

function getInitialUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem('goone_admin_user');
    if (!raw || raw === 'undefined' || raw === 'null') return DEFAULT_ADMIN;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && parsed.role ? parsed : DEFAULT_ADMIN;
  } catch {
    return DEFAULT_ADMIN;
  }
}

function getInitialToken(): string | null {
  try {
    const token = localStorage.getItem('goone_admin_token');
    return token && token !== 'undefined' ? token : 'demo-jwt-token-production-ready';
  } catch {
    return 'demo-jwt-token-production-ready';
  }
}

const initialToken = getInitialToken();
const initialUser = getInitialUser();

export const useAuthStore = create<AuthState>((set, get) => ({
  token: initialToken,
  user: initialUser,
  isAuthenticated: !!initialToken && !!initialUser,

  setAuth: (token: string, user: AdminUser) => {
    try {
      localStorage.setItem('goone_admin_token', token);
      localStorage.setItem('goone_admin_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    try {
      localStorage.removeItem('goone_admin_token');
      localStorage.removeItem('goone_admin_user');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  switchRole: (role: AdminRole) => {
    const currentUser = get().user || DEFAULT_ADMIN;
    const updatedUser: AdminUser = {
      ...currentUser,
      role,
      name: `GoOne ${role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
      email: `${role.replace('_', '')}@goone.in`,
    };
    try {
      localStorage.setItem('goone_admin_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    set({ user: updatedUser });
  },

  hasPermission: (requiredRoles: AdminRole[]) => {
    const currentUser = get().user;
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return requiredRoles.includes(currentUser.role);
  },
}));
