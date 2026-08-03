import axios, { type AxiosRequestConfig } from 'axios';
import { toast } from '../store/toastStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.goone.tech/api/v1';

/**
 * Per-request opt-outs, read by the interceptors below.
 * Declared on the axios config type so callers get autocomplete and type-checking.
 */
declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Suppress the global error toast — for callers that render their own error UI. */
    skipErrorToast?: boolean;
    /** Never replay this request after a token refresh (a consumed FormData body cannot be re-sent). */
    noRetry?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  // 5s was the previous value and it aborted every APK upload after five seconds
  // while the bytes kept streaming to the server. Uploads override this with 0.
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('goone_admin_token');
    const isPublicAuthRoute = config.url?.includes('/admin/auth/login') || config.url?.includes('/admin/auth/refresh');

    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isPublicAuthRoute) {
      console.warn(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url} - Missing authorization token`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Automatically unwrap standard backend responses: { success, data, meta }
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      // Retain meta pagination data if present
      const envelopeMeta = response.data.meta;
      response.data = response.data.data;
      if (envelopeMeta && typeof response.data === 'object' && response.data !== null && !Array.isArray(response.data)) {
        (response.data as any).meta = envelopeMeta;
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized (skip if the error comes from login or refresh endpoints)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      // A multipart body is a one-shot stream — replaying it after a refresh sends
      // an empty request. Upload callers refresh before starting instead.
      !originalRequest.noRetry &&
      !originalRequest.url?.includes('/admin/auth/login') &&
      !originalRequest.url?.includes('/admin/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('goone_admin_refresh_token');
      if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
        isRefreshing = false;
        const { useAuthStore } = await import('../store/authStore');
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/admin/auth/refresh`, {
          refresh_token: refreshToken,
        });

        // Backend response format: { success: true, data: { access_token, refresh_token } }
        const resData = res.data?.data || res.data;
        const access_token = resData.access_token;
        const new_refresh_token = resData.refresh_token || refreshToken;

        if (!access_token) {
          throw new Error('Refresh failed: No access token returned');
        }

        const { useAuthStore } = await import('../store/authStore');
        const user = useAuthStore.getState().user;
        if (user) {
          useAuthStore.getState().setAuth(access_token, new_refresh_token, user);
        }

        processQueue(null, access_token);
        originalRequest.headers.Authorization = 'Bearer ' + access_token;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { useAuthStore } = await import('../store/authStore');
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Extract exact backend error message if available
    const backendErrorMessage = error.response?.data?.error?.message || error.response?.data?.message;
    const message = backendErrorMessage || error.message || 'An unexpected error occurred';

    // Avoid duplicating toasts: refresh failures are handled above, and callers that
    // render their own inline error (file upload) opt out with skipErrorToast.
    if (!originalRequest?.url?.includes('/admin/auth/refresh') && !originalRequest?.skipErrorToast) {
      toast.error(message);
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
  getCustomerRides: async () => {
    const res = await apiClient.get('/admin/rides');
    return res.data;
  },
  updateRideDistance: async (requestId: string, distanceKm: number) => {
    const res = await apiClient.patch(`/admin/rides/${requestId}/distance`, { distance_km: distanceKm });
    return res.data;
  },
  getFareConfig: async (vehicleType: 'auto' | 'car') => {
    const res = await apiClient.get('/admin/rides/fare-config', { params: { vehicle_type: vehicleType } });
    return res.data;
  },
  saveFareConfig: async (payload: {
    vehicle_type: 'auto' | 'car';
    base_fare: number;
    min_km: number;
    max_km: number | null;
    default_per_km_rate: number;
    slabs: { min_km: number; max_km: number | null; per_km_rate: number }[];
  }) => {
    const res = await apiClient.put('/admin/rides/fare-config', payload);
    return res.data;
  },
  getSubscriptions: async () => {
    const res = await apiClient.get('/admin/subscriptions');
    return res.data;
  },
  getSubscriptionPlans: async () => {
    const res = await apiClient.get('/admin/plans');
    return res.data;
  },
  getCreditAccounts: async () => {
    const res = await apiClient.get('/admin/credit-accounts');
    return res.data;
  },
  getSupportTickets: async () => {
    try {
      const res = await apiClient.get('/admin/tickets'); // Corrected from /admin/support-tickets
      return res.data;
    } catch (e) {
      return []; // Return empty array on failure
    }
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
    const res = await apiClient.get('/admin/configs');
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
  /**
   * Uploads a file to any endpoint that accepts multipart.
   *
   * Deliberately does NOT set Content-Type — the browser must add the multipart
   * boundary itself, and axios does that automatically for a FormData body.
   */
  uploadFile: async (
    endpoint: string,
    formData: FormData,
    opts: { onProgress?: (percent: number) => void; signal?: AbortSignal } = {},
  ) => {
    const config: AxiosRequestConfig = {
      // No timeout: a 100 MB APK on a slow link legitimately takes minutes.
      timeout: 0,
      noRetry: true,
      skipErrorToast: true,
      onUploadProgress: (event) => {
        if (!opts.onProgress) return;
        // event.total is absent on some proxies; fall back to indeterminate.
        opts.onProgress(event.total ? Math.round((event.loaded * 100) / event.total) : -1);
      },
    };
    if (opts.signal) config.signal = opts.signal;

    const res = await apiClient.post(endpoint, formData, config);
    return res.data;
  },

  /** Fetches a file's bytes through the authenticated endpoint (private files). */
  fetchFileBlob: async (fileId: string, signal?: AbortSignal): Promise<Blob> => {
    const config: AxiosRequestConfig = { responseType: 'blob', skipErrorToast: true };
    if (signal) config.signal = signal;
    const res = await apiClient.get(`/files/${fileId}`, config);
    return res.data as Blob;
  },

  // ─── Mutations ──────────────────────────────────────────────────────────
  updateBusinessStatus: async (businessId: string, status: string) => {
    const res = await apiClient.patch(`/admin/businesses/${businessId}`, { status });
    return res.data;
  },
  reviewKycDocument: async (docId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    const res = await apiClient.patch(`/admin/kyc/${docId}/review`, {
      status,
      rejection_reason: rejectionReason,
    });
    return res.data;
  },
  createCategory: async (data: {
    name: string;
    appliesTo?: string;
    parentId?: string;
    nameTranslations?: { ta?: string; en?: string; hi?: string };
    iconUrl?: string;
  }) => {
    const res = await apiClient.post('/admin/categories', {
      name: data.name,
      applies_to: data.appliesTo,
      parent_id: data.parentId,
      name_translations: data.nameTranslations,
      icon_url: data.iconUrl,
    });
    return res.data;
  },
  updateFeatureToggle: async (key: string, isEnabled: boolean) => {
    const res = await apiClient.patch(`/admin/feature-toggles/${key}`, { is_enabled: isEnabled });
    return res.data;
  },
  updateWebsiteConfig: async (key: string, value: string) => {
    const res = await apiClient.put(`/admin/configs/${key}`, { value });
    return res.data;
  },
  createAdminUser: async (data: { email: string; password: string; name: string; role: string }) => {
    const res = await apiClient.post('/admin/users', data);
    return res.data;
  },
  updateAdminUser: async (id: string, data: { role?: string; active?: boolean }) => {
    const res = await apiClient.patch(`/admin/users/${id}`, data);
    return res.data;
  },
  updateSupportTicket: async (id: string, data: { status?: string; assigned_admin_id?: string }) => {
    const res = await apiClient.patch(`/admin/tickets/${id}`, data);
    return res.data;
  },
  overrideSubscription: async (
    businessId: string,
    data: { plan_id: string; reason: string; extend_days?: number },
  ) => {
    const res = await apiClient.post(`/admin/subscriptions/${businessId}/override`, data);
    return res.data;
  },
  upsertContentItem: async (data: Record<string, unknown>) => {
    const res = await apiClient.post('/admin/content', data);
    return res.data;
  },
  deleteContentItem: async (id: string) => {
    const res = await apiClient.delete(`/admin/content/${id}`);
    return res.data;
  },
};

export default apiClient;
