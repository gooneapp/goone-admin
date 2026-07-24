import { 
  AdminUser, 
  SystemUser, 
  Business, 
  KycDocument, 
  Category, 
  Product, 
  Order, 
  PartnerVehicle, 
  DeliveryJob, 
  Subscription, 
  SubscriptionPlan, 
  CreditAccount, 
  SupportTicket, 
  CmsContentItem, 
  Advertisement, 
  FeatureToggle, 
  WebsiteConfig, 
  AuditLog, 
  ApiKey, 
  SystemServiceStatus, 
  AnalyticsSummary 
} from '../types';

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: 'usr-adm-1', email: 'superadmin@goone.in', name: 'Tamizh SuperAdmin', role: 'super_admin', active: true, createdAt: '2026-01-10T10:00:00Z' },
  { id: 'usr-adm-2', email: 'admin@goone.in', name: 'Anitha Admin', role: 'admin', active: true, createdAt: '2026-02-15T11:20:00Z' },
  { id: 'usr-adm-3', email: 'manager@goone.in', name: 'Karthik Operations Mgr', role: 'manager', active: true, createdAt: '2026-03-01T09:15:00Z' },
  { id: 'usr-adm-4', email: 'support@goone.in', name: 'Priya Support Lead', role: 'support', active: true, createdAt: '2026-03-05T14:30:00Z' },
  { id: 'usr-adm-5', email: 'finance@goone.in', name: 'Suresh Finance Lead', role: 'finance', active: true, createdAt: '2026-03-10T08:45:00Z' },
  { id: 'usr-adm-6', email: 'marketing@goone.in', name: 'Deepa Marketing Lead', role: 'marketing', active: true, createdAt: '2026-03-12T16:00:00Z' },
  { id: 'usr-adm-7', email: 'operations@goone.in', name: 'Ravi Fleet Ops Lead', role: 'operations', active: true, createdAt: '2026-03-15T12:00:00Z' },
];

export const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: 'u-101', name: 'Murugan K', phoneNumber: '9876543210', email: 'murugan@gmail.com', userType: 'business_owner', preferredLanguage: 'ta', isVerified: true, active: true, createdAt: '2026-04-01T08:00:00Z' },
  { id: 'u-102', name: 'Kavitha R', phoneNumber: '9876543211', email: 'kavitha@yahoo.com', userType: 'customer', preferredLanguage: 'ta', isVerified: true, active: true, createdAt: '2026-04-03T10:30:00Z' },
  { id: 'u-103', name: 'Senthil Kumar', phoneNumber: '9876543212', email: 'senthil@partner.in', userType: 'delivery_partner', preferredLanguage: 'ta', isVerified: true, active: true, createdAt: '2026-04-05T12:15:00Z' },
  { id: 'u-104', name: 'Ramesh Driver', phoneNumber: '9876543213', email: 'ramesh.auto@goone.in', userType: 'ride_driver', preferredLanguage: 'ta', isVerified: true, active: true, createdAt: '2026-04-06T09:00:00Z' },
  { id: 'u-105', name: 'Dr. Rajesh Sharma', phoneNumber: '9876543214', email: 'rajesh.medical@gmail.com', userType: 'business_owner', preferredLanguage: 'hi', isVerified: false, active: true, createdAt: '2026-07-20T15:45:00Z' },
  { id: 'u-106', name: 'Lakshmi Ammal', phoneNumber: '9876543215', email: 'lakshmi.farm@gmail.com', userType: 'business_owner', preferredLanguage: 'ta', isVerified: true, active: true, createdAt: '2026-05-12T11:10:00Z' },
];

