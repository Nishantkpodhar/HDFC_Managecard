/**
 * Offer domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, EntityStatus, Channel } from './common';

export interface Offer extends BaseEntity {
  offerId: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  category: OfferCategory;
  subCategory?: string;
  offerType: OfferType;
  partnerName?: string;
  partnerCode?: string;
  partnerLogoUrl?: string;
  images: OfferImage[];
  termsAndConditions?: string;
  eligibility: OfferEligibility;
  reward: OfferReward;
  validity: OfferValidity;
  redemption: OfferRedemption;
  limits: OfferLimits;
  targeting: OfferTargeting;
  status: EntityStatus;
  priority: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export type OfferCategory =
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
  | 'FINANCIAL_SERVICES'
  | 'INSURANCE'
  | 'INVESTMENTS'
  | 'LIFESTYLE'
  | 'SHOPPING'
  | 'OTHER';

export type OfferType =
  | 'DISCOUNT_PERCENTAGE'
  | 'DISCOUNT_FLAT'
  | 'CASHBACK_PERCENTAGE'
  | 'CASHBACK_FLAT'
  | 'REWARD_POINTS'
  | 'VOUCHER'
  | 'GIFT_CARD'
  | 'FREE_DELIVERY'
  | 'BUY_ONE_GET_ONE'
  | 'EMI_OFFER'
  | 'ZERO_COST_EMI'
  | 'COMPLIMENTARY'
  | 'UPGRADE'
  | 'LOUNGE_ACCESS'
  | 'INSURANCE_COVER'
  | 'WARRANTY_EXTENSION'
  | 'OTHER';

export interface OfferImage {
  url: string;
  type: 'BANNER' | 'THUMBNAIL' | 'DETAIL' | 'PARTNER_LOGO';
  altText?: string;
  width?: number;
  height?: number;
}

export interface OfferEligibility {
  customerSegments?: string[];
  minAge?: number;
  maxAge?: number;
  genders?: string[];
  locations?: string[];
  minIncome?: Money;
  creditScoreMin?: number;
  requiredProducts?: string[];
  excludedProducts?: string[];
  cardTypes?: string[];
  cardNetworks?: string[];
  kycStatus?: string[];
  customRules?: EligibilityRule[];
}

export interface EligibilityRule {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
  value: unknown;
}

export interface OfferReward {
  type: OfferType;
  value: number; // percentage, flat amount, or points
  maxValue?: Money; // maximum discount/cashback
  minTransactionAmount?: Money;
  rewardPoints?: number;
  voucherCode?: string;
  voucherValue?: Money;
  partnerReference?: string;
}

export interface OfferValidity {
  startDate: string;
  endDate: string;
  validDays?: string[]; // MON, TUE, etc.
  validHours?: { start: string; end: string }; // HH:mm
  timezone: string;
  earlyAccessSegments?: string[];
  earlyAccessStartDate?: string;
}

export interface OfferRedemption {
  mode: RedemptionMode;
  channel?: Channel;
  autoApply: boolean;
  requiresCode: boolean;
  code?: string;
  maxRedemptionsPerCustomer?: number;
  maxRedemptionsTotal?: number;
  redemptionUrl?: string;
  partnerRedemptionUrl?: string;
  steps?: RedemptionStep[];
}

export type RedemptionMode = 'AUTO' | 'MANUAL' | 'CODE' | 'LINK' | 'PARTNER_SITE' | 'IN_STORE';

export interface RedemptionStep {
  step: number;
  description: string;
  action?: string;
  url?: string;
}

export interface OfferLimits {
  maxRedemptionsPerCustomer: number;
  maxRedemptionsPerDay: number;
  maxRedemptionsTotal?: number;
  budgetCap?: Money;
  budgetSpent?: Money;
  inventoryCount?: number;
  inventoryReserved?: number;
}

export interface OfferTargeting {
  segments: string[];
  channels: Channel[];
  devices?: string[];
  platforms?: string[];
  geographies?: GeographyTarget[];
  behaviorTags?: string[];
  excludeSegments?: string[];
  abTestGroup?: string;
  abTestPercentage?: number;
}

export interface GeographyTarget {
  country: string;
  states?: string[];
  cities?: string[];
  pincodes?: string[];
  radiusKm?: number;
  latitude?: number;
  longitude?: number;
}

export interface OfferSummary {
  offerId: string;
  title: string;
  shortDescription: string;
  category: OfferCategory;
  offerType: OfferType;
  partnerName?: string;
  thumbnailUrl?: string;
  reward: OfferReward;
  validity: OfferValidity;
  status: EntityStatus;
  isEligible: boolean;
  eligibilityReason?: string;
  redemptionCount: number;
  maxRedemptionsPerCustomer: number;
}

export interface OfferSearchRequest extends PageRequest {
  query?: string;
  category?: OfferCategory;
  offerType?: OfferType;
  status?: EntityStatus;
  partnerCode?: string;
  customerId?: string;
  eligibleOnly?: boolean;
  validNow?: boolean;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  segment?: string;
}

export interface OfferSearchResponse extends PageResponse<OfferSummary> {}

export interface CustomerOffer extends BaseEntity {
  customerId: string;
  offerId: string;
  status: CustomerOfferStatus;
  claimedAt?: string;
  redeemedAt?: string;
  redemptionCount: number;
  lastRedeemedAt?: string;
  redemptionReference?: string;
  partnerReference?: string;
  rewardReceived?: OfferReward;
  expiresAt: string;
  metadata?: Record<string, unknown>;
}

export type CustomerOfferStatus =
  | 'AVAILABLE'
  | 'CLAIMED'
  | 'REDEEMED'
  | 'PARTIALLY_REDEEMED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'NOT_ELIGIBLE';

export interface CustomerOfferSearchRequest extends PageRequest {
  customerId: string;
  offerId?: string;
  status?: CustomerOfferStatus;
  category?: OfferCategory;
  validNow?: boolean;
  claimedFrom?: string;
  claimedTo?: string;
}

export interface CustomerOfferSearchResponse extends PageResponse<CustomerOffer> {}

export interface ClaimOfferRequest {
  customerId: string;
  offerId: string;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export interface ClaimOfferResponse {
  customerOfferId: string;
  status: CustomerOfferStatus;
  claimedAt: string;
  expiresAt: string;
  redemptionCode?: string;
  redemptionUrl?: string;
}

export interface RedeemOfferRequest {
  customerId: string;
  offerId: string;
  transactionId?: string;
  amount?: Money;
  redemptionCode?: string;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export interface RedeemOfferResponse {
  redemptionId: string;
  status: RedemptionStatus;
  reward: OfferReward;
  redeemedAt: string;
  partnerReference?: string;
}

export type RedemptionStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REVERSED'
  | 'EXPIRED'
  | 'INVALID_TRANSACTION'
  | 'ALREADY_REDEEMED'
  | 'LIMIT_EXCEEDED';

export interface OfferAnalytics {
  totalOffers: number;
  activeOffers: number;
  totalClaims: number;
  totalRedemptions: number;
  totalRedemptionValue: Money;
  byCategory: CategoryStat[];
  byType: TypeStat[];
  byStatus: StatusStat[];
  byMonth: MonthlyStat[];
  bySegment: SegmentStat[];
  conversionRate: number;
  averageRedemptionValue: Money;
}

export interface CategoryStat {
  category: OfferCategory;
  offers: number;
  claims: number;
  redemptions: number;
  redemptionValue: Money;
}

export interface TypeStat {
  offerType: OfferType;
  offers: number;
  claims: number;
  redemptions: number;
  redemptionValue: Money;
}

export interface StatusStat {
  status: EntityStatus;
  count: number;
  percentage: number;
}

export interface MonthlyStat {
  month: string;
  newOffers: number;
  claims: number;
  redemptions: number;
  redemptionValue: Money;
}

export interface SegmentStat {
  segment: string;
  offers: number;
  claims: number;
  redemptions: number;
  conversionRate: number;
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
