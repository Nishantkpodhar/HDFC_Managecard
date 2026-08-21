/**
 * @banking360/auth-client - Authentication Types
 * 
 * Shared authentication types used across all micro-frontends.
 */

import type { UserRole, Permission } from '@banking360/shared-types/auth';

export interface AuthUser {
  id: string;
  customerId?: string;
  adminId?: string;
  email: string;
  phone?: string;
  name: string;
  roles: UserRole[];
  permissions: Permission[];
  isCustomer: boolean;
  isAdmin: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  identifier: string; // email or phone
  password?: string;
  otp?: string;
  rememberMe?: boolean;
}

export interface OTPRequest {
  identifier: string; // email or phone
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  purpose: 'LOGIN' | 'TRANSACTION' | 'PROFILE_UPDATE' | 'CARD_CONTROL';
}

export interface OTPVerification {
  identifier: string;
  otp: string;
  purpose: 'LOGIN' | 'TRANSACTION' | 'PROFILE_UPDATE' | 'CARD_CONTROL';
  sessionId?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  scope: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
}

export interface AuthConfig {
  loginUrl: string;
  logoutUrl: string;
  refreshUrl: string;
  tokenEndpoint: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  pkceEnabled: boolean;
}