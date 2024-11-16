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
    expiryMonth?: number;
    expiryYear?: number;
    cardBrand?: string;
    bankName?: string;
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
    id: string;
    auth0Id: string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    phoneVerified: boolean;
    avatarUrl?: string;
    accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
    roles: Array<'CUSTOMER' | 'ADMIN'>;
    memberSince: Date;
    lastLoginDate: Date;
    addresses: Address[];
    paymentMethods: PaymentMethod[];
    notificationPreferences: NotificationPreferences;
    preferredLanguage: 'en' | 'es';
    timezone: string;
    orders: OrderSummary[];
    preOrders: OrderSummary[];
    commissionRequests: CommissionRequest[];
    favoriteCategories: Array<'ROMAN' | 'GREEK' | 'BUST'>;
    savedItems: string[];
    recentlyViewed: Array<{
        productId: string;
        viewedAt: Date;
    }>;
    mfaEnabled: boolean;
    lastPasswordChange: Date;
    securityQuestions: Array<{
        question: string;
        answerHash: string;
    }>;
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
export type { User, Address, PaymentMethod, NotificationPreferences, OrderSummary, CommissionRequest, CreateUserDTO, UpdateUserDTO };
