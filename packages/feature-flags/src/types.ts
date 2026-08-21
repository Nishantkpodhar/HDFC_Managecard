/**
 * @banking360/feature-flags - Feature Flag Types
 * 
 * Shared feature flag types used across all micro-frontends.
 */

import type { FeatureFlag as SharedFeatureFlag } from '@banking360/shared-types';

export interface FeatureFlag extends SharedFeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  segments?: string[];
  metadata?: Record<string, unknown>;
}

export interface FeatureFlagContext {
  userId?: string;
  customerId?: string;
  adminId?: string;
  roles?: string[];
  segment?: string;
  deviceType?: 'WEB' | 'MOBILE' | 'TABLET';
  location?: string;
  [key: string]: unknown;
}

export interface FeatureFlagEvaluation {
  flagKey: string;
  enabled: boolean;
  variant?: string;
  reason: 'DEFAULT' | 'TARGETING' | 'ROLLOUT' | 'OVERRIDE';
}

export interface FeatureFlagsState {
  flags: Record<string, boolean>;
  variants: Record<string, string>;
  lastFetched: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseFeatureFlagsOptions {
  autoFetch?: boolean;
  context?: FeatureFlagContext;
  fallbackFlags?: Record<string, boolean>;
}

export const FeatureFlagKeys = {
  // Customer features
  SMART_EMI: 'smartEmi',
  REWARDS: 'rewards',
  FASTAG: 'fastag',
  OFFERS: 'offers',
  CARD_CONTROLS: 'cardControls',
  TRANSACTION_CATEGORIZATION: 'transactionCategorization',
  SPENDING_INSIGHTS: 'spendingInsights',
  BILL_PAYMENT: 'billPayment',
  UPI_PAYMENTS: 'upiPayments',
  INTERNATIONAL_TRANSACTIONS: 'internationalTransactions',
  CONTACTLESS_PAYMENTS: 'contactlessPayments',
  VIRTUAL_CARDS: 'virtualCards',
  CARD_UPGRADE: 'cardUpgrade',
  LIMIT_ENHANCEMENT: 'limitEnhancement',
  DISPUTE_MANAGEMENT: 'disputeManagement',
  SERVICE_REQUESTS: 'serviceRequests',
  PROFILE_MANAGEMENT: 'profileManagement',
  NOTIFICATION_PREFERENCES: 'notificationPreferences',
  DARK_MODE: 'darkMode',
  BIOMETRIC_LOGIN: 'biometricLogin',
  
  // Admin features
  ADMIN_DASHBOARD: 'adminDashboard',
  ADMIN_CUSTOMERS: 'adminCustomers',
  ADMIN_CARDS: 'adminCards',
  ADMIN_TRANSACTIONS: 'adminTransactions',
  ADMIN_PAYMENTS: 'adminPayments',
  ADMIN_LEDGER: 'adminLedger',
  ADMIN_REWARDS: 'adminRewards',
  ADMIN_EMI: 'adminEmi',
  ADMIN_LOANS: 'adminLoans',
  ADMIN_FASTAG: 'adminFastag',
  ADMIN_OFFERS: 'adminOffers',
  ADMIN_CMS: 'adminCms',
  ADMIN_USERS: 'adminUsers',
  ADMIN_ROLES: 'adminRoles',
  ADMIN_PERMISSIONS: 'adminPermissions',
  ADMIN_CONFIGURATION: 'adminConfiguration',
  ADMIN_FEATURE_FLAGS: 'adminFeatureFlags',
  ADMIN_AUDIT: 'adminAudit',
  ADMIN_SECURITY: 'adminSecurity',
  ADMIN_SYSTEM_HEALTH: 'adminSystemHealth',
  ADMIN_REPORTING: 'adminReporting',
  
  // Experimental features
  AI_SPENDING_ADVISOR: 'aiSpendingAdvisor',
  VOICE_COMMANDS: 'voiceCommands',
  CHATBOT_SUPPORT: 'chatbotSupport',
  PREDICTIVE_ANALYTICS: 'predictiveAnalytics',
} as const;

export type FeatureFlagKey = (typeof FeatureFlagKeys)[keyof typeof FeatureFlagKeys];