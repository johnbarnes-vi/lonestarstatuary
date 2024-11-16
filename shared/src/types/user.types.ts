/**
 * Core User Interface Definitions
 * 
 * Comprehensive type definitions for user-related data in the Lone Star Statuary system.
 * Includes authentication, profile, shipping, order history, and preferences.
 */

/**
 * Represents a physical address
 */
interface Address {
    id: string;
    type: 'BILLING' | 'SHIPPING';
    isDefault: boolean;
    firstName: string;
    lastName: string;
    company?: string;
    streetAddress1: string;
    streetAddress2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    deliveryInstructions?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Notification preferences for different types of updates
   */
  interface NotificationPreferences {
    orderUpdates: {
      email: boolean;
      sms: boolean;
    };
    productionUpdates: {
      email: boolean;
      sms: boolean;
    };
    shippingUpdates: {
      email: boolean;
      sms: boolean;
    };
    marketing: {
      email: boolean;
      sms: boolean;
    };
  }
  
  /**
   * Represents a saved payment method
   */
  interface PaymentMethod {
    id: string;
    type: 'CARD' | 'BANK_ACCOUNT';
    isDefault: boolean;
    lastFourDigits: string;
    expiryMonth?: number;  // For cards only
    expiryYear?: number;   // For cards only
    cardBrand?: string;    // For cards only
    bankName?: string;     // For bank accounts only
    stripePaymentMethodId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Order history item with summary information
   */
  interface OrderSummary {
    id: string;
    orderNumber: string;
    orderType: 'REGULAR' | 'PRE_ORDER' | 'CUSTOM_COMMISSION';
    status: 'PENDING' | 'PAID' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    totalAmount: number;
    itemCount: number;
    orderDate: Date;
    estimatedDeliveryDate?: Date;
    trackingNumber?: string;
  }
  
  /**
   * Custom commission request in user's history
   */
  interface CommissionRequest {
    id: string;
    status: 'SUBMITTED' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';
    projectName: string;
    submissionDate: Date;
    quotedAmount?: number;
    description: string;
    files: Array<{
      id: string;
      filename: string;
      fileType: string;
      uploadDate: Date;
      fileUrl: string;
    }>;
    correspondenceCount: number;
    lastUpdateDate: Date;
  }
  
  /**
   * Main User interface combining all user-related data
   */
  interface User {
    // Basic Profile (from Auth0 + extended)
    id: string;
    auth0Id: string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    phoneVerified: boolean;
    avatarUrl?: string;
    
    // Account Status
    accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
    roles: Array<'CUSTOMER' | 'ADMIN'>;
    memberSince: Date;
    lastLoginDate: Date;
    
    // Addresses & Payment
    addresses: Address[];
    paymentMethods: PaymentMethod[];
    
    // Communication Preferences
    notificationPreferences: NotificationPreferences;
    preferredLanguage: 'en' | 'es';  // Expandable for future languages
    timezone: string;
    
    // Order History
    orders: OrderSummary[];
    preOrders: OrderSummary[];
    commissionRequests: CommissionRequest[];
    
    // Shopping Preferences
    favoriteCategories: Array<'ROMAN' | 'GREEK' | 'BUST'>;
    savedItems: string[];  // Product IDs
    recentlyViewed: Array<{
      productId: string;
      viewedAt: Date;
    }>;
    
    // Account Security
    mfaEnabled: boolean;
    lastPasswordChange: Date;
    securityQuestions: Array<{
      question: string;
      answerHash: string;  // Hashed for security
    }>;
    
    // Metadata
    createdAt: Date;
    updatedAt: Date;
    lastProfileUpdate: Date;
    gdprConsent?: {
      consentGiven: boolean;
      consentDate: Date;
      consentVersion: string;
    };
  }
  
  /**
   * User creation/update DTO with required fields
   */
  interface CreateUserDTO {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    password: string;
    notificationPreferences?: Partial<NotificationPreferences>;
    preferredLanguage?: 'en' | 'es';
  }
  
  /**
   * User update DTO with all fields optional
   */
  interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    notificationPreferences?: Partial<NotificationPreferences>;
    preferredLanguage?: 'en' | 'es';
    timezone?: string;
    favoriteCategories?: Array<'ROMAN' | 'GREEK' | 'BUST'>;
  }
  
  export type {
    User,
    Address,
    PaymentMethod,
    NotificationPreferences,
    OrderSummary,
    CommissionRequest,
    CreateUserDTO,
    UpdateUserDTO
  };