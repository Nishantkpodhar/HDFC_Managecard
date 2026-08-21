/**
 * Common types shared across all domains
 */

// Base entity with audit fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version: number;
}

// Pagination
export interface PageRequest {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Money representation (always use BigDecimal equivalent)
export interface Money {
  amount: string; // Decimal as string to preserve precision
  currency: Currency;
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export const DEFAULT_CURRENCY: Currency = 'INR';

// Money utility functions
export function createMoney(amount: number | string, currency: Currency = DEFAULT_CURRENCY): Money {
  return {
    amount: amount.toString(),
    currency
  };
}

export function moneyToNumber(money: Money): number {
  return parseFloat(money.amount);
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error('Cannot add money with different currencies');
  }
  return {
    amount: (parseFloat(a.amount) + parseFloat(b.amount)).toFixed(4),
    currency: a.currency
  };
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error('Cannot subtract money with different currencies');
  }
  return {
    amount: (parseFloat(a.amount) - parseFloat(b.amount)).toFixed(4),
    currency: a.currency
  };
}

export function multiplyMoney(money: Money, factor: number): Money {
  return {
    amount: (parseFloat(money.amount) * factor).toFixed(4),
    currency: money.currency
  };
}

export function isZero(money: Money): boolean {
  return parseFloat(money.amount) === 0;
}

export function isPositive(money: Money): boolean {
  return parseFloat(money.amount) > 0;
}

export function isNegative(money: Money): boolean {
  return parseFloat(money.amount) < 0;
}

export function compareMoney(a: Money, b: Money): number {
  if (a.currency !== b.currency) {
    throw new Error('Cannot compare money with different currencies');
  }
  const diff = parseFloat(a.amount) - parseFloat(b.amount);
  return diff > 0 ? 1 : diff < 0 ? -1 : 0;
}

// Address
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type?: 'HOME' | 'WORK' | 'BILLING' | 'SHIPPING' | 'OTHER';
}

// Contact
export interface Contact {
  email?: string;
  phone?: string;
  mobile?: string;
  preferredContactMethod?: 'EMAIL' | 'PHONE' | 'SMS' | 'PUSH';
}

// Date range
export interface DateRange {
  startDate: string;
  endDate: string;
}

// Status types
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'CLOSED' | 'BLOCKED';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    requestId: string;
    timestamp: string;
    version?: string;
  };
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | unknown[];
  fieldErrors?: FieldError[];
}

export interface FieldError {
  field: string;
  code: string;
  message: string;
}

// Request/Response metadata
export interface RequestMeta {
  requestId: string;
  correlationId?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Feature flags
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  segments?: string[];
  metadata?: Record<string, unknown>;
}

// Configuration
export interface ConfigurationItem {
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description?: string;
  category: string;
  editable: boolean;
  sensitive: boolean;
}

// Audit
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  actorId: string;
  actorType: 'CUSTOMER' | 'ADMIN' | 'SYSTEM';
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  requestId: string;
  correlationId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  result: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
}

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'MFA_ENABLE'
  | 'MFA_DISABLE'
  | 'CARD_ACTIVATE'
  | 'CARD_BLOCK'
  | 'CARD_HOTLIST'
  | 'CARD_REISSUE'
  | 'CARD_REPLACE'
  | 'CARD_LIMIT_CHANGE'
  | 'PAYMENT_INITIATE'
  | 'PAYMENT_COMPLETE'
  | 'PAYMENT_FAIL'
  | 'REWARD_REDEEM'
  | 'EMI_BOOK'
  | 'EMI_PRECLOSE'
  | 'LOAN_APPLY'
  | 'LOAN_APPROVE'
  | 'LOAN_DISBURSE'
  | 'FASTAG_RECHARGE'
  | 'OFFER_CREATE'
  | 'OFFER_UPDATE'
  | 'OFFER_DELETE'
  | 'PROFILE_UPDATE'
  | 'CONFIG_CHANGE'
  | 'FEATURE_FLAG_CHANGE'
  | 'ROLE_ASSIGN'
  | 'ROLE_REVOKE'
  | 'PERMISSION_GRANT'
  | 'PERMISSION_REVOKE';

// Enums
export enum Channel {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  API = 'API',
  BRANCH = 'BRANCH',
  ATM = 'ATM',
  IVR = 'IVR',
  SMS = 'SMS',
  EMAIL = 'EMAIL'
}

export enum DeviceType {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  UNKNOWN = 'UNKNOWN'
}

// Customer segment
export type CustomerSegment = 'PREMIUM' | 'GOLD' | 'SILVER' | 'BASIC' | 'STUDENT' | 'SENIOR' | 'NRI';

// KYC status
export type KycStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'EXPIRED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_REVIEW';

