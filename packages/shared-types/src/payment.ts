/**
 * Payment domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, Channel, EntityStatus} from './common';
import { RequestStatus } from './common';

export interface Payment extends BaseEntity {
  paymentId: string;
  customerId: string;
  idempotencyKey: string;
  amount: Money;
  currency: string;
  sourceAccountId: string;
  sourceAccountType: AccountType;
  destinationAccountId?: string;
  destinationAccountType?: AccountType;
  destinationName?: string;
  destinationAccountNumber?: string;
  destinationIfsc?: string;
  destinationVpa?: string;
  paymentMethod: PaymentMethod;
  paymentMode: PaymentMode;
  purpose: PaymentPurpose;
  description?: string;
  referenceNumber: string;
  status: PaymentStatus;
  statusReason?: string;
  initiatedAt: string;
  processedAt?: string;
  completedAt?: string;
  failedAt?: string;
  failureReason?: string;
  failureCode?: string;
  fees?: Money;
  tax?: Money;
  netAmount?: Money;
  exchangeRate?: number;
  originalAmount?: Money;
  originalCurrency?: string;
  beneficiary?: Beneficiary;
  riskScore?: number;
  riskFactors?: string[];
  mfaVerified: boolean;
  mfaMethod?: MfaMethod;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
  metadata?: Record<string, unknown>;
  relatedPayments?: string[]; // For split payments, refunds, etc.
  parentPaymentId?: string; // For partial payments, refunds
}

export type AccountType =
  | 'SAVINGS'
  | 'CURRENT'
  | 'CREDIT_CARD'
  | 'LOAN'
  | 'OVERDRAFT'
  | 'FASTAG'
  | 'WALLET'
  | 'UPI'
  | 'EXTERNAL_BANK'
  | 'CARD_NETWORK'
  | 'OTHER';

export type PaymentMethod =
  | 'IMPS'
  | 'NEFT'
  | 'RTGS'
  | 'UPI'
  | 'CARD'
  | 'NET_BANKING'
  | 'WALLET'
  | 'FASTAG'
  | 'AUTO_DEBIT'
  | 'STANDING_INSTRUCTION'
  | 'CHEQUE'
  | 'DD'
  | 'CASH_DEPOSIT'
  | 'INTERNAL_TRANSFER'
  | 'EMI'
  | 'LOAN_DISBURSEMENT'
  | 'REWARD_REDEMPTION'
  | 'CASHBACK'
  | 'REFUND'
  | 'REVERSAL'
  | 'ADJUSTMENT'
  | 'OTHER';

export type PaymentMode =
  | 'PUSH'      // Customer initiates
  | 'PULL'      // Merchant/biller initiates
  | 'SCHEDULED' // Recurring/scheduled
  | 'AUTO'      // Auto-debit/standing instruction
  | 'BULK'      // Bulk/corporate payments
  | 'EMERGENCY'; // Emergency/overdraft

export type PaymentPurpose =
  | 'PERSONAL_TRANSFER'
  | 'BILL_PAYMENT'
  | 'MERCHANT_PAYMENT'
  | 'CREDIT_CARD_PAYMENT'
  | 'LOAN_REPAYMENT'
  | 'EMI_PAYMENT'
  | 'INSURANCE_PREMIUM'
  | 'INVESTMENT'
  | 'TAX_PAYMENT'
  | 'GOVERNMENT_FEE'
  | 'EDUCATION_FEE'
  | 'HEALTHCARE'
  | 'TRAVEL_BOOKING'
  | 'SHOPPING'
  | 'SUBSCRIPTION'
  | 'DONATION'
  | 'SALARY_CREDIT'
  | 'PENSION_CREDIT'
  | 'SUBSIDY_CREDIT'
  | 'REFUND'
  | 'CASHBACK'
  | 'REWARD_REDEMPTION'
  | 'FASTAG_RECHARGE'
  | 'WALLET_TOPUP'
  | 'PEER_TO_PEER'
  | 'VENDOR_PAYMENT'
  | 'PAYROLL'
  | 'DIVIDEND'
  | 'INTEREST_CREDIT'
  | 'OTHER';

export type PaymentStatus =
  | 'INITIATED'
  | 'PENDING_AUTHORIZATION'
  | 'AUTHORIZED'
  | 'PROCESSING'
  | 'SETTLED'
  | 'COMPLETED'
  | 'FAILED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'REVERSED'
  | 'ON_HOLD'
  | 'REQUIRES_REVIEW'
  | 'DISPUTED';

export interface PaymentSummary {
  paymentId: string;
  customerId: string;
  amount: Money;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentMode: PaymentMode;
  purpose: PaymentPurpose;
  status: PaymentStatus;
  initiatedAt: string;
  completedAt?: string;
  referenceNumber: string;
  destinationName?: string;
}

export interface PaymentSearchRequest extends PageRequest {
  customerId?: string;
  paymentId?: string;
  referenceNumber?: string;
  idempotencyKey?: string;
  amountMin?: Money;
  amountMax?: Money;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: PaymentMethod;
  paymentMode?: PaymentMode;
  purpose?: PaymentPurpose;
  status?: PaymentStatus;
  sourceAccountId?: string;
  destinationAccountId?: string;
  channel?: Channel;
  mfaVerified?: boolean;
}

export interface PaymentSearchResponse extends PageResponse<PaymentSummary> {}

export interface CreatePaymentRequest {
  customerId: string;
  idempotencyKey: string;
  amount: Money;
  sourceAccountId: string;
  sourceAccountType: AccountType;
  destinationAccountId?: string;
  destinationAccountType?: AccountType;
  destinationName?: string;
  destinationAccountNumber?: string;
  destinationIfsc?: string;
  destinationVpa?: string;
  paymentMethod: PaymentMethod;
  paymentMode: PaymentMode;
  purpose: PaymentPurpose;
  description?: string;
  beneficiaryId?: string;
  scheduleAt?: string; // For scheduled payments
  recurringConfig?: RecurringPaymentConfig;
  metadata?: Record<string, unknown>;
}

export interface RecurringPaymentConfig {
  frequency: RecurrenceFrequency;
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: string;
  endDate?: string;
  maxOccurrences?: number;
  amount?: Money; // If different from first payment
}

export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface PaymentResponse {
  paymentId: string;
  status: PaymentStatus;
  referenceNumber: string;
  initiatedAt: string;
  estimatedCompletionAt?: string;
  requiresMfa: boolean;
  mfaMethods?: MfaMethod[];
  mfaChallengeId?: string;
  authUrl?: string; // For redirect-based payments (UPI, net banking)
}

export interface MfaChallenge {
  challengeId: string;
  paymentId: string;
  method: MfaMethod;
  challengeData: Record<string, unknown>;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
}

export type MfaMethod = 'OTP_SMS' | 'OTP_EMAIL' | 'AUTHENTICATOR_APP' | 'BIOMETRIC' | 'HARDWARE_TOKEN' | 'DEVICE_AUTH';

export interface MfaVerificationRequest {
  challengeId: string;
  code: string;
  deviceInfo?: DeviceInfo;
}

export interface MfaVerificationResponse {
  verified: boolean;
  paymentStatus?: PaymentStatus;
  nextChallenge?: MfaChallenge;
}

export interface Beneficiary {
  id: string;
  customerId: string;
  name: string;
  accountNumber: string;
  accountNumberMasked: string;
  ifsc?: string;
  bankName?: string;
  branchName?: string;
  accountType: AccountType;
  vpa?: string;
  vpaMasked?: string;
  type: BeneficiaryType;
  nickname?: string,
  isVerified: boolean,
  verifiedAt?: string,
  addedAt: string,
  lastUsedAt?: string,
  usageCount: number,
  isFavorite: boolean,
  metadata?: Record<string, unknown>;
}

export type BeneficiaryType = 'IMPS' | 'NEFT' | 'RTGS' | 'UPI' | 'CARD' | 'WALLET' | 'FASTAG' | 'INTERNAL' | 'OTHER';

export interface AddBeneficiaryRequest {
  name: string;
  accountNumber: string;
  ifsc?: string;
  vpa?: string;
  type: BeneficiaryType;
  nickname?: string;
  isFavorite?: boolean;
}

export interface BeneficiaryVerificationRequest {
  beneficiaryId: string;
  verificationMethod: 'PENNY_DROP' | 'OTP' | 'MANUAL';
  pennyDropAmount?: Money;
}

export interface BeneficiaryVerificationResponse {
  verified: boolean;
  verificationId: string;
  accountHolderName?: string;
  mismatchReason?: string;
}

export interface PaymentLimits {
  customerId: string;
  dailyLimit: Money;
  monthlyLimit: Money;
  perTransactionLimit: Money;
  upiDailyLimit: Money;
  upiPerTransactionLimit: Money;
  cardDailyLimit: Money;
  cardPerTransactionLimit: Money;
  netBankingDailyLimit: Money;
  netBankingPerTransactionLimit: Money;
  fastagDailyLimit: Money;
  fastagPerTransactionLimit: Money;
  beneficiaryDailyLimit: Money;
  beneficiaryPerTransactionLimit: Money;
  newBeneficiaryLimit: Money; // First 24 hours
  newBeneficiaryWindowHours: number;
  updatedAt: string;
  updatedBy: string;
}

export interface PaymentSchedule {
  id: string;
  customerId: string;
  name: string;
  description?: string;
  amount: Money;
  sourceAccountId: string;
  destinationId: string;
  destinationType: BeneficiaryType;
  frequency: RecurrenceFrequency;
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: string;
  endDate?: string;
  nextExecutionAt: string;
  lastExecutionAt?: string;
  executionCount: number;
  maxExecutions?: number;
  status: EntityStatus;
  failureCount: number;
  lastFailureAt?: string;
  lastFailureReason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceInfo {
  deviceId: string;
  deviceType: string;
  os: string;
  browser: string;
  appVersion?: string;
}

export interface GeoLocation {
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface PaymentAnalytics {
  totalPayments: number;
  totalAmount: Money;
  successfulPayments: number;
  successfulAmount: Money;
  failedPayments: number;
  failedAmount: Money;
  byMethod: MethodStat[];
  byPurpose: PurposeStat[];
  byStatus: StatusStat[];
  byChannel: ChannelStat[];
  byMonth: MonthlyStat[];
  averageAmount: Money;
  successRate: number;
}

export interface MethodStat {
  method: PaymentMethod;
  count: number;
  amount: Money;
  successRate: number;
}

export interface PurposeStat {
  purpose: PaymentPurpose;
  count: number;
  amount: Money;
  percentage: number;
}

export interface StatusStat {
  status: PaymentStatus;
  count: number;
  amount: Money;
  percentage: number;
}

export interface ChannelStat {
  channel: Channel;
  count: number;
  amount: Money;
  percentage: number;
}

export interface MonthlyStat {
  month: string;
  count: number;
  amount: Money;
  successRate: number;
}

export interface PaymentDispute {
  id: string;
  paymentId: string;
  customerId: string;
  reason: DisputeReason;
  description: string;
  evidence?: string[];
  status: DisputeStatus;
  raisedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  resolution?: DisputeResolution;
  resolutionAmount?: Money;
  assignedTo?: string;
  metadata?: Record<string, unknown>;
}

export type DisputeReason =
  | 'UNAUTHORIZED_TRANSACTION'
  | 'WRONG_AMOUNT'
  | 'WRONG_BENEFICIARY'
  | 'DUPLICATE_CHARGE'
  | 'GOODS_NOT_RECEIVED'
  | 'GOODS_NOT_AS_DESCRIBED'
  | 'SERVICE_NOT_RENDERED'
  | 'CANCELLED_RECURRING'
  | 'FRAUD'
  | 'TECHNICAL_ERROR'
  | 'OTHER';

export type DisputeStatus =
  | 'RAISED'
  | 'ACKNOWLEDGED'
  | 'UNDER_INVESTIGATION'
  | 'MORE_INFO_REQUIRED'
  | 'RESOLVED_IN_FAVOR'
  | 'RESOLVED_AGAINST'
  | 'ESCALATED'
  | 'CLOSED';

export type DisputeResolution =
  | 'FULL_REFUND'
  | 'PARTIAL_REFUND'
  | 'NO_REFUND'
  | 'MERCHANT_CREDIT'
  | 'GOODWILL_GESTURE';