/**
 * Domain events for event-driven architecture
 */

import type { Money, Channel } from './common';

export interface DomainEvent<T = unknown> {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  timestamp: string;
  correlationId: string;
  causationId?: string;
  payload: T;
  metadata?: EventMetadata;
}

export interface EventMetadata {
  sourceService: string;
  sourceInstance?: string;
  userId?: string;
  userType?: 'CUSTOMER' | 'ADMIN' | 'SYSTEM';
  channel?: Channel;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  tags?: string[];
  retryCount?: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
}

// Customer Events
export interface CustomerCreatedEvent extends DomainEvent<CustomerCreatedPayload> {
  eventType: 'CustomerCreated';
  aggregateType: 'Customer';
}

export interface CustomerCreatedPayload {
  customerId: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  kycStatus: string;
  segment: string;
  source: string;
}

export interface CustomerUpdatedEvent extends DomainEvent<CustomerUpdatedPayload> {
  eventType: 'CustomerUpdated';
  aggregateType: 'Customer';
}

export interface CustomerUpdatedPayload {
  customerId: string;
  changedFields: string[];
  oldValues: Record<string, unknown>;
  newValues: Record<string, unknown>;
  updatedBy: string;
}

export interface CustomerStatusChangedEvent extends DomainEvent<CustomerStatusChangedPayload> {
  eventType: 'CustomerStatusChanged';
  aggregateType: 'Customer';
}

export interface CustomerStatusChangedPayload {
  customerId: string;
  oldStatus: string;
  newStatus: string;
  reason: string;
  changedBy: string;
}

export interface CustomerKycCompletedEvent extends DomainEvent<CustomerKycCompletedPayload> {
  eventType: 'CustomerKycCompleted';
  aggregateType: 'Customer';
}

export interface CustomerKycCompletedPayload {
  customerId: string;
  kycType: string;
  kycStatus: string;
  completedAt: string;
  documents: string[];
}

// Card Events
export interface CardCreatedEvent extends DomainEvent<CardCreatedPayload> {
  eventType: 'CardCreated';
  aggregateType: 'Card';
}

export interface CardCreatedPayload {
  cardId: string;
  customerId: string;
  cardType: string;
  cardSubType: string;
  cardNetwork: string;
  maskedNumber: string;
  expiryMonth: number;
  expiryYear: number;
  status: string;
  limit: Money;
  availableLimit: Money;
}

export interface CardActivatedEvent extends DomainEvent<CardActivatedPayload> {
  eventType: 'CardActivated';
  aggregateType: 'Card';
}

export interface CardActivatedPayload {
  cardId: string;
  customerId: string;
  activatedAt: string;
  activatedBy: string;
  channel: Channel;
}

export interface CardBlockedEvent extends DomainEvent<CardBlockedPayload> {
  eventType: 'CardBlocked';
  aggregateType: 'Card';
}

export interface CardBlockedPayload {
  cardId: string;
  customerId: string;
  blockedAt: string;
  blockedBy: string;
  reason: string;
  blockType: 'TEMPORARY' | 'PERMANENT' | 'HOTLIST';
  channel: Channel;
}

export interface CardUnblockedEvent extends DomainEvent<CardUnblockedPayload> {
  eventType: 'CardUnblocked';
  aggregateType: 'Card';
}

export interface CardUnblockedPayload {
  cardId: string;
  customerId: string;
  unblockedAt: string;
  unblockedBy: string;
  channel: Channel;
}

export interface CardHotlistedEvent extends DomainEvent<CardHotlistedPayload> {
  eventType: 'CardHotlisted';
  aggregateType: 'Card';
}

export interface CardHotlistedPayload {
  cardId: string;
  customerId: string;
  hotlistedAt: string;
  reason: 'LOST' | 'STOLEN' | 'FRAUD' | 'DAMAGED' | 'COMPROMISED' | 'OTHER';
  reportedBy: string;
  channel: Channel;
  replacementRequested: boolean;
}

