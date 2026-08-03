export type AdminRole = 
  | 'super_admin' 
  | 'admin' 
  | 'manager' 
  | 'support' 
  | 'finance' 
  | 'marketing' 
  | 'operations';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export type UserDefaultRole = 'business' | 'customer' | 'delivery';

export interface SystemUser {
  id: string;
  phoneNumber: string;
  name: string;
  roleDefault: UserDefaultRole;
  preferredLanguage: 'ta' | 'en' | 'hi';
  isVerified: boolean;
  biometricEnabled: boolean;
  createdAt: string;
}

export type BusinessStatus = 'pending_verification' | 'active' | 'suspended';

export interface Business {
  id: string;
  name: string;
  slug: string;
  status: BusinessStatus;
  ownerUserId: string;
  businessTypeId?: string;
  owner?: {
    name: string;
    phoneNumber: string;
  };
  category?: {
    id: string;
    name: string;
  };
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  totalOrdersCount?: number;
  totalRevenue?: number;
  createdAt: string;
}

export type KycDocType = 'id_proof' | 'business_registration' | 'gst_certificate' | 'other';
export type KycStatus = 'submitted' | 'approved' | 'rejected';

export interface KycDocument {
  id: string;
  businessId: string;
  docType: KycDocType;
  fileName: string;
  /** Set for documents uploaded through POST /api/v1/files — fetch via AuthedFile. */
  fileId?: string | null;
  /** Only populated for public files or legacy absolute URLs. */
  fileUrl?: string | null;
  fileMimeType?: string | null;
  /** True when fileRef predates the files module and points at nothing retrievable. */
  isLegacyRef?: boolean;
  status: KycStatus;
  rejectionReason?: string;
  reviewedByAdminId?: string;
  createdAt: string;
  reviewedAt?: string;
  updatedAt?: string;
  business?: {
    name: string;
    ownerName?: string;
    ownerPhone?: string;
  };
}

export type CategoryAppliesTo = 'business_type' | 'product_category';

export interface Category {
  id: string;
  name: string;
  description?: string;
  nameTranslations?: {
    ta?: string;
    en?: string;
    hi?: string;
  };
  appliesTo: CategoryAppliesTo;
  parentId?: string;
  parentName?: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  businessId: string;
  businessName?: string;
  name: string;
  sku?: string;
  categoryId?: string;
  categoryName?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  unit: string;
  isAvailableToday?: boolean;
  batchNumber?: string;
  expiryDate?: string; // For medical shop module
  createdAt: string;
}

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'out_for_delivery' | 'ready_for_pickup' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'credit';
export type PaymentMethod = 'cash' | 'upi' | 'credit';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  businessId: string;
  business?: { name: string };
  customerUserId?: string;
  customer?: { name: string; phoneNumber: string };
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items?: OrderItem[];
  delivery?: { id: string } | null;
  kot?: { status: 'open' | 'in_progress' | 'served' | 'cancelled'; table?: { tableNumber: string } | null } | null;
  createdAt: string;
}

export type DeliveryStatus = 'offered' | 'accepted' | 'picked_up' | 'delivered' | 'failed' | 'attempted';
export type VehicleServiceType = 'delivery' | 'auto' | 'car';

export interface PartnerVehicle {
  id: string;
  partnerUserId: string;
  serviceType: VehicleServiceType;
  vehicleRegistrationNumber: string;
  vehicleModel?: string;
  verified: boolean;
  isAvailable: boolean;
  rejectionReason?: string;
  currentLat?: number;
  currentLng?: number;
  partner?: {
    name: string;
    phoneNumber: string;
  };
  createdAt: string;
}

// Shape matches the raw Prisma RideRequest row returned by GET /admin/rides
// (customer + ride.partner included) — Decimal columns (estimatedDistanceKm,
// adminDistanceKm, fareAmount) serialize as numeric strings over JSON.
export interface CustomerRideRequest {
  id: string;
  vehicleType: VehicleServiceType;
  pickupLat: string;
  pickupLng: string;
  dropLat: string;
  dropLng: string;
  estimatedDistanceKm: string;
  adminDistanceKm: string | null;
  bookingType: 'instant' | 'scheduled';
  scheduledAt: string | null;
  status: 'requested' | 'matched' | 'cancelled' | 'expired';
  createdAt: string;
  customer?: { name: string; phoneNumber: string };
  ride?: {
    id: string;
    status: string;
    fareAmount: string | null;
    otpCode: string;
    partner?: { name: string; phoneNumber: string } | null;
  } | null;
}