export const MOCK_BUSINESSES: Business[] = [
  { id: 'b-001', name: 'Murugan General Stores', slug: 'murugan-stores', status: 'active', ownerUserId: 'u-101', owner: { name: 'Murugan K', phoneNumber: '9876543210' }, category: { id: 'c-1', name: 'Grocery & Spices' }, address: '45 Main Bazaar, Madurai', city: 'Madurai', state: 'Tamil Nadu', pincode: '625001', totalOrdersCount: 1420, totalRevenue: 385000, createdAt: '2026-04-01T08:00:00Z' },
  { id: 'b-002', name: 'Vetrivel Medicals', slug: 'vetrivel-medicals', status: 'pending_verification', ownerUserId: 'u-105', owner: { name: 'Dr. Rajesh Sharma', phoneNumber: '9876543214' }, category: { id: 'c-2', name: 'Pharmacy & Healthcare' }, address: '12 Hospital Road, Salem', city: 'Salem', state: 'Tamil Nadu', pincode: '636001', totalOrdersCount: 88, totalRevenue: 42000, createdAt: '2026-07-20T15:45:00Z' },
  { id: 'b-003', name: 'Sri Lakshmi Organic Farm', slug: 'lakshmi-farm', status: 'active', ownerUserId: 'u-106', owner: { name: 'Lakshmi Ammal', phoneNumber: '9876543215' }, category: { id: 'c-3', name: 'Farmer Direct Produce' }, address: 'South Street, Dindigul', city: 'Dindigul', state: 'Tamil Nadu', pincode: '624001', totalOrdersCount: 530, totalRevenue: 195000, createdAt: '2026-05-12T11:10:00Z' },
  { id: 'b-004', name: 'Saravana Tea & Tiffin Stall', slug: 'saravana-tea', status: 'active', ownerUserId: 'u-101', owner: { name: 'Saravanan S', phoneNumber: '9876543219' }, category: { id: 'c-4', name: 'Hotel & Restaurant' }, address: 'Bus Stand Complex, Thanjavur', city: 'Thanjavur', state: 'Tamil Nadu', pincode: '613001', totalOrdersCount: 2900, totalRevenue: 480000, createdAt: '2026-03-15T09:30:00Z' },
  { id: 'b-005', name: 'Aavin Dairy & Water Supply', slug: 'aavin-water', status: 'suspended', ownerUserId: 'u-102', owner: { name: 'Kavitha R', phoneNumber: '9876543211' }, category: { id: 'c-5', name: 'Milk & Water Delivery' }, address: '18 Ring Road, Erode', city: 'Erode', state: 'Tamil Nadu', pincode: '638001', totalOrdersCount: 310, totalRevenue: 64000, createdAt: '2026-02-10T14:20:00Z' },
];