export interface CardReissuedEvent extends DomainEvent<CardReissuedPayload> {
  eventType: 'CardReissued';
  aggregateType: 'Card';
}

export interface CardReissuedPayload {
  oldCardId: string;
  newCardId: string;
  customerId: string;
  reissuedAt: string;
  reason: string;
  reissueType: 'REPLACEMENT' | 'RENEWAL' | 'UPGRADE' | 'DOWNGRADE';
  channel: Channel;
}

export interface CardLimitChangedEvent extends DomainEvent<CardLimitChangedPayload> {
  eventType: 'CardLimitChanged';
  aggregateType: 'Card';
}

export interface CardLimitChangedPayload {
  cardId: string;
  customerId: string;
  oldLimit: Money;
  newLimit: Money;
  oldAvailableLimit: Money;
  newAvailableLimit: Money;
  changedAt: string;
  changedBy: string;
  reason: string;
  channel: Channel;
}

export interface CardControlChangedEvent extends DomainEvent<CardControlChangedPayload> {
  eventType: 'CardControlChanged';
  aggregateType: 'Card';
}

export interface CardControlChangedPayload {
  cardId: string;
  customerId: string;
  controlType: 'DOMESTIC' | 'INTERNATIONAL' | 'ONLINE' | 'CONTACTLESS' | 'ATM' | 'POS' | 'ECOM';
  enabled: boolean;
  changedAt: string;
  changedBy: string;
  channel: Channel;
}

export interface CardUpgradedEvent extends DomainEvent<CardUpgradedPayload> {
  eventType: 'CardUpgraded';
  aggregateType: 'Card';
}

export interface CardUpgradedPayload {
  oldCardId: string;
  newCardId: string;
  customerId: string;
  upgradedAt: string;
  oldCardType: string;
  newCardType: string;
  oldCardSubType: string;
  newCardSubType: string;
  channel: Channel;
}

// Transaction Events
export interface TransactionAuthorizedEvent extends DomainEvent<TransactionAuthorizedPayload> {
  eventType: 'TransactionAuthorized';
  aggregateType: 'Transaction';
}

export interface TransactionAuthorizedPayload {
  transactionId: string;
  customerId: string;
  cardId?: string;
  amount: Money;
  currency: string;
  merchantName?: string;
  merchantCategory?: string;
  authCode: string;
  authorizedAt: string;
  channel: Channel;
  isInternational: boolean;
}

export interface TransactionSettledEvent extends DomainEvent<TransactionSettledPayload> {
  eventType: 'TransactionSettled';
  aggregateType: 'Transaction';
}

export interface TransactionSettledPayload {
  transactionId: string;
  customerId: string;
  cardId?: string;
  amount: Money;
  currency: string;
  settledAt: string;
  settlementReference: string;
}

export interface TransactionBilledEvent extends DomainEvent<TransactionBilledPayload> {
  eventType: 'TransactionBilled';
  aggregateType: 'Transaction';
}

export interface TransactionBilledPayload {
  transactionId: string;
  customerId: string;
  cardId?: string;
  statementId: string;
  statementDate: string;
  billedAt: string;
}

export interface TransactionRefundedEvent extends DomainEvent<TransactionRefundedPayload> {
  eventType: 'TransactionRefunded';
  aggregateType: 'Transaction';
}

export interface TransactionRefundedPayload {
  transactionId: string;
  originalTransactionId: string;
  customerId: string;
  cardId?: string;
  amount: Money;
  currency: string;
  refundReason: string;
  refundedAt: string;
  refundReference: string;
  channel: Channel;
}

export interface TransactionReversedEvent extends DomainEvent<TransactionReversedPayload> {
  eventType: 'TransactionReversed';
  aggregateType: 'Transaction';
}

export interface TransactionReversedPayload {
  transactionId: string;
  customerId: string;
  cardId?: string;
  amount: Money;
  currency: string;
  reversalReason: string;
  reversedAt: string;
  reversalReference: string;
}