export interface RideFareSlab {
  id?: string;
  min_km: number;
  max_km: number | null;
  per_km_rate: number;
}

export interface RideFareConfig {
  vehicle_type: VehicleServiceType;
  base_fare: number;
  min_km: number;
  max_km: number | null;
  default_per_km_rate: number;
  slabs: RideFareSlab[];
}

export interface DeliveryJob {
  id: string;
  orderId: string;
  orderNumber: string;
  businessName: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  status: DeliveryStatus;
  pickupAddress: string;
  dropAddress: string;
  deliveryFee: number;
  otpCode?: string;
  createdAt: string;
}

export type SubscriptionStatus = 'trial' | 'active' | 'grace' | 'locked';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  priceMonthly: number;
  features: Record<string, boolean>;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  businessId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  gracePeriodEnd?: string;
  paymentRef?: string;
  business?: { name: string; ownerUserId: string; owner?: { name: string; phoneNumber: string } };
  plan?: { name: string; priceMonthly: string };
}

export interface CreditAccount {
  id: string;
  businessId: string;
  businessName: string;
  customerUserId: string;
  customerName: string;
  customerPhone: string;
  currentBalance: number;
  creditLimit: number;
  lastTransactionDate: string;
  status: 'active' | 'overdue' | 'written_off';
}

export interface CreditTransaction {
  id: string;
  creditAccountId: string;
  type: 'credit_given' | 'repayment' | 'write_off' | 'reversal';
  amount: number;
  note?: string;
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
}

export type TicketCategory = 'billing' | 'technical' | 'delivery' | 'credit_dispute' | 'other';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  raisedByUserId: string;
  raisedByName: string;
  raisedByPhone: string;
  businessId?: string;
  businessName?: string;
  category: TicketCategory;
  description: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isEmergencySos?: boolean;
  slaDueAt: string;
  slaBreached: boolean;
  assignedAdminId?: string;
  assignedAdminName?: string;
  deviceInfo?: {
    appVersion?: string;
    os?: string;
    deviceModel?: string;
  };
  createdAt: string;
  resolvedAt?: string;
}

export type CmsContentType = 'announcement' | 'help_article' | 'language_string';

export interface CmsContentItem {
  id: string;
  contentType: CmsContentType;
  key: string;
  titleEn?: string;
  bodyTa?: string;
  bodyEn?: string;
  bodyHi?: string;
  /** Banner image URL for announcements (public asset from /admin/upload/image). */
  mediaUrl?: string;
  published: boolean;
  updatedByAdminId?: string;
  updatedByAdminName?: string;
  updatedAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl?: string;
  placement: 'home_banner' | 'category_top' | 'checkout_footer';
  businessId?: string;
  businessName?: string;
  startDate: string;
  endDate: string;
  impressionsCount: number;
  clicksCount: number;
  active: boolean;
}

export interface FeatureToggle {
  id: string;
  featureKey: string;
  description: string;
  isEnabled: boolean;
  scopeType?: 'global' | 'business_type' | 'region';
  scopeValue?: string;
  updatedAt: string;
}

export interface WebsiteConfig {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: 'auth' | 'subscriptions' | 'delivery' | 'rides' | 'notifications' | 'system';
  description: string;
  updatedAt: string;
}

export type AuditActorType = 'admin' | 'owner' | 'employee';

export interface AuditLog {
  id: string;
  actorType: AuditActorType;
  actorId: string;
  actorName: string;
  actorRole?: string;
  actionType: string;
  entityReference: string;
  entityName?: string;
  reason?: string;
  meta?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  scopes: string[];
  isActive: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  admin?: { name: string; email: string };
}

export interface SystemHealthService {
  status: 'connected' | 'down' | 'configured';
  latencyMs?: number;
  provider?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded';
  uptime: number;
  timestamp: string;
  services: {
    database: SystemHealthService;
    redis: SystemHealthService;
    storage: SystemHealthService;
  };
  metrics: {
    memoryUsageMb: number;
    loadAverage: number[];
  };
}

export interface AnalyticsSummary {
  total_businesses: number;
  active_businesses: number;
  new_businesses_today: number;
  total_customers: number;
  total_orders: number;
  today_orders: number;
  total_revenue: number;
  today_revenue: number;
  total_verified_partners: number;
  active_delivery_jobs: number;
  open_support_tickets: number;
  sla_breached_tickets: number;
}