export const MOCK_KYC_DOCUMENTS: KycDocument[] = [
  { id: 'kyc-101', businessId: 'b-002', docType: 'gst_certificate', fileUrl: 'https://placehold.co/600x400/1e293b/38bdf8?text=GST+Certificate+Sample', fileName: 'GST_Vetrivel_Medicals.pdf', status: 'submitted', createdAt: '2026-07-20T16:00:00Z', business: { name: 'Vetrivel Medicals', ownerName: 'Dr. Rajesh Sharma', ownerPhone: '9876543214' } },
  { id: 'kyc-102', businessId: 'b-002', docType: 'id_proof', fileUrl: 'https://placehold.co/600x400/1e293b/38bdf8?text=Aadhaar+ID+Proof', fileName: 'Aadhaar_Rajesh.pdf', status: 'submitted', createdAt: '2026-07-20T16:05:00Z', business: { name: 'Vetrivel Medicals', ownerName: 'Dr. Rajesh Sharma', ownerPhone: '9876543214' } },
  { id: 'kyc-103', businessId: 'b-001', docType: 'business_registration', fileUrl: 'https://placehold.co/600x400/1e293b/38bdf8?text=Trade+License+Verified', fileName: 'TradeLicense_Murugan.pdf', status: 'approved', createdAt: '2026-04-01T08:30:00Z', business: { name: 'Murugan General Stores', ownerName: 'Murugan K', ownerPhone: '9876543210' } },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c-1', name: 'Grocery & Spices', slug: 'grocery-spices', description: 'Essential staples, rice, dal, edible oils', appliesTo: 'business_type', extensionModule: 'None', active: true, nameTranslations: { ta: 'மளிகை & நறுமணப் பொருட்கள்', en: 'Grocery & Spices', hi: 'किराना और मसाले' } },
  { id: 'c-2', name: 'Pharmacy & Healthcare', slug: 'pharmacy', description: 'Medicines, medical supplies, prescription tracking', appliesTo: 'business_type', extensionModule: 'Medical', active: true, nameTranslations: { ta: 'மருந்தகம் & ஆரோக்கியம்', en: 'Pharmacy & Healthcare', hi: 'दवाइयां और स्वास्थ्य' } },
  { id: 'c-3', name: 'Farmer Direct Produce', slug: 'farmer-produce', description: 'Fresh vegetables, fruits, crops direct from farmers', appliesTo: 'business_type', extensionModule: 'Farmer', active: true, nameTranslations: { ta: 'விவசாய நேரடி பொருட்கள்', en: 'Farmer Direct Produce', hi: 'किसान उपज' } },
  { id: 'c-4', name: 'Hotel & Restaurant', slug: 'hotel-restaurant', description: 'Food menu, Kitchen Order Tickets (KOT), dining tables', appliesTo: 'business_type', extensionModule: 'Hospitality', active: true, nameTranslations: { ta: 'உணவகம் & ஹோட்டல்', en: 'Hotel & Restaurant', hi: 'होटल और रेस्तरां' } },
  { id: 'c-5', name: 'Milk & Water Delivery', slug: 'milk-water', description: 'Daily recurring subscription delivery routes', appliesTo: 'business_type', extensionModule: 'MilkWater', active: true, nameTranslations: { ta: 'பால் & குடிநீர் விநியோகம்', en: 'Milk & Water Delivery', hi: 'दूध और पानी आपूर्ति' } },
  { id: 'c-6', name: 'Service Provider', slug: 'service-provider', description: 'Electrical, plumbing, repair slot bookings', appliesTo: 'business_type', extensionModule: 'ServiceProvider', active: true, nameTranslations: { ta: 'சேவை வழங்குநர்', en: 'Service Provider', hi: 'सेवा प्रदाता' } },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p-101', businessId: 'b-001', businessName: 'Murugan General Stores', name: 'Ponni Boiled Rice (25kg)', sku: 'RICE-25KG', categoryName: 'Grocery & Spices', price: 1350.00, stockQuantity: 42, lowStockThreshold: 10, unit: 'bag', isAvailableToday: true, createdAt: '2026-04-02T10:00:00Z' },
  { id: 'p-102', businessId: 'b-001', businessName: 'Murugan General Stores', name: 'Gold Winner Sunflower Oil 1L', sku: 'OIL-SUN-1L', categoryName: 'Grocery & Spices', price: 145.00, stockQuantity: 4, lowStockThreshold: 15, unit: 'pouch', isAvailableToday: true, createdAt: '2026-04-02T10:15:00Z' },
  { id: 'p-103', businessId: 'b-002', businessName: 'Vetrivel Medicals', name: 'Paracetamol 650mg Tablets', sku: 'MED-PARA-650', categoryName: 'Pharmacy & Healthcare', price: 32.50, stockQuantity: 250, lowStockThreshold: 50, unit: 'strip', batchNumber: 'BATCH-2026-X', expiryDate: '2027-12-31', isAvailableToday: true, createdAt: '2026-07-21T09:00:00Z' },
  { id: 'p-104', businessId: 'b-002', businessName: 'Vetrivel Medicals', name: 'Amoxicillin 500mg (EXPIRED BATCH TEST)', sku: 'MED-AMO-500', categoryName: 'Pharmacy & Healthcare', price: 85.00, stockQuantity: 12, lowStockThreshold: 20, unit: 'strip', batchNumber: 'EXP-BATCH-99', expiryDate: '2026-05-01', isAvailableToday: false, createdAt: '2026-01-10T09:00:00Z' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ord-901', orderNumber: 'GO-2026-8812', businessId: 'b-001', businessName: 'Murugan General Stores', customerUserId: 'u-102', customerName: 'Kavitha R', customerPhone: '9876543211', totalAmount: 1495.00, status: 'out_for_delivery', paymentStatus: 'paid', paymentMethod: 'upi', itemsCount: 2, isDelivery: true, deliveryAddress: '14 Cross Road, Madurai', createdAt: '2026-07-23T20:15:00Z', items: [{ id: 'i-1', productName: 'Ponni Boiled Rice (25kg)', quantity: 1, unitPrice: 1350, totalPrice: 1350 }, { id: 'i-2', productName: 'Gold Winner Sunflower Oil 1L', quantity: 1, unitPrice: 145, totalPrice: 145 }] },
  { id: 'ord-902', orderNumber: 'GO-2026-8813', businessId: 'b-004', businessName: 'Saravana Tea & Tiffin Stall', customerUserId: 'u-102', customerName: 'Kavitha R', customerPhone: '9876543211', totalAmount: 180.00, status: 'preparing', paymentStatus: 'pending', paymentMethod: 'cash', itemsCount: 3, kotStatus: 'in_progress', tableNumber: 'T-04', isDelivery: false, createdAt: '2026-07-23T22:05:00Z' },
  { id: 'ord-903', orderNumber: 'GO-2026-8799', businessId: 'b-003', businessName: 'Sri Lakshmi Organic Farm', customerUserId: 'u-101', customerName: 'Murugan K', customerPhone: '9876543210', totalAmount: 420.00, status: 'completed', paymentStatus: 'credit', paymentMethod: 'credit', itemsCount: 4, isDelivery: true, deliveryAddress: '45 Main Bazaar, Madurai', createdAt: '2026-07-23T14:30:00Z' },
];

export const MOCK_PARTNER_VEHICLES: PartnerVehicle[] = [
  { id: 'pv-501', partnerUserId: 'u-103', serviceType: 'delivery', vehicleRegistrationNumber: 'TN 58 AB 1234', vehicleModel: 'Hero Splendor Plus', verified: true, isAvailable: true, currentLat: 9.9252, currentLng: 78.1198, partner: { name: 'Senthil Kumar', phoneNumber: '9876543212' }, createdAt: '2026-04-05T12:15:00Z' },
  { id: 'pv-502', partnerUserId: 'u-104', serviceType: 'auto', vehicleRegistrationNumber: 'TN 58 C 9988', vehicleModel: 'Bajaj RE Auto', verified: true, isAvailable: true, currentLat: 9.9310, currentLng: 78.1250, partner: { name: 'Ramesh Driver', phoneNumber: '9876543213' }, createdAt: '2026-04-06T09:00:00Z' },
  { id: 'pv-503', partnerUserId: 'u-103', serviceType: 'car', vehicleRegistrationNumber: 'TN 37 BK 4455', vehicleModel: 'Maruti Suzuki Dzire', verified: false, isAvailable: false, rejectionReason: 'Vehicle insurance document unreadable', partner: { name: 'Senthil Kumar', phoneNumber: '9876543212' }, createdAt: '2026-07-22T11:00:00Z' },
];

export const MOCK_DELIVERY_JOBS: DeliveryJob[] = [
  { id: 'del-301', orderId: 'ord-901', orderNumber: 'GO-2026-8812', businessName: 'Murugan General Stores', deliveryPartnerId: 'u-103', deliveryPartnerName: 'Senthil Kumar', status: 'picked_up', pickupAddress: '45 Main Bazaar, Madurai', dropAddress: '14 Cross Road, Madurai', deliveryFee: 45.00, otpCode: '4921', createdAt: '2026-07-23T20:20:00Z' },
];

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: 'plan-starter', name: 'Starter Plan', priceMonthly: 299, priceAnnual: 2990, maxEmployees: 2, features: ['Quick Billing', 'Basic Credit Book', 'Inventory Management'], active: true },
  { id: 'plan-pro', name: 'Pro Business Plan', priceMonthly: 599, priceAnnual: 5990, maxEmployees: 5, features: ['Quick Billing', 'Unlimited Credit Book', 'Low-Stock Alerts', 'Delivery Integration', 'KOT Restaurant Module', 'Reports Export'], active: true },
  { id: 'plan-enterprise', name: 'Enterprise Super Plan', priceMonthly: 1299, priceAnnual: 12990, maxEmployees: 25, features: ['All Modules Included', 'Multi-Branch Support', 'Dedicated Support Hotline', 'Advanced AI Analytics', 'API Webhooks Access'], active: true },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub-801', businessId: 'b-001', businessName: 'Murugan General Stores', ownerName: 'Murugan K', ownerPhone: '9876543210', planId: 'plan-pro', planName: 'Pro Business Plan', status: 'active', startDate: '2026-04-01T00:00:00Z', endDate: '2027-03-31T23:59:59Z', lastPaymentAmount: 5990, lastPaymentDate: '2026-04-01T08:10:00Z' },
  { id: 'sub-802', businessId: 'b-002', businessName: 'Vetrivel Medicals', ownerName: 'Dr. Rajesh Sharma', ownerPhone: '9876543214', planId: 'plan-starter', planName: 'Starter Plan', status: 'trial', startDate: '2026-07-20T00:00:00Z', endDate: '2026-08-04T23:59:59Z' },
  { id: 'sub-803', businessId: 'b-005', businessName: 'Aavin Dairy & Water Supply', ownerName: 'Kavitha R', ownerPhone: '9876543211', planId: 'plan-pro', planName: 'Pro Business Plan', status: 'grace', startDate: '2025-07-01T00:00:00Z', endDate: '2026-07-15T23:59:59Z', gracePeriodEnd: '2026-07-30T23:59:59Z' },
];

