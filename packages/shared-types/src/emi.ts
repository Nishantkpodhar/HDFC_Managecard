/**
 * EMI domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, EntityStatus, Channel} from './common';
import { RequestStatus } from './common';

export interface EmiPlan extends BaseEntity {
  customerId: string;
  cardId: string;
  transactionId: string;
  planId: string;
  principalAmount: Money;
  interestAmount: Money;
  totalAmount: Money;
  tenure: number; // months
  interestRate: number; // annual percentage rate
  processingFee: Money;
  gst: Money;
  monthlyInstallment: Money;
  status: EmiPlanStatus;
  bookingDate: string;
  firstInstallmentDate: string;
  lastInstallmentDate: string;
  installmentsPaid: number;
  installmentsRemaining: number;
  nextInstallmentAmount?: Money;
  nextInstallmentDate?: string;
  preclosureAllowed: boolean;
  preclosureCharges?: Money;
  preclosedAt?: string;
  preclosureAmount?: Money;
  metadata?: Record<string, unknown>;
}

export type EmiPlanStatus =
  | 'BOOKED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'PRECLOSED'
  | 'DEFAULTED'
  | 'CANCELLED'
  | 'RESTRUCTURED';

export interface EmiPlanSummary {
  planId: string;
  customerId: string;
  cardId: string;
  maskedCardNumber: string;
  transactionId: string;
  principalAmount: Money;
  totalAmount: Money;
  monthlyInstallment: Money;
  tenure: number;
  status: EmiPlanStatus;
  installmentsPaid: number;
  installmentsRemaining: number;
  nextInstallmentDate?: string;
  bookingDate: string;
}

export interface EmiPlanSearchRequest extends PageRequest {
  customerId?: string;
  cardId?: string;
  transactionId?: string;
  planId?: string;
  status?: EmiPlanStatus;
  bookingDateFrom?: string;
  bookingDateTo?: string;
  tenure?: number;
}

export interface EmiPlanSearchResponse extends PageResponse<EmiPlanSummary> {}

export interface EmiEligibilityRequest {
  customerId: string;
  cardId: string;
  transactionId: string;
  amount: Money;
  tenure?: number;
}

export interface EmiEligibilityResponse {
  eligible: boolean;
  reasons?: string[];
  eligibleTenures: EligibleTenure[];
  minimumAmount: Money;
  maximumAmount: Money;
}

export interface EligibleTenure {
  tenure: number;
  interestRate: number;
  processingFee: Money;
  gst: Money;
  monthlyInstallment: Money;
  totalInterest: Money;
  totalAmount: Money;
}

export interface EmiBookingRequest {
  customerId: string;
  cardId: string;
  transactionId: string;
  tenure: number;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export interface EmiBookingResponse {
  planId: string;
  status: EmiPlanStatus;
  monthlyInstallment: Money;
  totalAmount: Money;
  firstInstallmentDate: string;
  lastInstallmentDate: string;
  bookingReference: string;
}

export interface EmiPreclosureRequest {
  planId: string;
  customerId: string;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export interface EmiPreclosureResponse {
  planId: string;
  status: EmiPlanStatus;
  preclosureAmount: Money;
  outstandingPrincipal: Money;
  preclosureCharges: Money;
  gst: Money;
  totalPaid: Money;
  interestSaved: Money;
  processedAt: string;
}

export interface EmiInstallment {
  id: string;
  planId: string;
  installmentNumber: number;
  dueDate: string;
  principalComponent: Money;
  interestComponent: Money;
  totalAmount: Money;
  status: InstallmentStatus;
  paidAt?: string;
  paidAmount?: Money;
  paymentId?: string;
  lateFee?: Money;
  bounceCharges?: Money;
}

export type InstallmentStatus =
  | 'PENDING'
  | 'DUE'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'OVERDUE'
  | 'DEFAULTED'
  | 'WAIVED';

export interface EmiConfiguration {
  id: string;
  productId?: string;
  cardType?: string;
  cardSubType?: string;
  customerSegment?: string;
  minimumAmount: Money;
  maximumAmount: Money;
  tenures: number[]; // months
  interestRates: TenureInterestRate[];
  processingFeeType: 'FLAT' | 'PERCENTAGE';
  processingFeeValue: number; // flat amount or percentage
  gstRate: number; // percentage
  preclosureAllowed: boolean;
  preclosureChargesType: 'FLAT' | 'PERCENTAGE';
  preclosureChargesValue: number;
  preclosureLockInPeriod: number; // months
  eligibleMerchantCategories?: string[];
  excludedMerchantCategories?: string[];
  status: EntityStatus;
  effectiveFrom: string;
  effectiveTo?: string;
  metadata?: Record<string, unknown>;
}

export interface TenureInterestRate {
  tenure: number;
  interestRate: number; // annual percentage
}

export interface EmiSimulationRequest {
  amount: Money;
  tenure: number;
  customerSegment?: string;
  cardType?: string;
  cardSubType?: string;
}

export interface EmiSimulationResponse {
  principalAmount: Money;
  interestRate: number;
  processingFee: Money;
  gst: Money;
  monthlyInstallment: Money;
  totalInterest: Money;
  totalAmount: Money;
  tenure: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  installmentNumber: number;
  dueDate: string;
  openingBalance: Money;
  principalComponent: Money;
  interestComponent: Money;
  totalInstallment: Money;
  closingBalance: Money;
}

export interface EmiAnalytics {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  preclosedPlans: number;
  defaultedPlans: number;
  totalPrincipalBooked: Money;
  totalInterestIncome: Money;
  totalProcessingFees: Money;
  byTenure: TenureStat[];
  byStatus: StatusStat[];
  byMonth: MonthlyStat[];
  averageTenure: number;
  averageTicketSize: Money;
  defaultRate: number;
  preclosureRate: number;
}

export interface TenureStat {
  tenure: number;
  count: number;
  totalPrincipal: Money;
  averageInterestRate: number;
}

export interface StatusStat {
  status: EmiPlanStatus;
  count: number;
  totalPrincipal: Money;
  percentage: number;
}

export interface MonthlyStat {
  month: string;
  plansBooked: number;
  principalBooked: Money;
  installmentsCollected: Money;
  preclosures: number;
  defaults: number;
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