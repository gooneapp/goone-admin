import axios from 'axios';
import { toast } from '../store/toastStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('goone_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handling and toast notifications
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    toast.error(message);
    
    // Handle unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('goone_admin_token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

// Unified API Service Provider without Mock Fallback
export const api = {
  getAnalytics: async () => {
    const res = await apiClient.get('/admin/analytics');
    return res.data;
  },
  getBusinesses: async () => {
    const res = await apiClient.get('/admin/businesses');
    return res.data;
  },
  getUsers: async () => {
    const res = await apiClient.get('/admin/users');
    return res.data;
  },
  getKycDocuments: async () => {
    const res = await apiClient.get('/admin/kyc-documents');
    return res.data;
  },
  getCategories: async () => {
    const res = await apiClient.get('/categories');
    return res.data;
  },
  getProducts: async () => {
    const res = await apiClient.get('/admin/products');
    return res.data;
  },
  getOrders: async () => {
    const res = await apiClient.get('/admin/orders');
    return res.data;
  },
  getPartners: async () => {
    const res = await apiClient.get('/admin/partners');
    return res.data;
  },
  getDeliveryJobs: async () => {
    const res = await apiClient.get('/admin/deliveries');
    return res.data;
  },
  getSubscriptions: async () => {
    const res = await apiClient.get('/admin/subscriptions');
    return res.data;
  },
  getSubscriptionPlans: async () => {
    const res = await apiClient.get('/plans');
    return res.data;
  },
  getCreditAccounts: async () => {
    const res = await apiClient.get('/admin/credit-accounts');
    return res.data;
  },
  getSupportTickets: async () => {
    const res = await apiClient.get('/admin/support-tickets');
    return res.data;
  },
  getCmsContent: async () => {
    const res = await apiClient.get('/admin/cms-content');
    return res.data;
  },
  getAdvertisements: async () => {
    const res = await apiClient.get('/admin/advertisements');
    return res.data;
  },
  getFeatureToggles: async () => {
    const res = await apiClient.get('/admin/feature-toggles');
    return res.data;
  },
  getWebsiteConfigs: async () => {
    const res = await apiClient.get('/admin/config');
    return res.data;
  },
  getAuditLogs: async () => {
    const res = await apiClient.get('/admin/audit-logs');
    return res.data;
  },
  getApiKeys: async () => {
    const res = await apiClient.get('/admin/api-keys');
    return res.data;
  },
  getSystemHealth: async () => {
    const res = await apiClient.get('/admin/health');
    return res.data;
  },
  getAdminUsers: async () => {
    const res = await apiClient.get('/admin/admin-users');
    return res.data;
  },
};

export default apiClient;