export const MOCK_CREDIT_ACCOUNTS: CreditAccount[] = [
  { id: 'ca-101', businessId: 'b-001', businessName: 'Murugan General Stores', customerUserId: 'u-102', customerName: 'Kavitha R', customerPhone: '9876543211', currentBalance: 3450.00, creditLimit: 5000.00, lastTransactionDate: '2026-07-23T14:30:00Z', status: 'active' },
  { id: 'ca-102', businessId: 'b-003', businessName: 'Sri Lakshmi Organic Farm', customerUserId: 'u-101', customerName: 'Murugan K', customerPhone: '9876543210', currentBalance: 7800.00, creditLimit: 10000.00, lastTransactionDate: '2026-07-23T11:00:00Z', status: 'overdue' },
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  { id: 't-401', ticketNumber: 'TKT-2026-0091', raisedByUserId: 'u-101', raisedByName: 'Murugan K', raisedByPhone: '9876543210', businessId: 'b-001', businessName: 'Murugan General Stores', category: 'delivery', description: 'Delivery partner assigned was unable to locate pickup location.', status: 'open', priority: 'high', slaDueAt: '2026-07-24T10:00:00Z', slaBreached: false, deviceInfo: { appVersion: '2.4.1', os: 'Android 13', deviceModel: 'Samsung Galaxy M32' }, createdAt: '2026-07-23T21:10:00Z' },
  { id: 't-402', ticketNumber: 'SOS-2026-0004', raisedByUserId: 'u-102', raisedByName: 'Kavitha R', raisedByPhone: '9876543211', category: 'technical', description: 'EMERGENCY SOS: Ride Auto driver deviated from route.', status: 'in_progress', priority: 'critical', isEmergencySos: true, slaDueAt: '2026-07-23T22:45:00Z', slaBreached: true, assignedAdminId: 'usr-adm-4', assignedAdminName: 'Priya Support Lead', createdAt: '2026-07-23T22:15:00Z' },
];

