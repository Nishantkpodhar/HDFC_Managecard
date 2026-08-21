/**
 * Notification domain types
 */

import type { BaseEntity, PageRequest, PageResponse, EntityStatus, Channel } from './common';

export interface Notification extends BaseEntity {
  notificationId: string;
  customerId?: string; // null for broadcast
  adminId?: string; // for admin notifications
  templateId: string;
  title: string;
  body: string;
  richContent?: NotificationRichContent;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  channel: Channel;
  status: NotificationStatus;
  recipient: NotificationRecipient;
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  clickedAt?: string;
  dismissedAt?: string;
  failedAt?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}

export type NotificationType =
  | 'TRANSACTION_ALERT'
  | 'PAYMENT_ALERT'
  | 'CARD_ALERT'
  | 'SECURITY_ALERT'
  | 'BILL_REMINDER'
  | 'EMI_REMINDER'
  | 'LOAN_REMINDER'
  | 'REWARD_ALERT'
  | 'OFFER_ALERT'
  | 'FASTAG_ALERT'
  | 'KYC_ALERT'
  | 'PROFILE_UPDATE'
  | 'DOCUMENT_VERIFICATION'
  | 'STATEMENT_READY'
  | 'PROMOTIONAL'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'MAINTENANCE'
  | 'EMERGENCY'
  | 'WELCOME'
  | 'ONBOARDING'
  | 'FEEDBACK_REQUEST'
  | 'OTHER';

export type NotificationCategory =
  | 'FINANCIAL'
  | 'SECURITY'
  | 'REGULATORY'
  | 'PROMOTIONAL'
  | 'INFORMATIONAL'
  | 'ACTION_REQUIRED'
  | 'SYSTEM';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';

export type NotificationStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'CLICKED'
  | 'DISMISSED'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface NotificationRichContent {
  imageUrl?: string;
  videoUrl?: string;
  actionButtons?: NotificationActionButton[];
  carouselItems?: NotificationCarouselItem[];
  deepLink?: string;
  webUrl?: string;
  customData?: Record<string, unknown>;
}

export interface NotificationActionButton {
  label: string;
  action: 'DEEP_LINK' | 'WEB_URL' | 'DISMISS' | 'REPLY' | 'CALL' | 'COPY';
  value: string;
  style?: 'PRIMARY' | 'SECONDARY' | 'DESTRUCTIVE';
}

export interface NotificationCarouselItem {
  title: string;
  description?: string;
  imageUrl?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationRecipient {
  userId: string;
  userType: 'CUSTOMER' | 'ADMIN';
  channels: ChannelPreference[];
  timezone: string;
  language: string;
}

export interface ChannelPreference {
  channel: Channel;
  enabled: boolean;
  priority: number;
  address?: string; // email, phone, device token
  verified: boolean;
}

export interface NotificationSummary {
  notificationId: string;
  title: string;
  body: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  channel: Channel;
  status: NotificationStatus;
  sentAt?: string;
  readAt?: string;
  isRead: boolean;
}

export interface NotificationSearchRequest extends PageRequest {
  customerId?: string;
  adminId?: string;
  notificationId?: string;
  templateId?: string;
  type?: NotificationType;
  category?: NotificationCategory;
  status?: NotificationStatus;
  channel?: Channel;
  dateFrom?: string;
  dateTo?: string;
  isRead?: boolean;
  priority?: NotificationPriority;
}

export interface NotificationSearchResponse extends PageResponse<NotificationSummary> {}

export interface NotificationTemplate extends BaseEntity {
  templateId: string;
  name: string;
  description?: string;
  category: NotificationCategory;
  type: NotificationType;
  channel: Channel;
  subject?: string; // for email
  titleTemplate: string;
  bodyTemplate: string;
  richContentTemplate?: NotificationRichContent;
  variables: TemplateVariable[];
  defaultPriority: NotificationPriority;
  defaultChannels: Channel[];
  requiresConsent: boolean;
  consentCategory?: string;
  status: EntityStatus;
  version: number;
  metadata?: Record<string, unknown>;
}

export interface TemplateVariable {
  name: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'MONEY' | 'LIST' | 'OBJECT';
  required: boolean;
  defaultValue?: unknown;
  description?: string;
  validation?: string; // regex or validation rule
}

export interface CreateNotificationRequest {
  customerId?: string;
  adminId?: string;
  templateId: string;
  variables: Record<string, unknown>;
  channel?: Channel;
  priority?: NotificationPriority;
  scheduledAt?: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}

export interface BulkNotificationRequest {
  customerIds: string[];
  templateId: string;
  variables: Record<string, unknown>;
  channel?: Channel;
  priority?: NotificationPriority;
  scheduledAt?: string;
  batchId?: string;
}

export interface BulkNotificationResponse {
  batchId: string;
  totalRecipients: number;
  queued: number;
  failed: number;
  notifications: BulkNotificationItem[];
}

export interface BulkNotificationItem {
  customerId: string;
  notificationId?: string;
  status: 'QUEUED' | 'FAILED';
  error?: string;
}

export interface NotificationPreference extends BaseEntity {
  customerId: string;
  preferences: ChannelNotificationPreference[];
  globalOptOut: boolean;
  marketingOptOut: boolean;
  promotionalOptOut: boolean;
  transactionalOptOut: boolean;
  securityOptOut: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
  quietHoursTimezone: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ChannelNotificationPreference {
  channel: Channel;
  enabled: boolean;
  categories: CategoryChannelPreference[];
}

export interface CategoryChannelPreference {
  category: NotificationCategory;
  enabled: boolean;
  priority?: NotificationPriority;
}

export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalClicked: number;
  totalFailed: number;
  deliveryRate: number;
  readRate: number;
  clickRate: number;
  byChannel: ChannelStat[];
  byType: TypeStat[];
  byCategory: CategoryStat[];
  byPriority: PriorityStat[];
  byMonth: MonthlyStat[];
  averageDeliveryTimeMs: number;
  averageReadTimeMs: number;
}

export interface ChannelStat {
  channel: Channel;
  sent: number;
  delivered: number;
  read: number;
  clicked: number;
  failed: number;
  deliveryRate: number;
  readRate: number;
  clickRate: number;
}

export interface TypeStat {
  type: NotificationType;
  sent: number;
  delivered: number;
  read: number;
  clicked: number;
  conversionRate: number;
}

export interface CategoryStat {
  category: NotificationCategory;
  sent: number;
  delivered: number;
  read: number;
  conversionRate: number;
}

export interface PriorityStat {
  priority: NotificationPriority;
  sent: number;
  delivered: number;
  read: number;
  conversionRate: number;
}

export interface MonthlyStat {
  month: string;
  sent: number;
  delivered: number;
  read: number;
  clicked: number;
  failed: number;
}
