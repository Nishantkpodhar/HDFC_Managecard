/**
 * Reward domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, EntityStatus} from './common';
import { Channel } from './common';

export interface RewardAccount extends BaseEntity {
  customerId: string;
  cardId?: string;
  totalPoints: number;
  availablePoints: number;
  pendingPoints: number;
  expiredPoints: number;
  lifetimePoints: number;
  tier: RewardTier;
  tierPoints: number;
  nextTierPoints?: number;
  pointsExpiringSoon: ExpiringPoints[];
  lastEarnedAt?: string;
  lastRedeemedAt?: string;
  updatedAt: string;
}

export type RewardTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'BLACK';

export interface ExpiringPoints {
  points: number;
  expiryDate: string;
  source: string;
  earnedAt: string;
}

export interface RewardTransaction extends BaseEntity {
  customerId: string;
  cardId?: string;
  transactionId?: string;
  type: RewardTransactionType;
  status: RewardTransactionStatus;
  points: number;
  description: string;
  source: RewardSource;
  sourceReference?: string;
  earnedAt?: string;
  expiresAt?: string;
  redeemedAt?: string;
  redemptionId?: string;
  reversedAt?: string;
  reversalReason?: string;
  metadata?: Record<string, unknown>;
}

export type RewardTransactionType = 'EARNED' | 'REDEEMED' | 'REVERSED' | 'EXPIRED' | 'ADJUSTED' | 'BONUS' | 'WELCOME' | 'REFERRAL' | 'MILESTONE';

export type RewardTransactionStatus = 'PENDING' | 'CONFIRMED' | 'REDEEMED' | 'EXPIRED' | 'REVERSED' | 'FAILED' | 'CANCELLED';

export type RewardSource =
  | 'TRANSACTION'
  | 'WELCOME_BONUS'
  | 'REFERRAL'
  | 'MILESTONE'
  | 'PROMOTION'
  | 'PARTNER_OFFER'
  | 'CATEGORY_BONUS'
  | 'ANNIVERSARY'
  | 'BIRTHDAY'
  | 'UPGRADE'
  | 'MANUAL_ADJUSTMENT'
  | 'SYSTEM_CORRECTION'
  | 'DISPUTE_RESOLUTION'
  | 'OTHER';

export interface RewardTransactionSummary {
  id: string;
  customerId: string;
  type: RewardTransactionType;
  status: RewardTransactionStatus;
  points: number;
  description: string;
  source: RewardSource;
  earnedAt?: string;
  expiresAt?: string;
  redeemedAt?: string;
}

export interface RewardTransactionSearchRequest extends PageRequest {
  customerId?: string;
  cardId?: string;
  type?: RewardTransactionType;
  status?: RewardTransactionStatus;
  source?: RewardSource;
  dateFrom?: string;
  dateTo?: string;
  minPoints?: number;
  maxPoints?: number;
}

export interface RewardTransactionSearchResponse extends PageResponse<RewardTransactionSummary> {}

export interface RewardCatalogItem extends BaseEntity {
  id: string;
  name: string;
  description: string;
  category: RewardCategory;
  subCategory?: string;
  imageUrl?: string;
  pointsCost: number;
  cashValue?: Money;
  rewardType: RewardCatalogType;
  partnerName?: string;
  partnerCode?: string;
  termsAndConditions?: string;
  validityDays?: number;
  stockQuantity?: number;
  maxPerCustomer?: number;
  eligibleSegments?: string[];
  eligibleTiers?: RewardTier[];
  eligibleCards?: string[];
  tags?: string[];
  status: EntityStatus;
  sortOrder: number;
  metadata?: Record<string, unknown>;
}

export type RewardCategory =
  | 'TRAVEL'
  | 'FLIGHTS'
  | 'HOTELS'
  | 'ELECTRONICS'
  | 'APPLIANCES'
  | 'FASHION'
  | 'BEAUTY'
  | 'HOME_KITCHEN'
  | 'SPORTS_FITNESS'
  | 'BOOKS_MEDIA'
  | 'GROCERIES'
  | 'DINING'
  | 'ENTERTAINMENT'
  | 'HEALTH_WELLNESS'
  | 'EDUCATION'
  | 'GIFT_CARDS'
  | 'VOUCHERS'
  | 'CASHBACK'
  | 'STATEMENT_CREDIT'
  | 'AIRLINE_MILES'
  | 'HOTEL_POINTS'
  | 'CHARITY'
  | 'INSURANCE'
  | 'INVESTMENTS'
  | 'OTHER';

export type RewardCatalogType =
  | 'MERCHANDISE'
  | 'VOUCHER'
  | 'GIFT_CARD'
  | 'CASHBACK'
  | 'STATEMENT_CREDIT'
  | 'AIRLINE_MILES'
  | 'HOTEL_POINTS'
  | 'PARTNER_POINTS'
  | 'CHARITY'
  | 'EXPERIENCE'
  | 'SUBSCRIPTION'
  | 'INSURANCE_PREMIUM'
  | 'LOAN_EMI'
  | 'OTHER';

export interface RewardRedemption extends BaseEntity {
  customerId: string;
  catalogItemId: string;
  catalogItemName: string;
  catalogItemCategory: RewardCategory;
  pointsRedeemed: number;
  cashValue?: Money;
  rewardType: RewardCatalogType;
  status: RedemptionStatus;
  redemptionReference?: string;
  deliveryDetails?: DeliveryDetails;
  voucherDetails?: VoucherDetails;
  statementCreditDetails?: StatementCreditDetails;
  partnerReference?: string;
  partnerName?: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  failedAt?: string;
  failureReason?: string;
  expiresAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export type RedemptionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface DeliveryDetails {
  address: Address;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  deliveryStatus?: 'PENDING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED';
}

export interface VoucherDetails {
  voucherCode: string;
  voucherCodeMasked: string;
  pin?: string;
  pinMasked?: string;
  expiryDate: string;
  termsUrl?: string;
  redeemUrl?: string;
  isDigital: boolean;
}

export interface StatementCreditDetails {
  accountId: string;
  accountNumberMasked: string;
  creditDate: string;
  referenceNumber: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type?: 'HOME' | 'WORK' | 'BILLING' | 'SHIPPING' | 'OTHER';
}

export interface RedemptionRequest {
  customerId: string;
  catalogItemId: string;
  quantity?: number;
  deliveryAddress?: Address;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface RedemptionResponse {
  redemptionId: string;
  status: RedemptionStatus;
  pointsRedeemed: number;
  estimatedCompletionAt?: string;
  voucherDetails?: VoucherDetails;
}

export interface RewardEarningRule {
  id: string;
  name: string;
  description?: string;
  category: TransactionCategory;
  merchantCategories?: string[];
  cardTypes?: string[];
  customerSegments?: string[];
  earningRate: number; // points per currency unit
  multiplier?: number;
  minTransactionAmount?: Money;
  maxPointsPerTransaction?: number;
  maxPointsPerMonth?: number;
  validFrom: string;
  validTo?: string;
  status: EntityStatus;
  priority: number;
  metadata?: Record<string, unknown>;
}

export type TransactionCategory =
  | 'FOOD_DINING'
  | 'TRAVEL'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'TRANSPORTATION'
  | 'UTILITIES'
  | 'GROCERIES'
  | 'FUEL'
  | 'FINANCIAL_SERVICES'
  | 'INSURANCE'
  | 'INVESTMENTS'
  | 'GOVERNMENT'
  | 'CHARITY'
  | 'PERSONAL_CARE'
  | 'HOME_IMPROVEMENT'
  | 'ELECTRONICS'
  | 'FASHION'
  | 'SPORTS_FITNESS'
  | 'TRAVEL_ACCOMMODATION'
  | 'TRAVEL_FLIGHTS'
  | 'SUBSCRIPTIONS'
  | 'DIGITAL_SERVICES'
  | 'OTHER';

export interface RewardSummary {
  customerId: string;
  totalPoints: number;
  availablePoints: number;
  pendingPoints: number;
  expiredPoints: number;
  lifetimePoints: number;
  tier: RewardTier;
  tierProgress: number; // 0-100
  pointsExpiringIn30Days: number;
  pointsExpiringIn90Days: number;
  recentEarnings: RewardTransactionSummary[];
  recentRedemptions: RewardRedemption[];
  topCategories: CategoryEarning[];
}

export interface CategoryEarning {
  category: TransactionCategory;
  pointsEarned: number;
  transactionCount: number;
  percentage: number;
}

export interface RewardAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalPointsExpired: number;
  averagePointsPerCustomer: number;
  redemptionRate: number;
  byTier: TierStat[];
  byCategory: CategoryStat[];
  byMonth: MonthlyStat[];
}

export interface TierStat {
  tier: RewardTier;
  customerCount: number;
  totalPoints: number;
  averagePoints: number;
  redemptionRate: number;
}

export interface CategoryStat {
  category: RewardCategory;
  redemptions: number;
  pointsRedeemed: number;
  percentage: number;
}

export interface MonthlyStat {
  month: string;
  pointsIssued: number;
  pointsRedeemed: number;
  pointsExpired: number;
  netPoints: number;
}