export interface TransactionDisputedEvent extends DomainEvent<TransactionDisputedPayload> {
  eventType: 'TransactionDisputed';
  aggregateType: 'Transaction';
}

export interface TransactionDisputedPayload {
  transactionId: string;
  customerId: string;
  cardId?: string;
  disputeId: string;
  disputeReason: string;
  disputedAt: string;
  disputedBy: string;
  amount: Money;
  currency: string;
}

// Payment Events
export interface PaymentInitiatedEvent extends DomainEvent<PaymentInitiatedPayload> {
  eventType: 'PaymentInitiated';
  aggregateType: 'Payment';
}

export interface PaymentInitiatedPayload {
  paymentId: string;
  customerId: string;
  amount: Money;
  currency: string;
  paymentMethod: string;
  paymentMode: string;
  purpose: string;
  sourceAccountId: string;
  destinationAccountId?: string;
  initiatedAt: string;
  channel: Channel;
  idempotencyKey: string;
}

export interface PaymentAuthorizedEvent extends DomainEvent<PaymentAuthorizedPayload> {
  eventType: 'PaymentAuthorized';
  aggregateType: 'Payment';
}

export interface PaymentAuthorizedPayload {
  paymentId: string;
  customerId: string;
  amount: Money;
  authorizedAt: string;
  authReference: string;
  mfaVerified: boolean;
  mfaMethod?: string;
}

export interface PaymentProcessingEvent extends DomainEvent<PaymentProcessingPayload> {
  eventType: 'PaymentProcessing';
  aggregateType: 'Payment';
}

export interface PaymentProcessingPayload {
  paymentId: string;
  customerId: string;
  processingAt: string;
  processorReference?: string;
}

export interface PaymentCompletedEvent extends DomainEvent<PaymentCompletedPayload> {
  eventType: 'PaymentCompleted';
  aggregateType: 'Payment';
}

export interface PaymentCompletedPayload {
  paymentId: string;
  customerId: string;
  amount: Money;
  currency: string;
  completedAt: string;
  settlementReference: string;
  fees?: Money;
  tax?: Money;
  netAmount?: Money;
}

export interface PaymentFailedEvent extends DomainEvent<PaymentFailedPayload> {
  eventType: 'PaymentFailed';
  aggregateType: 'Payment';
}

export interface PaymentFailedPayload {
  paymentId: string;
  customerId: string;
  amount: Money;
  currency: string;
  failedAt: string;
  failureReason: string;
  failureCode: string;
  retryAllowed: boolean;
}

export interface PaymentRefundedEvent extends DomainEvent<PaymentRefundedPayload> {
  eventType: 'PaymentRefunded';
  aggregateType: 'Payment';
}

export interface PaymentRefundedPayload {
  paymentId: string;
  originalPaymentId: string;
  customerId: string;
  amount: Money;
  currency: string;
  refundReason: string;
  refundedAt: string;
  refundReference: string;
}

export interface PaymentReversedEvent extends DomainEvent<PaymentReversedPayload> {
  eventType: 'PaymentReversed';
  aggregateType: 'Payment';
}

export interface PaymentReversedPayload {
  paymentId: string;
  customerId: string;
  amount: Money;
  currency: string;
  reversalReason: string;
  reversedAt: string;
  reversalReference: string;
}

// Ledger Events
export interface LedgerEntryPostedEvent extends DomainEvent<LedgerEntryPostedPayload> {
  eventType: 'LedgerEntryPosted';
  aggregateType: 'LedgerEntry';
}

export interface LedgerEntryPostedPayload {
  entryId: string;
  accountId: string;
  customerId: string;
  entryType: 'DEBIT' | 'CREDIT' | 'REFUND' | 'REVERSAL' | 'ADJUSTMENT' | 'FEE' | 'INTEREST' | 'PAYMENT' | 'REWARD';
  amount: Money;
  currency: string;
  balanceAfter: Money;
  referenceId: string;
  referenceType: string;
  description: string;
  postedAt: string;
  postedBy: string;
}