// Document types
export type DocumentType =
  | 'PAN'
  | 'AADHAAR'
  | 'PASSPORT'
  | 'DRIVING_LICENSE'
  | 'VOTER_ID'
  | 'UTILITY_BILL'
  | 'BANK_STATEMENT'
  | 'SALARY_SLIP'
  | 'FORM_16'
  | 'OTHER';

// Idempotency
export interface IdempotencyKey {
  key: string;
  createdAt: string;
  expiresAt: string;
  response?: unknown;
}

// Error codes
export enum ErrorCode {
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Auth
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  MFA_REQUIRED = 'MFA_REQUIRED',
  MFA_FAILED = 'MFA_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',

  // Customer
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
  CUSTOMER_INACTIVE = 'CUSTOMER_INACTIVE',
  KYC_INCOMPLETE = 'KYC_INCOMPLETE',
  KYC_EXPIRED = 'KYC_EXPIRED',

  // Card
  CARD_NOT_FOUND = 'CARD_NOT_FOUND',
  CARD_BLOCKED = 'CARD_BLOCKED',
  CARD_EXPIRED = 'CARD_EXPIRED',
  CARD_LIMIT_EXCEEDED = 'CARD_LIMIT_EXCEEDED',
  INVALID_CARD_STATUS = 'INVALID_CARD_STATUS',
  CARD_ALREADY_EXISTS = 'CARD_ALREADY_EXISTS',

  // Transaction
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  INVALID_TRANSACTION_STATE = 'INVALID_TRANSACTION_STATE',
  TRANSACTION_ALREADY_PROCESSED = 'TRANSACTION_ALREADY_PROCESSED',

  // Payment
  PAYMENT_NOT_FOUND = 'PAYMENT_NOT_FOUND',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  IDEMPOTENCY_KEY_EXISTS = 'IDEMPOTENCY_KEY_EXISTS',
  PAYMENT_ALREADY_PROCESSED = 'PAYMENT_ALREADY_PROCESSED',
  INVALID_PAYMENT_AMOUNT = 'INVALID_PAYMENT_AMOUNT',

  // Ledger
  LEDGER_ENTRY_NOT_FOUND = 'LEDGER_ENTRY_NOT_FOUND',
  LEDGER_IMBALANCE = 'LEDGER_IMBALANCE',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  ACCOUNT_FROZEN = 'ACCOUNT_FROZEN',

  // Reward
  REWARD_NOT_FOUND = 'REWARD_NOT_FOUND',
  INSUFFICIENT_REWARDS = 'INSUFFICIENT_REWARDS',
  REWARD_EXPIRED = 'REWARD_EXPIRED',
  REWARD_ALREADY_REDEEMED = 'REWARD_ALREADY_REDEEMED',

  // EMI
  EMI_NOT_ELIGIBLE = 'EMI_NOT_ELIGIBLE',
  EMI_TENURE_INVALID = 'EMI_TENURE_INVALID',
  EMI_AMOUNT_INVALID = 'EMI_AMOUNT_INVALID',
  EMI_ALREADY_BOOKED = 'EMI_ALREADY_BOOKED',

  // Loan
  LOAN_NOT_ELIGIBLE = 'LOAN_NOT_ELIGIBLE',
  LOAN_APPLICATION_REJECTED = 'LOAN_APPLICATION_REJECTED',
  LOAN_NOT_FOUND = 'LOAN_NOT_FOUND',

  // FASTag
  FASTAG_NOT_FOUND = 'FASTAG_NOT_FOUND',
  FASTAG_INACTIVE = 'FASTAG_INACTIVE',
  FASTAG_LOW_BALANCE = 'FASTAG_LOW_BALANCE',
  VEHICLE_NOT_FOUND = 'VEHICLE_NOT_FOUND',

  // Offer
  OFFER_NOT_FOUND = 'OFFER_NOT_FOUND',
  OFFER_NOT_ELIGIBLE = 'OFFER_NOT_ELIGIBLE',
  OFFER_EXPIRED = 'OFFER_EXPIRED',
  OFFER_ALREADY_CLAIMED = 'OFFER_ALREADY_CLAIMED',

  // Notification
  NOTIFICATION_NOT_FOUND = 'NOTIFICATION_NOT_FOUND',
  NOTIFICATION_PREFERENCES_NOT_FOUND = 'NOTIFICATION_PREFERENCES_NOT_FOUND',

  // Admin
  ADMIN_NOT_FOUND = 'ADMIN_NOT_FOUND',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  PERMISSION_NOT_FOUND = 'PERMISSION_NOT_FOUND',

  // Configuration
  CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
  CONFIG_INVALID = 'CONFIG_INVALID',

  // Feature Flag
  FEATURE_FLAG_NOT_FOUND = 'FEATURE_FLAG_NOT_FOUND'
}