/**
 * Transaction domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, Channel, EntityStatus } from './common';

export interface Transaction extends BaseEntity {
  transactionId: string;
  customerId: string;
  cardId?: string;
  accountId?: string;
  amount: Money;
  currency: string;
  transactionDate: string;
  postingDate?: string;
  valueDate?: string;
  description: string;
  category: TransactionCategory;
  subCategory?: string;
  merchantName?: string;
  merchantCategory?: string;
  merchantCity?: string;
  merchantCountry?: string;
  referenceNumber: string;
  authCode?: string;
  status: TransactionStatus;
  type: TransactionType;
  channel: Channel;
  isInternational: boolean;
  isContactless: boolean;
  isOnline: boolean;
  isRecurring: boolean;
  installmentInfo?: InstallmentInfo;
  rewardPoints?: number;
  cashback?: Money;
  fees?: Money;
  exchangeRate?: number;
  originalAmount?: Money;
  originalCurrency?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  notes?: string;
  isHidden: boolean;
  isFlagged: boolean;
  disputeStatus?: DisputeStatus;
  disputeId?: string;
}

export type TransactionStatus =
  | 'AUTHORIZED'
  | 'PENDING'
  | 'UNSETTLED'
  | 'SETTLED'
  | 'BILLED'
  | 'REFUNDED'
  | 'REVERSED'
  | 'FAILED'
  | 'DISPUTED'
  | 'PARTIALLY_REFUNDED';

export type TransactionType =
  | 'PURCHASE'
  | 'ATM_WITHDRAWAL'
  | 'CASH_ADVANCE'
  | 'PAYMENT'
  | 'REFUND'
  | 'REVERSAL'
  | 'FEE'
  | 'INTEREST'
  | 'REWARD'
  | 'ADJUSTMENT'
  | 'BALANCE_TRANSFER'
  | 'EMI'
  | 'LOAN_DISBURSEMENT'
  | 'LOAN_REPAYMENT'
  | 'FASTAG_RECHARGE'
  | 'BILL_PAYMENT'
  | 'FUND_TRANSFER'
  | 'UPI_PAYMENT'
  | 'QR_PAYMENT'
  | 'NET_BANKING'
  | 'CHEQUE_DEPOSIT'
  | 'CHEQUE_WITHDRAWAL'
  | 'DIVIDEND'
  | 'SALARY_CREDIT'
  | 'PENSION_CREDIT'
  | 'GOVERNMENT_SUBSIDY'
  | 'INSURANCE_CLAIM'
  | 'TAX_REFUND'
  | 'OTHER';

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

export interface InstallmentInfo {
  planId: string;
  tenure: number;
  installmentNumber: number;
  totalInstallments: number;
  principalAmount: Money;
  interestAmount: Money;
  totalAmount: Money;
  interestRate: number;
}

export type DisputeStatus =
  | 'RAISED'
  | 'UNDER_REVIEW'
  | 'MORE_INFO_REQUIRED'
  | 'RESOLVED_IN_FAVOR'
  | 'RESOLVED_AGAINST'
  | 'CANCELLED'
  | 'ESCALATED';

export interface TransactionSummary {
  transactionId: string;
  customerId: string;
  amount: Money;
  currency: string;
  transactionDate: string;
  description: string;
  category: TransactionCategory;
  merchantName?: string;
  status: TransactionStatus;
  type: TransactionType;
  isInternational: boolean;
  rewardPoints?: number;
}

export interface TransactionSearchRequest extends PageRequest {
  customerId?: string;
  cardId?: string;
  accountId?: string;
  transactionId?: string;
  referenceNumber?: string;
  amountMin?: Money;
  amountMax?: Money;
  dateFrom?: string;
  dateTo?: string;
  postingDateFrom?: string;
  postingDateTo?: string;
  category?: TransactionCategory;
  subCategory?: string;
  merchantName?: string;
  status?: TransactionStatus;
  type?: TransactionType;
  channel?: Channel;
  isInternational?: boolean;
  isRecurring?: boolean;
  minRewardPoints?: number;
  tags?: string[];
  isHidden?: boolean;
  isFlagged?: boolean;
  disputeStatus?: DisputeStatus;
}

export interface TransactionSearchResponse extends PageResponse<TransactionSummary> {}

export interface TransactionStats {
  totalTransactions: number;
  totalAmount: Money;
  totalCredits: Money;
  totalDebits: Money;
  byCategory: CategoryStat[];
  byChannel: ChannelStat[];
  byStatus: StatusStat[];
  byType: TypeStat[];
  byMonth: MonthlyStat[];
  averageTransaction: Money;
  largestTransaction: Money;
  smallestTransaction: Money;
}

export interface CategoryStat {
  category: TransactionCategory;
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

export interface StatusStat {
  status: TransactionStatus;
  count: number;
  amount: Money;
  percentage: number;
}

export interface TypeStat {
  type: TransactionType;
  count: number;
  amount: Money;
  percentage: number;
}

export interface MonthlyStat {
  month: string; // YYYY-MM
  count: number;
  credits: Money;
  debits: Money;
  net: Money;
}

export interface TransactionRule {
  id: string;
  customerId: string;
  name: string;
  description?: string;
  conditions: TransactionRuleCondition[];
  actions: TransactionRuleAction[];
  priority: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRuleCondition {
  field: TransactionRuleField;
  operator: TransactionRuleOperator;
  value: unknown;
}

export type TransactionRuleField =
  | 'amount'
  | 'category'
  | 'merchantName'
  | 'merchantCategory'
  | 'channel'
  | 'isInternational'
  | 'isOnline'
  | 'transactionType'
  | 'description';

export type TransactionRuleOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL'
  | 'IN'
  | 'NOT_IN'
  | 'STARTS_WITH'
  | 'ENDS_WITH'
  | 'REGEX';

export interface TransactionRuleAction {
  type: TransactionRuleActionType;
  value?: unknown;
}

export type TransactionRuleActionType =
  | 'SET_CATEGORY'
  | 'SET_SUB_CATEGORY'
  | 'SET_TAGS'
  | 'SET_NOTES'
  | 'HIDE_TRANSACTION'
  | 'FLAG_TRANSACTION'
  | 'SEND_ALERT'
  | 'CREATE_RULE';

export interface RecurringTransaction {
  id: string;
  customerId: string;
  cardId?: string;
  accountId?: string;
  name: string;
  description: string;
  amount: Money;
  currency: string;
  category: TransactionCategory;
  merchantName?: string;
  frequency: RecurrenceFrequency;
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: string;
  endDate?: string;
  nextOccurrence: string;
  lastOccurrence?: string;
  status: EntityStatus;
  channel: Channel;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';

export interface TransactionExportRequest {
  customerId: string;
  format: 'CSV' | 'PDF' | 'EXCEL' | 'JSON';
  dateFrom: string;
  dateTo: string;
  includePending: boolean;
  includeHidden: boolean;
  includeFlagged: boolean;
  categories?: TransactionCategory[];
  accounts?: string[];
  cards?: string[];
}

export interface TransactionExportResponse {
  exportId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  downloadUrl?: string;
  expiresAt?: string;
  errorMessage?: string;
}