export interface LedgerAccountOpenedEvent extends DomainEvent<LedgerAccountOpenedPayload> {
  eventType: 'LedgerAccountOpened';
  aggregateType: 'LedgerAccount';
}

export interface LedgerAccountOpenedPayload {
  accountId: string;
  customerId: string;
  accountType: string;
  currency: string;
  openedAt: string;
  openedBy: string;
}

export interface LedgerAccountClosedEvent extends DomainEvent<LedgerAccountClosedPayload> {
  eventType: 'LedgerAccountClosed';
  aggregateType: 'LedgerAccount';
}

export interface LedgerAccountClosedPayload {
  accountId: string;
  customerId: string;
  closedAt: string;
  closedBy: string;
  finalBalance: Money;
  closureReason: string;
}

// Reward Events
export interface RewardPointsEarnedEvent extends DomainEvent<RewardPointsEarnedPayload> {
  eventType: 'RewardPointsEarned';
  aggregateType: 'RewardAccount';
}

export interface RewardPointsEarnedPayload {
  customerId: string;
  cardId?: string;
  transactionId?: string;
  points: number;
  source: string;
  sourceReference?: string;
  earnedAt: string;
  expiresAt?: string;
  description: string;
}

export interface RewardPointsRedeemedEvent extends DomainEvent<RewardPointsRedeemedPayload> {
  eventType: 'RewardPointsRedeemed';
  aggregateType: 'RewardAccount';
}

export interface RewardPointsRedeemedPayload {
  customerId: string;
  redemptionId: string;
  catalogItemId: string;
  pointsRedeemed: number;
  cashValue?: Money;
  rewardType: string;
  redeemedAt: string;
  status: string;
  deliveryDetails?: Record<string, unknown>;
}

export interface RewardPointsExpiredEvent extends DomainEvent<RewardPointsExpiredPayload> {
  eventType: 'RewardPointsExpired';
  aggregateType: 'RewardAccount';
}

export interface RewardPointsExpiredPayload {
  customerId: string;
  points: number;
  expiredAt: string;
  source: string;
  earnedAt: string;
}

export interface RewardPointsReversedEvent extends DomainEvent<RewardPointsReversedPayload> {
  eventType: 'RewardPointsReversed';
  aggregateType: 'RewardAccount';
}

export interface RewardPointsReversedPayload {
  customerId: string;
  originalTransactionId?: string;
  originalRedemptionId?: string;
  points: number;
  reversedAt: string;
  reversalReason: string;
}

export interface RewardTierChangedEvent extends DomainEvent<RewardTierChangedPayload> {
  eventType: 'RewardTierChanged';
  aggregateType: 'RewardAccount';
}

export interface RewardTierChangedPayload {
  customerId: string;
  oldTier: string;
  newTier: string;
  tierPoints: number;
  changedAt: string;
}

// EMI Events
export interface EmiBookedEvent extends DomainEvent<EmiBookedPayload> {
  eventType: 'EmiBooked';
  aggregateType: 'EmiPlan';
}

export interface EmiBookedPayload {
  planId: string;
  customerId: string;
  cardId: string;
  transactionId: string;
  principalAmount: Money;
  totalAmount: Money;
  monthlyInstallment: Money;
  tenure: number;
  interestRate: number;
  firstInstallmentDate: string;
  lastInstallmentDate: string;
  bookedAt: string;
  channel: Channel;
}

export interface EmiInstallmentPaidEvent extends DomainEvent<EmiInstallmentPaidPayload> {
  eventType: 'EmiInstallmentPaid';
  aggregateType: 'EmiPlan';
}

export interface EmiInstallmentPaidPayload {
  planId: string;
  customerId: string;
  installmentNumber: number;
  amount: Money;
  principalComponent: Money;
  interestComponent: Money;
  paidAt: string;
  paymentId: string;
  dueDate: string;
}

export interface EmiPreclosedEvent extends DomainEvent<EmiPreclosedPayload> {
  eventType: 'EmiPreclosed';
  aggregateType: 'EmiPlan';
}

