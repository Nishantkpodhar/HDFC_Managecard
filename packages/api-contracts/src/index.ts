/**
 * @banking360/api-contracts - API Contracts
 * 
 * This package defines the API contracts (request/response types) for all microservices.
 * These contracts are shared between frontend micro-frontends and backend services
 * to ensure type-safe communication.
 */

import type {
  ApiResponse,
  PageRequest,
  PageResponse,
  RequestStatus,
  EntityStatus,
} from '@banking360/shared-types';

// Re-export shared types
export type {
  ApiResponse,
  PageRequest,
  PageResponse,
  RequestStatus,
  EntityStatus,
};

// Common API contract types
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>[];
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Standard error codes
export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  MFA_REQUIRED: 'MFA_REQUIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Business Logic
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  LIMIT_EXCEEDED: 'LIMIT_EXCEEDED',
  INVALID_STATE_TRANSITION: 'INVALID_STATE_TRANSITION',
  IDEMPOTENCY_KEY_EXISTS: 'IDEMPOTENCY_KEY_EXISTS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// Pagination contracts
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Health check contract
export interface HealthCheckResponse {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  timestamp: string;
  checks: {
    name: string;
    status: 'UP' | 'DOWN' | 'DEGRADED';
    details?: Record<string, unknown>;
  }[];
}

// Version info contract
export interface VersionInfo {
  version: string;
  buildNumber: string;
  buildTimestamp: string;
  gitCommit?: string;
}

/**
 * Shared API client used by every micro-frontend.
 *
 * The browser ONLY ever talks to the API Gateway (not individual backend
 * services). The base URL is configured via VITE_API_BASE_URL and defaults
 * to the locally running gateway.
 */
export interface ApiClient {
  get<T>(path: string): Promise<ApiSuccessResponse<T>>;
  post<T>(path: string, body?: unknown): Promise<ApiSuccessResponse<T>>;
  put<T>(path: string, body?: unknown): Promise<ApiSuccessResponse<T>>;
  patch<T>(path: string, body?: unknown): Promise<ApiSuccessResponse<T>>;
  delete<T>(path: string): Promise<ApiSuccessResponse<T>>;
}

interface WindowWithApiBaseUrl extends Window {
  VITE_API_BASE_URL?: string;
}

interface ImportMetaEnvWithApiBaseUrl {
  VITE_API_BASE_URL?: string;
}

interface ImportMetaWithEnv {
  env?: ImportMetaEnvWithApiBaseUrl;
}

const resolveBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const win = window as WindowWithApiBaseUrl;
    if (win.VITE_API_BASE_URL) {
      return win.VITE_API_BASE_URL;
    }
  }
  // Check import.meta.env for Vite
  if (typeof import.meta !== 'undefined') {
    const meta = import.meta as ImportMetaWithEnv;
    if (meta.env?.VITE_API_BASE_URL) {
      return meta.env.VITE_API_BASE_URL;
    }
  }
  return 'http://localhost:8080';
};

// Lightweight auth token accessor backed by sessionStorage (gateway-issued JWT).
function tokenFromStore(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return window.sessionStorage.getItem('b360_token');
  } catch {
    return null;
  }
}

export function createApiClient(baseUrl: string = resolveBaseUrl()): ApiClient {
  const request = async <T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiSuccessResponse<T>> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(tokenFromStore() ? { Authorization: `Bearer ${tokenFromStore()}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const json = (await res.json()) as ApiResult<T>;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (!json.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(json.error?.message ?? 'Request failed');
    }
    return json;
  };

  return {
    get: <T>(p: string) => request<T>('GET', p),
    post: <T>(p: string, b?: unknown) => request<T>('POST', p, b),
    put: <T>(p: string, b?: unknown) => request<T>('PUT', p, b),
    patch: <T>(p: string, b?: unknown) => request<T>('PATCH', p, b),
    delete: <T>(p: string) => request<T>('DELETE', p),
  };
}

// Hook-style factory so MFs can call useApiClient() consistently.
export function useApiClient(): ApiClient {
  return createApiClient();
}

// ====================
// Ledger Service Types
// ====================

export type LedgerEntryType = 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'ADJUSTMENT' | 'FEE' | 'INTEREST' | 'REWARD' | 'REVERSAL';

export interface LedgerEntryDto {
  id: string;
  accountId: string;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  referenceId?: string | null;
  idempotencyKey?: string | null;
  postedAt: string;
  createdAt: string;
}

export interface LedgerEntryRequest {
  accountId: string;
  type: LedgerEntryType;
  amount: number | string;
  currency: string;
  referenceId?: string;
  idempotencyKey?: string;
}

export interface LedgerEntryResponse {
  id: string;
  accountId: string;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  referenceId?: string | null;
  idempotencyKey?: string | null;
  postedAt: string;
  createdAt: string;
}

export interface LedgerPageResponse {
  content: LedgerEntryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
