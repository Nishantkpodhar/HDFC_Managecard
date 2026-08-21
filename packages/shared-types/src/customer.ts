/**
 * Customer domain types
 */

import type { BaseEntity, EntityStatus, KycStatus, CustomerSegment, Address, Contact, Money, Channel, DocumentType, PageRequest, PageResponse} from './common';
import { ApiResponse } from './common';

export interface Customer extends BaseEntity {
  customerId: string; // Business identifier
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  email: string;
  mobile: string;
  alternateMobile?: string;
  pan: string;
  aadhaarMasked?: string;
  kycStatus: KycStatus;
  kycCompletedAt?: string;
  segment: CustomerSegment;
  status: EntityStatus;
  statusReason?: string;
  addresses: Address[];
  contacts: Contact;
  preferredLanguage: string;
  timezone: string;
  marketingConsent: boolean;
  lastLoginAt?: string;
  loginCount: number;
  failedLoginAttempts: number;
  lockedUntil?: string;
  metadata?: Record<string, unknown>;
}

export interface CustomerSummary {
  customerId: string;
  displayName: string;
  email: string;
  mobile: string;
  segment: CustomerSegment;
  status: EntityStatus;
  kycStatus: KycStatus;
  lastLoginAt?: string;
}

export interface CustomerProfile {
  customer: Customer;
  linkedProducts: LinkedProduct[];
  activeCards: number;
  totalCards: number;
  rewardBalance: Money;
  activeEMIs: number;
  activeLoans: number;
  fastagCount: number;
}

export interface LinkedProduct {
  productId: string;
  productType: ProductType;
  productName: string;
  accountNumber: string;
  accountNumberMasked: string;
  status: EntityStatus;
  openedDate: string;
  branchCode: string;
  currency: string;
  balance?: Money;
  availableBalance?: Money;
}

export type ProductType =
  | 'SAVINGS_ACCOUNT'
  | 'CURRENT_ACCOUNT'
  | 'FIXED_DEPOSIT'
  | 'RECURRING_DEPOSIT'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PERSONAL_LOAN'
  | 'HOME_LOAN'
  | 'AUTO_LOAN'
  | 'EDUCATION_LOAN'
  | 'GOLD_LOAN'
  | 'OVERDRAFT'
  | 'DEMAT_ACCOUNT'
  | 'MUTUAL_FUND'
  | 'INSURANCE'
  | 'FASTAG'
  | 'PPF'
  | 'NPS'
  | 'OTHER';

export interface CustomerSearchRequest extends PageRequest {
  query?: string;
  customerId?: string;
  email?: string;
  mobile?: string;
  pan?: string;
  segment?: CustomerSegment;
  status?: EntityStatus;
  kycStatus?: KycStatus;
  dateOfBirthFrom?: string;
  dateOfBirthTo?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface CustomerSearchResponse extends PageResponse<CustomerSummary> {}

export interface CreateCustomerRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Customer['gender'];
  email: string;
  mobile: string;
  alternateMobile?: string;
  pan: string;
  addresses: Address[];
  preferredLanguage?: string;
  timezone?: string;
  marketingConsent?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  alternateMobile?: string;
  addresses?: Address[];
  contacts?: Partial<Contact>;
  preferredLanguage?: string;
  timezone?: string;
  marketingConsent?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CustomerDocument {
  id: string;
  customerId: string;
  type: DocumentType;
  documentNumber: string;
  documentNumberMasked: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'EXPIRED';
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPreference {
  customerId: string;
  communicationPreferences: CommunicationPreference[];
  transactionAlerts: TransactionAlertPreference;
  marketingPreferences: MarketingPreference;
  securityPreferences: SecurityPreference;
  updatedAt: string;
  updatedBy: string;
}

export interface CommunicationPreference {
  channel: Channel;
  enabled: boolean;
  frequency?: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  categories?: string[];
}

export interface TransactionAlertPreference {
  enabled: boolean;
  minAmount?: Money;
  channels: Channel[];
  alertTypes: TransactionAlertType[];
}

export type TransactionAlertType =
  | 'DEBIT'
  | 'CREDIT'
  | 'LARGE_TRANSACTION'
  | 'INTERNATIONAL'
  | 'ONLINE'
  | 'ATM_WITHDRAWAL'
  | 'POS_PAYMENT'
  | 'BILL_PAYMENT'
  | 'EMI_DUE'
  | 'PAYMENT_DUE'
  | 'LOW_BALANCE'
  | 'CARD_EXPIRY'
  | 'REWARD_EXPIRY';

export interface MarketingPreference {
  enabled: boolean;
  categories: string[];
  channels: Channel[];
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  optOutDate?: string;
}

export interface SecurityPreference {
  mfaEnabled: boolean;
  mfaMethods: MfaMethod[];
  trustedDevices: TrustedDevice[];
  loginAlerts: boolean;
  sessionTimeout: number; // minutes
  autoLockEnabled: boolean;
  failedLoginAlerts: boolean;
}

export type MfaMethod = 'OTP_SMS' | 'OTP_EMAIL' | 'AUTHENTICATOR_APP' | 'BIOMETRIC' | 'HARDWARE_TOKEN';

export interface TrustedDevice {
  id: string;
  deviceName: string;
  deviceType: string;
  deviceFingerprint: string;
  lastUsedAt: string;
  trustedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface CustomerSession {
  id: string;
  customerId: string;
  deviceId?: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  location?: GeoLocation;
  startedAt: string;
  lastActivityAt: string;
  expiresAt: string;
  revokedAt?: string;
  revokedReason?: string;
  mfaVerified: boolean;
  mfaMethod?: MfaMethod;
}

export interface DeviceInfo {
  deviceId: string;
  deviceType: string;
  os: string;
  browser: string;
  appVersion?: string;
  pushToken?: string;
}

export interface GeoLocation {
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: CustomerActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  location?: GeoLocation;
  timestamp: string;
}

export type CustomerActivityType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'PASSWORD_CHANGE'
  | 'MFA_ENABLE'
  | 'MFA_DISABLE'
  | 'PROFILE_UPDATE'
  | 'ADDRESS_UPDATE'
  | 'CONTACT_UPDATE'
  | 'PREFERENCE_UPDATE'
  | 'DOCUMENT_UPLOAD'
  | 'DOCUMENT_VERIFY'
  | 'DEVICE_TRUST'
  | 'DEVICE_REVOKE'
  | 'SESSION_REVOKE'
  | 'CARD_ACTIVATE'
  | 'CARD_BLOCK'
  | 'PAYMENT_INITIATE'
  | 'REWARD_REDEEM'
  | 'EMI_BOOK'
  | 'LOAN_APPLY';