export interface EmiPreclosedPayload {
  planId: string;
  customerId: string;
  preclosureAmount: Money;
  outstandingPrincipal: Money;
  preclosureCharges: Money;
  interestSaved: Money;
  preclosedAt: string;
  channel: Channel;
}

export interface EmiDefaultedEvent extends DomainEvent<EmiDefaultedPayload> {
  eventType: 'EmiDefaulted';
  aggregateType: 'EmiPlan';
}

export interface EmiDefaultedPayload {
  planId: string;
  customerId: string;
  installmentNumber: number;
  dueAmount: Money;
  overdueDays: number;
  defaultedAt: string;
  totalOverdueAmount: Money;
}

// Loan Events
export interface LoanApplicationSubmittedEvent extends DomainEvent<LoanApplicationSubmittedPayload> {
  eventType: 'LoanApplicationSubmitted';
  aggregateType: 'LoanApplication';
}

export interface LoanApplicationSubmittedPayload {
  applicationId: string;
  customerId: string;
  offerId: string;
  loanType: string;
  requestedAmount: Money;
  requestedTenure: number;
  submittedAt: string;
  channel: Channel;
}

export interface LoanApprovedEvent extends DomainEvent<LoanApprovedPayload> {
  eventType: 'LoanApproved';
  aggregateType: 'LoanApplication';
}

export interface LoanApprovedPayload {
  applicationId: string;
  customerId: string;
  loanId: string;
  approvedAmount: Money;
  approvedTenure: number;
  interestRate: number;
  processingFee: Money;
  approvedAt: string;
  validUntil: string;
}

export interface LoanRejectedEvent extends DomainEvent<LoanRejectedPayload> {
  eventType: 'LoanRejected';
  aggregateType: 'LoanApplication';
}

export interface LoanRejectedPayload {
  applicationId: string;
  customerId: string;
  rejectedAt: string;
  rejectionReason: string;
  rejectedBy: string;
}

export interface LoanDisbursedEvent extends DomainEvent<LoanDisbursedPayload> {
  eventType: 'LoanDisbursed';
  aggregateType: 'LoanAccount';
}

export interface LoanDisbursedPayload {
  loanId: string;
  customerId: string;
  applicationId: string;
  disbursedAmount: Money;
  disbursementMode: string;
  disbursementAccountId: string;
  disbursedAt: string;
  firstEmiDate: string;
}

export interface LoanEmiPaidEvent extends DomainEvent<LoanEmiPaidPayload> {
  eventType: 'LoanEmiPaid';
  aggregateType: 'LoanAccount';
}

export interface LoanEmiPaidPayload {
  loanId: string;
  customerId: string;
  installmentNumber: number;
  amount: Money;
  principalComponent: Money;
  interestComponent: Money;
  paidAt: string;
  paymentId: string;
  dueDate: string;
}

export interface LoanPreclosedEvent extends DomainEvent<LoanPreclosedPayload> {
  eventType: 'LoanPreclosed';
  aggregateType: 'LoanAccount';
}

export interface LoanPreclosedPayload {
  loanId: string;
  customerId: string;
  preclosureAmount: Money;
  outstandingPrincipal: Money;
  preclosureCharges: Money;
  interestSaved: Money;
  preclosedAt: string;
  channel: Channel;
}

export interface LoanPartPrepaidEvent extends DomainEvent<LoanPartPrepaidPayload> {
  eventType: 'LoanPartPrepaid';
  aggregateType: 'LoanAccount';
}

export interface LoanPartPrepaidPayload {
  loanId: string;
  customerId: string;
  prepaymentAmount: Money;
  charges: Money;
  newOutstandingPrincipal: Money;
  newEmiAmount?: Money;
  newTenure?: number;
  prepaidAt: string;
  channel: Channel;
}

// FASTag Events
export interface FastagIssuedEvent extends DomainEvent<FastagIssuedPayload> {
  eventType: 'FastagIssued';
  aggregateType: 'FastagAccount';
}

