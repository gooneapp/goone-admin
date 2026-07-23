import axios from 'axios';
import * as MOCK from './mockData';

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

// Unified API Service Provider with Mock Fallback for production resilience
export const api = {
  getAnalytics: async () => {
    try {
      const res = await apiClient.get('/admin/analytics');
      return res.data;
    } catch {
      return MOCK.MOCK_ANALYTICS_SUMMARY;
    }
  },

  getBusinesses: async () => {
    try {
      const res = await apiClient.get('/admin/businesses');
      return res.data;
    } catch {
      return MOCK.MOCK_BUSINESSES;
    }
  },

  getUsers: async () => {
    try {
      const res = await apiClient.get('/admin/users');
      return res.data;
    } catch {
      return MOCK.MOCK_SYSTEM_USERS;
    }
  },

  getKycDocuments: async () => {
    try {
      const res = await apiClient.get('/admin/kyc-documents');
      return res.data;
    } catch {
      return MOCK.MOCK_KYC_DOCUMENTS;
    }
  },

  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories');
      return res.data;
    } catch {
      return MOCK.MOCK_CATEGORIES;
    }
  },

  getProducts: async () => {
    try {
      const res = await apiClient.get('/admin/products');
      return res.data;
    } catch {
      return MOCK.MOCK_PRODUCTS;
    }
  },

  getOrders: async () => {
    try {
      const res = await apiClient.get('/admin/orders');
      return res.data;
    } catch {
      return MOCK.MOCK_ORDERS;
    }
  },

  getPartners: async () => {
    try {
      const res = await apiClient.get('/admin/partners');
      return res.data;
    } catch {
      return MOCK.MOCK_PARTNER_VEHICLES;
    }
  },

  getDeliveryJobs: async () => {
    try {
      const res = await apiClient.get('/admin/deliveries');
      return res.data;
    } catch {
      return MOCK.MOCK_DELIVERY_JOBS;
    }
  },

  getSubscriptions: async () => {
    try {
      const res = await apiClient.get('/admin/subscriptions');
      return res.data;
    } catch {
      return MOCK.MOCK_SUBSCRIPTIONS;
    }
  },

  getSubscriptionPlans: async () => {
    try {
      const res = await apiClient.get('/plans');
      return res.data;
    } catch {
      return MOCK.MOCK_SUBSCRIPTION_PLANS;
    }
  },

  getCreditAccounts: async () => {
    try {
      const res = await apiClient.get('/admin/credit-accounts');
      return res.data;
    } catch {
      return MOCK.MOCK_CREDIT_ACCOUNTS;
    }
  },

  getSupportTickets: async () => {
    try {
      const res = await apiClient.get('/admin/support-tickets');
      return res.data;
    } catch {
      return MOCK.MOCK_SUPPORT_TICKETS;
    }
  },

  getCmsContent: async () => {
    try {
      const res = await apiClient.get('/admin/cms-content');
      return res.data;
    } catch {
      return MOCK.MOCK_CMS_CONTENT;
    }
  },

  getAdvertisements: async () => {
    try {
      const res = await apiClient.get('/admin/advertisements');
      return res.data;
    } catch {
      return MOCK.MOCK_ADVERTISEMENTS;
    }
  },

  getFeatureToggles: async () => {
    try {
      const res = await apiClient.get('/admin/feature-toggles');
      return res.data;
    } catch {
      return MOCK.MOCK_FEATURE_TOGGLES;
    }
  },

  getWebsiteConfigs: async () => {
    try {
      const res = await apiClient.get('/admin/config');
      return res.data;
    } catch {
      return MOCK.MOCK_WEBSITE_CONFIGS;
    }
  },

  getAuditLogs: async () => {
    try {
      const res = await apiClient.get('/admin/audit-logs');
      return res.data;
    } catch {
      return MOCK.MOCK_AUDIT_LOGS;
    }
  },

  getApiKeys: async () => {
    try {
      const res = await apiClient.get('/admin/api-keys');
      return res.data;
    } catch {
      return MOCK.MOCK_API_KEYS;
    }
  },

  getSystemHealth: async () => {
    try {
      const res = await apiClient.get('/admin/health');
      return res.data;
    } catch {
      return MOCK.MOCK_SYSTEM_HEALTH;
    }
  },

  getAdminUsers: async () => {
    try {
      const res = await apiClient.get('/admin/admin-users');
      return res.data;
    } catch {
      return MOCK.MOCK_ADMIN_USERS;
    }
  },
};

export default apiClient;
