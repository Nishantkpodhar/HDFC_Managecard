/**
 * Authentication and Authorization types
 */

import type { BaseEntity } from './common';
import type { Customer } from './customer';

export interface UserRole extends BaseEntity {
  roleId: string;
  name: string;
  description?: string;
  isSystem: boolean;
  level: number;
  inheritsFrom?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
  metadata?: Record<string, unknown>;
}

export interface Permission extends BaseEntity {
  permissionId: string;
  name: string;
  description?: string;
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
  conditions?: PermissionCondition[];
  isSystem: boolean;
  category: PermissionCategory;
  metadata?: Record<string, unknown>;
}

export type PermissionAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'EXECUTE'
  | 'APPROVE'
  | 'REJECT'
  | 'EXPORT'
  | 'IMPORT'
  | 'CONFIGURE'
  | 'MONITOR'
  | 'AUDIT';

export type PermissionScope = 'GLOBAL' | 'DEPARTMENT' | 'BRANCH' | 'SELF' | 'CUSTOM';

export interface PermissionCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'CONTAINS';
  value: unknown;
}

export type PermissionCategory =
  | 'CUSTOMER_MANAGEMENT'
  | 'CARD_MANAGEMENT'
  | 'TRANSACTION_MANAGEMENT'
  | 'PAYMENT_MANAGEMENT'
  | 'LEDGER_MANAGEMENT'
  | 'REWARD_MANAGEMENT'
  | 'EMI_MANAGEMENT'
  | 'LOAN_MANAGEMENT'
  | 'FASTAG_MANAGEMENT'
  | 'OFFER_MANAGEMENT'
  | 'NOTIFICATION_MANAGEMENT'
  | 'CMS_MANAGEMENT'
  | 'CONFIGURATION_MANAGEMENT'
  | 'FEATURE_FLAG_MANAGEMENT'
  | 'USER_MANAGEMENT'
  | 'ROLE_MANAGEMENT'
  | 'PERMISSION_MANAGEMENT'
  | 'AUDIT_MANAGEMENT'
  | 'SECURITY_MANAGEMENT'
  | 'SYSTEM_HEALTH'
  | 'REPORTING'
  | 'SUPER_ADMIN';

export interface AuthSession {
  sessionId: string;
  userId: string;
  userType: 'CUSTOMER' | 'ADMIN';
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  lastActivityAt: string;
  deviceInfo?: string;
  ipAddress?: string;
  isMfaVerified: boolean;
  scopes: string[];
}

// API Request/Response types for auth-client
export interface LoginRequest {
  mobile: string;
  deviceInfo?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  sessionId?: string;
}

export interface OtpVerifyRequest {
  mobile: string;
  otp: string;
  deviceInfo?: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  customer: Customer;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LogoutRequest {
  sessionId?: string;
  revokeAllSessions?: boolean;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
}