export interface FastagIssuedPayload {
  fastagId: string;
  customerId: string;
  vehicleNumber: string;
  vehicleClass: string;
  tagNumber: string;
  issuedAt: string;
  deliveryAddress: Record<string, unknown>;
}

export interface FastagActivatedEvent extends DomainEvent<FastagActivatedPayload> {
  eventType: 'FastagActivated';
  aggregateType: 'FastagAccount';
}

export interface FastagActivatedPayload {
  fastagId: string;
  customerId: string;
  activatedAt: string;
  kycStatus: string;
  initialBalance: Money;
}

export interface FastagRechargedEvent extends DomainEvent<FastagRechargedPayload> {
  eventType: 'FastagRecharged';
  aggregateType: 'FastagAccount';
}

export interface FastagRechargedPayload {
  fastagId: string;
  customerId: string;
  rechargeId: string;
  amount: Money;
  previousBalance: Money;
  newBalance: Money;
  paymentMethod: string;
  rechargedAt: string;
  channel: Channel;
}

export interface FastagTollDeductedEvent extends DomainEvent<FastagTollDeductedPayload> {
  eventType: 'FastagTollDeducted';
  aggregateType: 'FastagAccount';
}

export interface FastagTollDeductedPayload {
  fastagId: string;
  customerId: string;
  transactionId: string;
  plazaId: string;
  plazaName: string;
  amount: Money;
  balanceAfter: Money;
  deductedAt: string;
  vehicleClass: string;
  tripType: string;
}

export interface FastagBlockedEvent extends DomainEvent<FastagBlockedPayload> {
  eventType: 'FastagBlocked';
  aggregateType: 'FastagAccount';
}

export interface FastagBlockedPayload {
  fastagId: string;
  customerId: string;
  blockedAt: string;
  blockedBy: string;
  reason: string;
  blockType: 'TEMPORARY' | 'PERMANENT' | 'HOTLIST';
  channel: Channel;
}

export interface FastagReplacedEvent extends DomainEvent<FastagReplacedPayload> {
  eventType: 'FastagReplaced';
  aggregateType: 'FastagAccount';
}

export interface FastagReplacedPayload {
  oldFastagId: string;
  newFastagId: string;
  customerId: string;
  replacedAt: string;
  reason: string;
  replacementFee: Money;
  newTagNumber: string;
  channel: Channel;
}

// Offer Events
export interface OfferPublishedEvent extends DomainEvent<OfferPublishedPayload> {
  eventType: 'OfferPublished';
  aggregateType: 'Offer';
}

export interface OfferPublishedPayload {
  offerId: string;
  title: string;
  category: string;
  offerType: string;
  validFrom: string;
  validTo: string;
  targetSegments: string[];
  publishedAt: string;
  publishedBy: string;
}

export interface OfferClaimedEvent extends DomainEvent<OfferClaimedPayload> {
  eventType: 'OfferClaimed';
  aggregateType: 'CustomerOffer';
}

export interface OfferClaimedPayload {
  customerId: string;
  offerId: string;
  claimedAt: string;
  expiresAt: string;
  channel: Channel;
}

export interface OfferRedeemedEvent extends DomainEvent<OfferRedeemedPayload> {
  eventType: 'OfferRedeemed';
  aggregateType: 'CustomerOffer';
}

export interface OfferRedeemedPayload {
  customerId: string;
  offerId: string;
  redemptionId: string;
  transactionId?: string;
  reward: Record<string, unknown>;
  redeemedAt: string;
  partnerReference?: string;
  channel: Channel;
}

export interface OfferExpiredEvent extends DomainEvent<OfferExpiredPayload> {
  eventType: 'OfferExpired';
  aggregateType: 'Offer';
}

export interface OfferExpiredPayload {
  offerId: string;
  expiredAt: string;
  totalClaims: number;
  totalRedemptions: number;
  totalRedemptionValue: Money;
}

// Notification Events
export interface NotificationSentEvent extends DomainEvent<NotificationSentPayload> {
  eventType: 'NotificationSent';
  aggregateType: 'Notification';
}