export const MOCK_CMS_CONTENT: CmsContentItem[] = [
  { id: 'cms-01', contentType: 'announcement', key: 'FARMER_FESTIVAL_DISCOUNT', titleEn: 'Pongal Special Farmer Direct Commission Waiver', bodyTa: 'பொங்கல் பண்டிகையை முன்னிட்டு விவசாயிகளுக்கு கட்டண விலக்கு!', bodyEn: 'Zero commission for farmer direct listings throughout Pongal festival season!', bodyHi: 'पोंगल उत्सव के दौरान किसान सूची पर शून्य कमीशन!', published: true, updatedByAdminName: 'Deepa Marketing Lead', updatedAt: '2026-07-20T10:00:00Z' },
  { id: 'cms-02', contentType: 'language_string', key: 'BTN_PRINT_RECEIPT', bodyTa: 'ரசீது அச்சிடுக', bodyEn: 'Print Receipt', bodyHi: 'रसीद प्रिंट करें', published: true, updatedByAdminName: 'Deepa Marketing Lead', updatedAt: '2026-07-15T14:30:00Z' },
];

export const MOCK_ADVERTISEMENTS: Advertisement[] = [
  { id: 'ad-101', title: 'Saravana Tiffin Stall 20% Off Weekend Combo', imageUrl: 'https://placehold.co/800x300/0f172a/f59e0b?text=Saravana+Tiffin+20%25+OFF', placement: 'home_banner', businessId: 'b-004', businessName: 'Saravana Tea & Tiffin Stall', startDate: '2026-07-01', endDate: '2026-08-31', impressionsCount: 14200, clicksCount: 1850, active: true },
];

