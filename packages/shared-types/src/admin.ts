/**
 * Admin domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, EntityStatus } from './common';

export interface AdminUser extends BaseEntity {
  adminId: string;
  employeeId: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile: string;
  mobileVerified: boolean;
  status: AdminUserStatus;
  roles: AdminRole[];
  permissions: string[];
  department?: string;
  designation?: string;
  reportingManager?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  lockedAt?: string;
  lockedReason?: string;
  passwordChangedAt: string;
  mfaEnabled: boolean;
  mfaMethods: AdminMfaMethod[];
  sessionTimeoutMinutes: number;
  ipWhitelist?: string[];
  metadata?: Record<string, unknown>;
}

export type AdminUserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'LOCKED'
  | 'PENDING_VERIFICATION'
  | 'TERMINATED'
  | 'ON_LEAVE';

export interface AdminRole extends BaseEntity {
  roleId: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  level: number; // hierarchy level
  inheritsFrom?: string; // parent role ID
  status: EntityStatus;
  metadata?: Record<string, unknown>;
}

export interface AdminPermission extends BaseEntity {
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

export type AdminMfaMethod = 'TOTP' | 'SMS_OTP' | 'EMAIL_OTP' | 'HARDWARE_TOKEN' | 'BIOMETRIC' | 'PUSH_NOTIFICATION';

export interface AdminUserSearchRequest extends PageRequest {
  adminId?: string;
  employeeId?: string;
  email?: string;
  mobile?: string;
  status?: AdminUserStatus;
  roleId?: string;
  department?: string;
  locked?: boolean;
  mfaEnabled?: boolean;
  lastLoginFrom?: string;
  lastLoginTo?: string;
}

export interface AdminUserSearchResponse extends PageResponse<AdminUser> {}

export interface AdminRoleSearchRequest extends PageRequest {
  roleId?: string;
  name?: string;
  isSystem?: boolean;
  status?: EntityStatus;
  level?: number;
}

export interface AdminRoleSearchResponse extends PageResponse<AdminRole> {}

export interface AdminPermissionSearchRequest extends PageRequest {
  permissionId?: string;
  name?: string;
  resource?: string;
  action?: PermissionAction;
  category?: PermissionCategory;
  isSystem?: boolean;
}

export interface AdminPermissionSearchResponse extends PageResponse<AdminPermission> {}

export interface CreateAdminUserRequest {
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  roles: string[]; // role IDs
  department?: string;
  designation?: string;
  reportingManager?: string;
  sessionTimeoutMinutes?: number;
  ipWhitelist?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateAdminUserRequest {
  adminId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  status?: AdminUserStatus;
  roles?: string[];
  department?: string;
  designation?: string;
  reportingManager?: string;
  sessionTimeoutMinutes?: number;
  ipWhitelist?: string[];
  metadata?: Record<string, unknown>;
}

export interface AssignRoleRequest {
  adminId: string;
  roleId: string;
  assignedBy: string;
  expiresAt?: string;
  reason?: string;
}

export interface RevokeRoleRequest {
  adminId: string;
  roleId: string;
  revokedBy: string;
  reason?: string;
}

export interface ResetMfaRequest {
  adminId: string;
  requestedBy: string;
  reason?: string;
}

export interface AdminAuditLog extends BaseEntity {
  auditId: string;
  adminId: string;
  adminName: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  resourceType?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  correlationId: string;
  requestId: string;
  status: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  errorMessage?: string;
  durationMs: number;
  metadata?: Record<string, unknown>;
}

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'MFA_CHALLENGE'
  | 'MFA_SUCCESS'
  | 'MFA_FAILED'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'USER_SUSPEND'
  | 'USER_ACTIVATE'
  | 'USER_LOCK'
  | 'USER_UNLOCK'
  | 'ROLE_ASSIGN'
  | 'ROLE_REVOKE'
  | 'ROLE_CREATE'
  | 'ROLE_UPDATE'
  | 'ROLE_DELETE'
  | 'PERMISSION_GRANT'
  | 'PERMISSION_REVOKE'
  | 'CONFIG_CHANGE'
  | 'FEATURE_FLAG_CHANGE'
  | 'CUSTOMER_VIEW'
  | 'CUSTOMER_UPDATE'
  | 'CARD_ACTION'
  | 'TRANSACTION_VIEW'
  | 'PAYMENT_ACTION'
  | 'LEDGER_ACTION'
  | 'REWARD_ACTION'
  | 'EMI_ACTION'
  | 'LOAN_ACTION'
  | 'FASTAG_ACTION'
  | 'OFFER_ACTION'
  | 'NOTIFICATION_SEND'
  | 'CMS_ACTION'
  | 'REPORT_GENERATE'
  | 'DATA_EXPORT'
  | 'DATA_IMPORT'
  | 'SYSTEM_CONFIG'
  | 'SECURITY_CONFIG'
  | 'BACKUP'
  | 'RESTORE'
  | 'MAINTENANCE'
  | 'EMERGENCY_ACTION'
  | 'OTHER';

export interface AdminAuditSearchRequest extends PageRequest {
  adminId?: string;
  action?: AuditAction;
  resource?: string;
  resourceId?: string;
  resourceType?: string;
  status?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  ipAddress?: string;
  dateFrom?: string;
  dateTo?: string;
  correlationId?: string;
  requestId?: string;
}

export interface AdminAuditSearchResponse extends PageResponse<AdminAuditLog> {}

export interface AdminDashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersToday: number;
  newCustomersThisMonth: number;
  totalCards: number;
  activeCards: number;
  blockedCards: number;
  totalTransactionsToday: number;
  totalTransactionVolumeToday: Money;
  totalTransactionsThisMonth: number;
  totalTransactionVolumeThisMonth: Money;
  totalPaymentsToday: number;
  totalPaymentVolumeToday: Money;
  failedPaymentsToday: number;
  totalDisputesOpen: number;
  totalServiceRequestsOpen: number;
  systemHealth: SystemHealthSummary;
  alerts: AdminAlert[];
}

export interface SystemHealthSummary {
  overall: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'CRITICAL';
  services: ServiceHealth[];
  databases: DatabaseHealth[];
  messageQueues: QueueHealth[];
  caches: CacheHealth[];
}

export interface ServiceHealth {
  serviceName: string;
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';
  responseTimeMs: number;
  errorRate: number;
  lastCheck: string;
  uptimePercentage: number;
}

export interface DatabaseHealth {
  databaseName: string;
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';
  connectionsActive: number;
  connectionsMax: number;
  queryAvgTimeMs: number;
  replicationLagMs?: number;
  lastCheck: string;
}

export interface QueueHealth {
  queueName: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  messagesPending: number;
  messagesProcessing: number;
  consumerCount: number;
  throughputPerSec: number;
  lastCheck: string;
}

export interface CacheHealth {
  cacheName: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  hitRate: number;
  memoryUsedPercent: number;
  evictionsPerSec: number;
  lastCheck: string;
}

export interface AdminAlert {
  alertId: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  message: string;
  source: string;
  raisedAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  metadata?: Record<string, unknown>;
}

export interface AdminAnalytics {
  userActivity: UserActivityStat[];
  roleDistribution: RoleDistributionStat[];
  permissionUsage: PermissionUsageStat[];
  auditSummary: AuditSummaryStat[];
  loginStats: LoginStat[];
  actionStats: ActionStat[];
}

export interface UserActivityStat {
  adminId: string;
  adminName: string;
  role: string;
  actionsCount: number;
  lastActive: string;
  avgSessionDuration: number;
}

export interface RoleDistributionStat {
  roleId: string;
  roleName: string;
  userCount: number;
  percentage: number;
}

export interface PermissionUsageStat {
  permissionId: string;
  permissionName: string;
  usageCount: number;
  uniqueUsers: number;
}

export interface AuditSummaryStat {
  date: string;
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  uniqueAdmins: number;
}

export interface LoginStat {
  date: string;
  totalLogins: number;
  successfulLogins: number;
  failedLogins: number;
  uniqueUsers: number;
  mfaSuccessRate: number;
}

export interface ActionStat {
  action: AuditAction;
  count: number;
  successRate: number;
  avgDurationMs: number;
}