export interface NotificationSentPayload {
  notificationId: string;
  customerId?: string;
  adminId?: string;
  templateId: string;
  channel: Channel;
  sentAt: string;
  providerReference?: string;
}

export interface NotificationDeliveredEvent extends DomainEvent<NotificationDeliveredPayload> {
  eventType: 'NotificationDelivered';
  aggregateType: 'Notification';
}

export interface NotificationDeliveredPayload {
  notificationId: string;
  deliveredAt: string;
  providerReference?: string;
}

export interface NotificationReadEvent extends DomainEvent<NotificationReadPayload> {
  eventType: 'NotificationRead';
  aggregateType: 'Notification';
}

export interface NotificationReadPayload {
  notificationId: string;
  customerId?: string;
  adminId?: string;
  readAt: string;
}

export interface NotificationFailedEvent extends DomainEvent<NotificationFailedPayload> {
  eventType: 'NotificationFailed';
  aggregateType: 'Notification';
}

export interface NotificationFailedPayload {
  notificationId: string;
  customerId?: string;
  adminId?: string;
  failedAt: string;
  failureReason: string;
  retryCount: number;
  willRetry: boolean;
}

// Configuration Events
export interface ConfigurationChangedEvent extends DomainEvent<ConfigurationChangedPayload> {
  eventType: 'ConfigurationChanged';
  aggregateType: 'Configuration';
}

export interface ConfigurationChangedPayload {
  configId: string;
  configKey: string;
  oldValue: unknown;
  newValue: unknown;
  changedAt: string;
  changedBy: string;
  serviceName: string;
  requiresRestart: boolean;
}

export interface FeatureFlagChangedEvent extends DomainEvent<FeatureFlagChangedPayload> {
  eventType: 'FeatureFlagChanged';
  aggregateType: 'FeatureFlag';
}

export interface FeatureFlagChangedPayload {
  flagId: string;
  flagKey: string;
  oldEnabled: boolean;
  newEnabled: boolean;
  changedAt: string;
  changedBy: string;
  rolloutPercentage?: number;
  targetSegments?: string[];
}

// Admin Events
export interface AdminUserCreatedEvent extends DomainEvent<AdminUserCreatedPayload> {
  eventType: 'AdminUserCreated';
  aggregateType: 'AdminUser';
}

export interface AdminUserCreatedPayload {
  adminId: string;
  employeeId: string;
  email: string;
  roles: string[];
  createdBy: string;
  createdAt: string;
}

export interface AdminRoleAssignedEvent extends DomainEvent<AdminRoleAssignedPayload> {
  eventType: 'AdminRoleAssigned';
  aggregateType: 'AdminUser';
}

export interface AdminRoleAssignedPayload {
  adminId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;
}

export interface AdminRoleRevokedEvent extends DomainEvent<AdminRoleRevokedPayload> {
  eventType: 'AdminRoleRevoked';
  aggregateType: 'AdminUser';
}

export interface AdminRoleRevokedPayload {
  adminId: string;
  roleId: string;
  revokedBy: string;
  revokedAt: string;
  reason?: string;
}

export interface AdminLoginEvent extends DomainEvent<AdminLoginPayload> {
  eventType: 'AdminLogin';
  aggregateType: 'AdminUser';
}

export interface AdminLoginPayload {
  adminId: string;
  loginAt: string;
  ipAddress: string;
  userAgent: string;
  mfaMethod?: string;
  success: boolean;
  failureReason?: string;
}

// System Events
export interface ServiceHealthChangedEvent extends DomainEvent<ServiceHealthChangedPayload> {
  eventType: 'ServiceHealthChanged';
  aggregateType: 'Service';
}

export interface ServiceHealthChangedPayload {
  serviceName: string;
  oldStatus: string;
  newStatus: string;
  changedAt: string;
  details?: Record<string, unknown>;
}

export interface DatabaseHealthChangedEvent extends DomainEvent<DatabaseHealthChangedPayload> {
  eventType: 'DatabaseHealthChanged';
  aggregateType: 'Database';
}