export const MOCK_FEATURE_TOGGLES: FeatureToggle[] = [
  { id: 'ft-1', featureKey: 'BLUETOOTH_PRINTING', description: 'Enable ESC/POS Bluetooth bill printing in Business App', isEnabled: true, scopeType: 'global', updatedAt: '2026-07-22T10:00:00Z' },
  { id: 'ft-2', featureKey: 'RIDE_BOOKING_AUTO_CAR', description: 'Enable Auto (5km min) and Car (15km min) booking in Customer App', isEnabled: true, scopeType: 'region', scopeValue: 'Madurai', updatedAt: '2026-07-20T12:00:00Z' },
];

export const MOCK_WEBSITE_CONFIGS: WebsiteConfig[] = [
  { id: 'cfg-1', key: 'RIDE_MIN_DISTANCE_AUTO_KM', value: '5', type: 'number', category: 'rides', description: 'Minimum trip distance required to offer Auto ride option', updatedAt: '2026-07-22T10:00:00Z' },
  { id: 'cfg-2', key: 'RIDE_MIN_DISTANCE_CAR_KM', value: '15', type: 'number', category: 'rides', description: 'Minimum trip distance required to offer Car ride option', updatedAt: '2026-07-22T10:00:00Z' },
  { id: 'cfg-3', key: 'SUBSCRIPTION_TRIAL_DAYS', value: '14', type: 'number', category: 'subscriptions', description: 'Free trial duration for newly onboarded businesses', updatedAt: '2026-07-01T09:00:00Z' },
  { id: 'cfg-4', key: 'OTP_EXPIRY_MINUTES', value: '5', type: 'number', category: 'auth', description: 'Time-to-live for 6-digit OTP verification codes', updatedAt: '2026-06-15T08:00:00Z' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-991', actorType: 'admin', actorId: 'usr-adm-1', actorName: 'Tamizh SuperAdmin', actorRole: 'super_admin', actionType: 'SUSPEND_BUSINESS', entityReference: 'b-005', entityName: 'Aavin Dairy & Water Supply', reason: 'Subscription grace period expired without payment renewal', ipAddress: '182.73.44.12', timestamp: '2026-07-23T18:30:00Z' },
  { id: 'aud-992', actorType: 'admin', actorId: 'usr-adm-2', actorName: 'Anitha Admin', actorRole: 'admin', actionType: 'APPROVE_KYC', entityReference: 'b-001', entityName: 'Murugan General Stores', reason: 'Verified Trade License against municipal database', ipAddress: '182.73.44.15', timestamp: '2026-04-01T08:30:00Z' },
];

export const MOCK_API_KEYS: ApiKey[] = [
  { id: 'ak-1', name: 'MSG91 SMS Gateway Webhook', keyPrefix: 'goone_live_sms_', role: 'system_service', rateLimitPerMin: 1200, active: true, lastUsedAt: '2026-07-23T22:30:00Z', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'ak-2', name: 'Exotel Voice Call Adapter', keyPrefix: 'goone_live_voice_', role: 'system_service', rateLimitPerMin: 300, active: true, lastUsedAt: '2026-07-23T21:45:00Z', createdAt: '2026-02-01T11:00:00Z' },
];

export const MOCK_SYSTEM_HEALTH: SystemServiceStatus[] = [
  { name: 'PostgreSQL Database Primary', status: 'healthy', latencyMs: 4, uptimePercentage: 99.98, lastChecked: 'Just now' },
  { name: 'Redis Cache Cluster', status: 'healthy', latencyMs: 1, uptimePercentage: 100.00, lastChecked: 'Just now' },
  { name: 'RabbitMQ Event Bus', status: 'healthy', latencyMs: 3, uptimePercentage: 99.95, lastChecked: 'Just now' },
  { name: 'MSG91 SMS Gateway Adapter', status: 'healthy', latencyMs: 120, uptimePercentage: 99.85, lastChecked: 'Just now' },
  { name: 'FCM Push Notification Dispatcher', status: 'healthy', latencyMs: 85, uptimePercentage: 99.90, lastChecked: 'Just now' },
];

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  total_businesses: 4850,
  active_businesses: 4120,
  new_businesses_today: 34,
  total_customers: 125000,
  total_orders: 894000,
  today_orders: 14200,
  total_revenue: 148500000,
  today_revenue: 2350000,
  total_verified_partners: 890,
  active_delivery_jobs: 145,
  open_support_tickets: 18,
  sla_breached_tickets: 1,
};
