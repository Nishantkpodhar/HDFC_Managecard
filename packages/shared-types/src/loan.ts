/**
 * Loan domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, EntityStatus, Channel} from './common';
import { RequestStatus } from './common';

export interface LoanOffer extends BaseEntity {
  offerId: string;
  name: string;
  description: string;
  loanType: LoanType;
  minAmount: Money;
  maxAmount: Money;
  tenures: number[]; // months
  interestRateMin: number; // annual percentage
  interestRateMax: number; // annual percentage
  processingFeeType: 'FLAT' | 'PERCENTAGE';
  processingFeeValue: number;
  gstRate: number;
  eligibleSegments?: string[];
  eligibleProducts?: string[];
  minIncome?: Money;
  minCreditScore?: number;
  maxAge?: number;
  minAge?: number;
  employmentTypes?: string[];
  features: LoanFeature[];
  termsAndConditions?: string;
  status: EntityStatus;
  validFrom: string;
  validTo?: string;
  sortOrder: number;
  metadata?: Record<string, unknown>;
}

export type LoanType =
  | 'PERSONAL_LOAN'
  | 'HOME_LOAN'
  | 'AUTO_LOAN'
  | 'EDUCATION_LOAN'
  | 'GOLD_LOAN'
  | 'BUSINESS_LOAN'
  | 'LOAN_AGAINST_PROPERTY'
  | 'LOAN_AGAINST_SECURITIES'
  | 'CONSUMER_DURABLE_LOAN'
  | 'TWO_WHEELER_LOAN'
  | 'TRACTOR_LOAN'
  | 'COMMERCIAL_VEHICLE_LOAN'
  | 'OTHER';

export type LoanFeature =
  | 'ZERO_PROCESSING_FEE'
  | 'INSTANT_APPROVAL'
  | 'FLEXIBLE_TENURE'
  | 'PART_PREPAYMENT'
  | 'FULL_PREPAYMENT'
  | 'BALANCE_TRANSFER'
  | 'TOP_UP_LOAN'
  | 'INSURANCE_COVER'
  | 'STEP_UP_EMI'
  | 'STEP_DOWN_EMI'
  | 'EMI_HOLIDAY'
  | 'DIGITAL_PROCESS'
  | 'DOORSTEP_SERVICE'
  | 'PRE_APPROVED';

export interface LoanApplication extends BaseEntity {
  applicationId: string;
  customerId: string;
  offerId: string;
  loanType: LoanType;
  requestedAmount: Money;
  requestedTenure: number;
  purpose: LoanPurpose;
  employmentDetails: EmploymentDetails;
  incomeDetails: IncomeDetails;
  existingLoans: ExistingLoan[];
  propertyDetails?: PropertyDetails;
  vehicleDetails?: VehicleDetails;
  educationDetails?: EducationDetails;
  goldDetails?: GoldDetails;
  status: LoanApplicationStatus;
  statusReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  approvedAmount?: Money;
  approvedTenure?: number;
  approvedInterestRate?: number;
  processingFee?: Money;
  gst?: Money;
  disbursementAccountId?: string;
  disbursementMode?: DisbursementMode;
  offerValidUntil?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  documents: LoanDocument[];
  metadata?: Record<string, unknown>;
}

export type LoanPurpose =
  | 'HOME_PURCHASE'
  | 'HOME_CONSTRUCTION'
  | 'HOME_RENOVATION'
  | 'HOME_EXTENSION'
  | 'LAND_PURCHASE'
  | 'VEHICLE_PURCHASE'
  | 'EDUCATION_INDIA'
  | 'EDUCATION_ABROAD'
  | 'MEDICAL_EMERGENCY'
  | 'DEBT_CONSOLIDATION'
  | 'WEDDING'
  | 'TRAVEL'
  | 'BUSINESS_EXPANSION'
  | 'WORKING_CAPITAL'
  | 'EQUIPMENT_PURCHASE'
  | 'PERSONAL_EXPENSES'
  | 'OTHER';

export interface EmploymentDetails {
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS_OWNER' | 'PROFESSIONAL' | 'RETIRED' | 'STUDENT' | 'UNEMPLOYED' | 'OTHER';
  employerName?: string;
  employerCategory?: 'GOVERNMENT' | 'PSU' | 'MNC' | 'PRIVATE_LIMITED' | 'PARTNERSHIP' | 'PROPRIETORSHIP' | 'STARTUP' | 'OTHER';
  designation?: string;
  department?: string;
  workExperienceYears: number;
  currentEmployerYears: number;
  officeAddress?: Address;
  officialEmail?: string;
  officialPhone?: string;
}

export interface IncomeDetails {
  grossAnnualIncome: Money;
  netAnnualIncome: Money;
  monthlyIncome: Money;
  incomeSource: 'SALARY' | 'BUSINESS' | 'PROFESSIONAL_FEES' | 'RENTAL' | 'INVESTMENTS' | 'PENSION' | 'OTHER';
  otherIncomeSources?: OtherIncomeSource[];
  incomeProof?: DocumentReference[];
}

export interface OtherIncomeSource {
  source: string;
  annualAmount: Money;
  proof?: DocumentReference;
}

export interface ExistingLoan {
  lenderName: string;
  loanType: LoanType;
  outstandingAmount: Money;
  emiAmount: Money;
  remainingTenure: number;
  accountNumber?: string;
}

export interface PropertyDetails {
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND' | 'INDUSTRIAL';
  propertyAddress: Address;
  propertyValue: Money;
  ownershipType: 'SELF' | 'JOINT' | 'ANCESTRAL' | 'LEASEHOLD';
  constructionStage?: 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION' | 'PRE_LAUNCH';
  builderName?: string;
  projectName?: string;
  reraNumber?: string;
}

export interface VehicleDetails {
  vehicleType: 'CAR' | 'TWO_WHEELER' | 'COMMERCIAL_VEHICLE' | 'TRACTOR' | 'OTHER';
  make: string;
  model: string;
  variant?: string;
  yearOfManufacture: number;
  exShowroomPrice: Money;
  onRoadPrice: Money;
  registrationNumber?: string;
  dealerName?: string;
}

export interface EducationDetails {
  courseName: string;
  instituteName: string;
  instituteType: 'UNIVERSITY' | 'COLLEGE' | 'INSTITUTE' | 'OTHER';
  courseType: 'UG' | 'PG' | 'DIPLOMA' | 'CERTIFICATION' | 'DOCTORATE' | 'OTHER';
  courseDurationYears: number;
  country: string;
  totalCourseFee: Money;
  academicYear: string;
  admissionConfirmed: boolean;
}

export interface GoldDetails {
  goldWeightGrams: number;
  goldPurity: '24K' | '22K' | '18K' | 'OTHER';
  goldValue: Money;
  ornamentsDescription: string;
  valuerName?: string;
  valuationDate?: string;
}

export type LoanApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'DOCUMENTS_PENDING'
  | 'VERIFICATION_IN_PROGRESS'
  | 'APPROVED'
  | 'CONDITIONALLY_APPROVED'
  | 'OFFER_GENERATED'
  | 'OFFER_ACCEPTED'
  | 'DISBURSEMENT_PENDING'
  | 'DISBURSED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'WITHDRAWN';

export type DisbursementMode = 'ACCOUNT_CREDIT' | 'DEMAND_DRAFT' | 'CHEQUE' | 'DIRECT_TO_VENDOR' | 'ESCROW';

export interface LoanDocument {
  id: string;
  applicationId: string;
  type: DocumentType;
  documentName: string;
  fileUrl: string;
  status: 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  expiryDate?: string;
  uploadedAt: string;
}

export type DocumentType =
  | 'IDENTITY_PROOF'
  | 'ADDRESS_PROOF'
  | 'INCOME_PROOF'
  | 'BANK_STATEMENT'
  | 'EMPLOYMENT_PROOF'
  | 'PROPERTY_DOCUMENTS'
  | 'VEHICLE_DOCUMENTS'
  | 'EDUCATION_DOCUMENTS'
  | 'GOLD_VALUATION'
  | 'CREDIT_REPORT'
  | 'SIGNATURE_VERIFICATION'
  | 'PHOTOGRAPH'
  | 'OTHER';

export interface DocumentReference {
  id: string;
  type: string;
  url: string;
  verified: boolean;
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

export interface LoanAccount extends BaseEntity {
  loanId: string;
  customerId: string;
  applicationId: string;
  loanType: LoanType;
  principalAmount: Money;
  sanctionedAmount: Money;
  disbursedAmount: Money;
  outstandingPrincipal: Money;
  interestRate: number; // annual percentage
  tenure: number; // months
  emiAmount: Money;
  emiStartDate: string;
  emiEndDate: string;
  emiDay: number;
  status: LoanAccountStatus;
  disbursementDate?: string;
  firstEmiDate?: string;
  lastEmiDate?: string;
  emisPaid: number;
  emisRemaining: number;
  nextEmiDate?: string;
  nextEmiAmount?: Money;
  overdueAmount?: Money;
  overdueSince?: string;
  preclosureAllowed: boolean;
  preclosureCharges?: Money;
  partPrepaymentAllowed: boolean;
  partPrepaymentCharges?: Money;
  insurancePolicyId?: string;
  insurancePremium?: Money;
  metadata?: Record<string, unknown>;
}

export type LoanAccountStatus =
  | 'ACTIVE'
  | 'DISBURSED'
  | 'PARTIALLY_DISBURSED'
  | 'CLOSED'
  | 'PRECLOSED'
  | 'SETTLED'
  | 'NPA'
  | 'RESTRUCTURED'
  | 'DEFAULTED'
  | 'WRITTEN_OFF';

export interface LoanAccountSummary {
  loanId: string;
  customerId: string;
  loanType: LoanType;
  principalAmount: Money;
  outstandingPrincipal: Money;
  emiAmount: Money;
  tenure: number;
  status: LoanAccountStatus;
  emisPaid: number;
  emisRemaining: number;
  nextEmiDate?: string;
  overdueAmount?: Money;
}

export interface LoanAccountSearchRequest extends PageRequest {
  customerId?: string;
  loanId?: string;
  applicationId?: string;
  loanType?: LoanType;
  status?: LoanAccountStatus;
  disbursementFrom?: string;
  disbursementTo?: string;
}

export interface LoanAccountSearchResponse extends PageResponse<LoanAccountSummary> {}

export interface LoanEmi {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  principalComponent: Money;
  interestComponent: Money;
  totalAmount: Money;
  status: EmiStatus;
  paidAt?: string;
  paidAmount?: Money;
  paymentId?: string;
  lateFee?: Money;
  bounceCharges?: Money;
}

export type EmiStatus =
  | 'PENDING'
  | 'DUE'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'OVERDUE'
  | 'DEFAULTED'
  | 'WAIVED';

export interface LoanPreclosureRequest {
  loanId: string;
  customerId: string;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export interface LoanPreclosureResponse {
  loanId: string;
  status: LoanAccountStatus;
  preclosureAmount: Money;
  outstandingPrincipal: Money;
  preclosureCharges: Money;
  gst: Money;
  totalPaid: Money;
  interestSaved: Money;
  processedAt: string;
}

export interface LoanPartPrepaymentRequest {
  loanId: string;
  customerId: string;
  amount: Money;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export interface LoanPartPrepaymentResponse {
  loanId: string;
  status: LoanAccountStatus;
  prepaymentAmount: Money;
  charges: Money;
  gst: Money;
  newOutstandingPrincipal: Money;
  newEmiAmount?: Money;
  newTenure?: number;
  emiReduced: boolean;
  tenureReduced: boolean;
  processedAt: string;
}

export interface LoanEligibilityRequest {
  customerId: string;
  loanType: LoanType;
  requestedAmount: Money;
  requestedTenure?: number;
  employmentType?: string;
  annualIncome?: Money;
}

export interface LoanEligibilityResponse {
  eligible: boolean;
  reasons?: string[];
  maxEligibleAmount: Money;
  eligibleTenures: EligibleLoanTenure[];
  interestRateRange: { min: number; max: number };
  processingFee: Money;
}

export interface EligibleLoanTenure {
  tenure: number;
  interestRate: number;
  emiAmount: Money;
  totalInterest: Money;
  totalAmount: Money;
}

export interface LoanSimulationRequest {
  amount: Money;
  tenure: number;
  interestRate: number;
  processingFeeType: 'FLAT' | 'PERCENTAGE';
  processingFeeValue: number;
  gstRate: number;
}

export interface LoanSimulationResponse {
  principalAmount: Money;
  interestRate: number;
  processingFee: Money;
  gst: Money;
  emiAmount: Money;
  totalInterest: Money;
  totalAmount: Money;
  tenure: number;
  amortizationSchedule: LoanAmortizationEntry[];
}

export interface LoanAmortizationEntry {
  installmentNumber: number;
  dueDate: string;
  openingBalance: Money;
  principalComponent: Money;
  interestComponent: Money;
  totalInstallment: Money;
  closingBalance: Money;
}

export interface LoanAnalytics {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalDisbursed: Money;
  totalOutstanding: Money;
  byType: TypeStat[];
  byStatus: ApplicationStatusStat[];
  byMonth: MonthlyStat[];
  averageTicketSize: Money;
  approvalRate: number;
  disbursementRate: number;
  npaRate: number;
}

export interface TypeStat {
  loanType: LoanType;
  applications: number;
  approved: number;
  disbursed: Money;
  outstanding: Money;
}

export interface ApplicationStatusStat {
  status: LoanApplicationStatus;
  count: number;
  percentage: number;
}

export interface MonthlyStat {
  month: string;
  applications: number;
  approved: number;
  disbursed: Money;
  emisCollected: Money;
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