export interface DatabaseHealthChangedPayload {
  databaseName: string;
  oldStatus: string;
  newStatus: string;
  changedAt: string;
  connectionsActive: number;
  connectionsMax: number;
  replicationLagMs?: number;
}

export interface SystemMaintenanceStartedEvent extends DomainEvent<SystemMaintenanceStartedPayload> {
  eventType: 'SystemMaintenanceStarted';
  aggregateType: 'System';
}

export interface SystemMaintenanceStartedPayload {
  maintenanceId: string;
  description: string;
  startedAt: string;
  estimatedEndAt: string;
  affectedServices: string[];
  initiatedBy: string;
}

export interface SystemMaintenanceCompletedEvent extends DomainEvent<SystemMaintenanceCompletedPayload> {
  eventType: 'SystemMaintenanceCompleted';
  aggregateType: 'System';
}

export interface SystemMaintenanceCompletedPayload {
  maintenanceId: string;
  completedAt: string;
  completedBy: string;
  issues?: string[];
}

// Audit Event
export interface AuditLogCreatedEvent extends DomainEvent<AuditLogCreatedPayload> {
  eventType: 'AuditLogCreated';
  aggregateType: 'AuditLog';
}

export interface AuditLogCreatedPayload {
  auditId: string;
  adminId: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: string;
  timestamp: string;
}

// Type union for all events
export type AnyDomainEvent =
  | CustomerCreatedEvent
  | CustomerUpdatedEvent
  | CustomerStatusChangedEvent
  | CustomerKycCompletedEvent
  | CardCreatedEvent
  | CardActivatedEvent
  | CardBlockedEvent
  | CardUnblockedEvent
  | CardHotlistedEvent
  | CardReissuedEvent
  | CardLimitChangedEvent
  | CardControlChangedEvent
  | CardUpgradedEvent
  | TransactionAuthorizedEvent
  | TransactionSettledEvent
  | TransactionBilledEvent
  | TransactionRefundedEvent
  | TransactionReversedEvent
  | TransactionDisputedEvent
  | PaymentInitiatedEvent
  | PaymentAuthorizedEvent
  | PaymentProcessingEvent
  | PaymentCompletedEvent
  | PaymentFailedEvent
  | PaymentRefundedEvent
  | PaymentReversedEvent
  | LedgerEntryPostedEvent
  | LedgerAccountOpenedEvent
  | LedgerAccountClosedEvent
  | RewardPointsEarnedEvent
  | RewardPointsRedeemedEvent
  | RewardPointsExpiredEvent
  | RewardPointsReversedEvent
  | RewardTierChangedEvent
  | EmiBookedEvent
  | EmiInstallmentPaidEvent
  | EmiPreclosedEvent
  | EmiDefaultedEvent
  | LoanApplicationSubmittedEvent
  | LoanApprovedEvent
  | LoanRejectedEvent
  | LoanDisbursedEvent
  | LoanEmiPaidEvent
  | LoanPreclosedEvent
  | LoanPartPrepaidEvent
  | FastagIssuedEvent
  | FastagActivatedEvent
  | FastagRechargedEvent
  | FastagTollDeductedEvent
  | FastagBlockedEvent
  | FastagReplacedEvent
  | OfferPublishedEvent
  | OfferClaimedEvent
  | OfferRedeemedEvent
  | OfferExpiredEvent
  | NotificationSentEvent
  | NotificationDeliveredEvent
  | NotificationReadEvent
  | NotificationFailedEvent
  | ConfigurationChangedEvent
  | FeatureFlagChangedEvent
  | AdminUserCreatedEvent
  | AdminRoleAssignedEvent
  | AdminRoleRevokedEvent
  | AdminLoginEvent
  | ServiceHealthChangedEvent
  | DatabaseHealthChangedEvent
  | SystemMaintenanceStartedEvent
  | SystemMaintenanceCompletedEvent
  | AuditLogCreatedEvent;