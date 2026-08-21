/**
 * Card domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, Channel } from './common';
import { EntityStatus } from './common';

export interface Card extends BaseEntity {
  cardId: string;
  customerId: string;
  productId: string;
  cardType: CardType;
  cardSubType: CardSubType;
  cardNetwork: CardNetwork;
  maskedNumber: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  status: CardStatus;
  statusReason?: string;
  issuedAt: string;
  activatedAt?: string;
  blockedAt?: string;
  blockedReason?: string;
  hotlistedAt?: string;
  hotlistReason?: string;
  replacedAt?: string;
  replacementReason?: string;
  replacedByCardId?: string;
  creditLimit?: Money;
  availableLimit?: Money;
  cashLimit?: Money;
  availableCashLimit?: Money;
  billingCycleDay: number;
  statementDate?: string;
  paymentDueDate?: string;
  minimumDue?: Money;
  totalDue?: Money;
  unbilledAmount?: Money;
  rewardPoints?: number;
  controls: CardControls;
  usage: CardUsage;
  metadata?: Record<string, unknown>;
}

export type CardType = 'CREDIT' | 'DEBIT' | 'PREPAID' | 'VIRTUAL' | 'PHYSICAL';

export type CardSubType =
  | 'REGULAR'
  | 'PREMIUM'
  | 'SUPER_PREMIUM'
  | 'CO_BRANDED'
  | 'CORPORATE'
  | 'STUDENT'
  | 'SECURED'
  | 'BUSINESS'
  | 'TRAVEL'
  | 'SHOPPING'
  | 'FUEL'
  | 'LIFESTYLE';

export type CardNetwork = 'VISA' | 'MASTERCARD' | 'RUPAY' | 'AMEX' | 'DINERS' | 'JCB';

export type CardStatus =
  | 'ISSUED'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLOCKED_TEMPORARY'
  | 'BLOCKED_PERMANENT'
  | 'HOTLISTED'
  | 'EXPIRED'
  | 'CLOSED'
  | 'REPLACED'
  | 'PENDING_ACTIVATION'
  | 'PENDING_DELIVERY';

export interface CardControls {
  domesticEnabled: boolean;
  internationalEnabled: boolean;
  onlineEnabled: boolean;
  contactlessEnabled: boolean;
  atmEnabled: boolean;
  posEnabled: boolean;
  ecommerceEnabled: boolean;
  atmLimit?: Money;
  posLimit?: Money;
  ecommerceLimit?: Money;
  contactlessLimit?: Money;
  dailyLimit?: Money;
  monthlyLimit?: Money;
  transactionLimit?: Money;
  allowedMerchantCategories?: string[];
  blockedMerchantCategories?: string[];
  allowedCountries?: string[];
  blockedCountries?: string[];
  velocityChecks: VelocityCheck[];
}

export interface VelocityCheck {
  type: 'TRANSACTION_COUNT' | 'AMOUNT';
  window: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  limit: number;
  action: 'ALERT' | 'BLOCK' | 'REQUIRE_MFA';
}

export interface CardUsage {
  totalTransactions: number;
  totalAmount: Money;
  lastTransactionAt?: string;
  lastTransactionAmount?: Money;
  domesticTransactionCount: number;
  domesticTransactionAmount: Money;
  internationalTransactionCount: number;
  internationalTransactionAmount: Money;
  onlineTransactionCount: number;
  onlineTransactionAmount: Money;
  atmWithdrawalCount: number;
  atmWithdrawalAmount: Money;
  posTransactionCount: number;
  posTransactionAmount: Money;
}

export interface CardSummary {
  cardId: string;
  customerId: string;
  maskedNumber: string;
  lastFour: string;
  cardType: CardType;
  cardSubType: CardSubType;
  cardNetwork: CardNetwork;
  expiryMonth: number;
  expiryYear: number;
  status: CardStatus;
  creditLimit?: Money;
  availableLimit?: Money;
  rewardPoints?: number;
}

export interface CardSearchRequest extends PageRequest {
  customerId?: string;
  cardId?: string;
  maskedNumber?: string;
  lastFour?: string;
  cardType?: CardType;
  cardNetwork?: CardNetwork;
  status?: CardStatus;
  productId?: string;
  issuedFrom?: string;
  issuedTo?: string;
  expiryFrom?: string;
  expiryTo?: string;
}

export interface CardSearchResponse extends PageResponse<CardSummary> {}

export interface CreateCardRequest {
  customerId: string;
  productId: string;
  cardType: CardType;
  cardSubType: CardSubType;
  cardNetwork: CardNetwork;
  creditLimit?: Money;
  cashLimit?: Money;
  billingCycleDay?: number;
  controls?: Partial<CardControls>;
  deliveryAddress?: Address;
  metadata?: Record<string, unknown>;
}

export interface UpdateCardRequest {
  cardSubType?: CardSubType;
  creditLimit?: Money;
  cashLimit?: Money;
  billingCycleDay?: number;
  controls?: Partial<CardControls>;
  metadata?: Record<string, unknown>;
}

export interface CardControlUpdateRequest {
  domesticEnabled?: boolean;
  internationalEnabled?: boolean;
  onlineEnabled?: boolean;
  contactlessEnabled?: boolean;
  atmEnabled?: boolean;
  posEnabled?: boolean;
  ecommerceEnabled?: boolean;
  atmLimit?: Money;
  posLimit?: Money;
  ecommerceLimit?: Money;
  contactlessLimit?: Money;
  dailyLimit?: Money;
  monthlyLimit?: Money;
  transactionLimit?: Money;
  allowedMerchantCategories?: string[];
  blockedMerchantCategories?: string[];
  allowedCountries?: string[];
  blockedCountries?: string[];
  velocityChecks?: VelocityCheck[];
}

export interface CardActionRequest {
  action: CardAction;
  reason?: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export type CardAction =
  | 'ACTIVATE'
  | 'BLOCK_TEMPORARY'
  | 'UNBLOCK'
  | 'HOTLIST'
  | 'CLOSE'
  | 'REISSUE'
  | 'REPLACE'
  | 'LIMIT_ENHANCEMENT'
  | 'LIMIT_REDUCTION'
  | 'UPGRADE'
  | 'PIN_CHANGE'
  | 'PIN_RESET';

export interface CardReissueRequest {
  reason: 'LOST' | 'STOLEN' | 'DAMAGED' | 'EXPIRY' | 'UPGRADE' | 'SECURITY_COMPROMISE' | 'OTHER';
  deliveryAddress?: Address;
  retainNumber?: boolean;
  channel: Channel;
}

export interface CardReplaceRequest {
  reason: 'LOST' | 'STOLEN' | 'DAMAGED' | 'EXPIRY' | 'UPGRADE' | 'SECURITY_COMPROMISE' | 'OTHER';
  newCardType?: CardType;
  newCardSubType?: CardSubType;
  newCardNetwork?: CardNetwork;
  deliveryAddress?: Address;
  channel: Channel;
}

export interface CardLimitEnhancementRequest {
  requestedLimit: Money;
  reason: string;
  incomeProof?: DocumentReference;
  channel: Channel;
}

export interface CardLimitEnhancementResponse {
  requestId: string;
  status: RequestStatus;
  currentLimit: Money;
  requestedLimit: Money;
  approvedLimit?: Money;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface DocumentReference {
  id: string;
  type: string;
  url: string;
  verified: boolean;
}

export interface RequestStatus {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
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

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type?: 'HOME' | 'WORK' | 'BILLING' | 'SHIPPING' | 'OTHER';
}

export interface CardStatement {
  cardId: string;
  statementId: string;
  statementDate: string;
  paymentDueDate: string;
  billingCycleStart: string;
  billingCycleEnd: string;
  previousBalance: Money;
  paymentsCredits: Money;
  purchasesDebits: Money;
  financeCharges: Money;
  lateFees: Money;
  totalDue: Money;
  minimumDue: Money;
  availableCredit: Money;
  cashLimit: Money;
  availableCash: Money;
  transactions: CardStatementTransaction[];
  rewardPointsEarned: number;
  rewardPointsRedeemed: number;
  rewardPointsBalance: number;
}

export interface CardStatementTransaction {
  id: string;
  transactionDate: string;
  postingDate: string;
  description: string;
  category: string;
  amount: Money;
  type: 'DEBIT' | 'CREDIT';
  merchantName?: string;
  merchantCategory?: string;
  referenceNumber: string;
  status: 'POSTED' | 'PENDING' | 'REVERSED' | 'REFUNDED';
}

export interface CardTransaction {
  id: string;
  cardId: string;
  customerId: string;
  transactionId: string;
  amount: Money;
  currency: string;
  transactionDate: string;
  postingDate: string;
  description: string;
  category: string;
  subCategory?: string;
  merchantName?: string;
  merchantCategory?: string;
  merchantCity?: string;
  merchantCountry?: string;
  referenceNumber: string;
  status: TransactionStatus;
  type: TransactionType;
  channel: Channel;
  isInternational: boolean;
  isContactless: boolean;
  isOnline: boolean,
  isRecurring: boolean,
  installmentInfo?: InstallmentInfo;
  rewardPoints?: number;
  cashback?: Money;
  metadata?: Record<string, unknown>;
}

export type TransactionStatus = 'AUTHORIZED' | 'PENDING' | 'SETTLED' | 'BILLED' | 'REFUNDED' | 'REVERSED' | 'FAILED' | 'DISPUTED';

export type TransactionType = 'PURCHASE' | 'ATM_WITHDRAWAL' | 'CASH_ADVANCE' | 'PAYMENT' | 'REFUND' | 'REVERSAL' | 'FEE' | 'INTEREST' | 'REWARD' | 'ADJUSTMENT' | 'BALANCE_TRANSFER';

export interface InstallmentInfo {
  planId: string;
  tenure: number;
  installmentNumber: number;
  totalInstallments: number;
  principalAmount: Money;
  interestAmount: Money;
  totalAmount: Money;
}

export interface CardReward {
  cardId: string;
  totalPoints: number;
  availablePoints: number;
  pendingPoints: number,
  expiredPoints: number,
  pointsExpiringSoon: ExpiringPoints[],
  earningRate: EarningRate[],
  redemptionHistory: RewardRedemption[],
}

export interface ExpiringPoints {
  points: number;
  expiryDate: string;
  source: string;
}

export interface EarningRate {
  category: string;
  rate: number; // points per currency unit
  multiplier?: number;
  cap?: number;
}

export interface RewardRedemption {
  id: string;
  redemptionDate: string;
  pointsRedeemed: number;
  rewardType: 'VOUCHER' | 'MERCHANDISE' | 'CASHBACK' | 'AIRLINE_MILES' | 'HOTEL_POINTS' | 'STATEMENT_CREDIT' | 'CHARITY' | 'OTHER';
  rewardName: string;
  rewardValue: Money;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}