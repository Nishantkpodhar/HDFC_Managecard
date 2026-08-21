/**
 * Profile domain types
 */

import type { BaseEntity, Money, Channel } from './common';
import { PageRequest, PageResponse, EntityStatus } from './common';

export interface CustomerProfile extends BaseEntity {
  customerId: string;
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  addressInfo: AddressInfo;
  employmentInfo?: EmploymentInfo;
  financialInfo?: FinancialInfo;
  kycInfo: KycInfo;
  preferences: ProfilePreferences;
  documents: ProfileDocument[];
  metadata?: Record<string, unknown>;
}

export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'OTHER';
  nationality: string;
  panNumber?: string;
  panNumberMasked?: string;
  aadhaarNumber?: string;
  aadhaarNumberMasked?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  voterIdNumber?: string;
  motherName?: string;
  fatherName?: string;
  spouseName?: string;
}

export interface ContactInfo {
  email: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  mobile: string;
  mobileVerified: boolean;
  mobileVerifiedAt?: string;
  alternateEmail?: string;
  alternateMobile?: string;
  communicationPreference: 'EMAIL' | 'SMS' | 'BOTH' | 'APP_PUSH';
  doNotDisturb: boolean;
  dndStartTime?: string;
  dndEndTime?: string;
}

export interface AddressInfo {
  residential: Address;
  mailing?: Address;
  permanent?: Address;
  office?: Address;
}

export interface Address {
  line1: string;
  line2?: string;
  line3?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: 'RESIDENTIAL' | 'MAILING' | 'PERMANENT' | 'OFFICE' | 'OTHER';
  landmark?: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  verifiedAt?: string;
  proofDocumentId?: string;
}

export interface EmploymentInfo {
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS_OWNER' | 'PROFESSIONAL' | 'RETIRED' | 'STUDENT' | 'HOUSEWIFE' | 'UNEMPLOYED' | 'OTHER';
  employerName?: string;
  employerCategory?: 'GOVERNMENT' | 'PSU' | 'MNC' | 'PRIVATE_LIMITED' | 'PARTNERSHIP' | 'PROPRIETORSHIP' | 'STARTUP' | 'OTHER';
  designation?: string;
  department?: string;
  industry?: string;
  workExperienceYears: number;
  currentEmployerYears: number;
  officeAddress?: Address;
  officialEmail?: string;
  officialPhone?: string;
  annualIncome?: Money;
  incomeFrequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'IRREGULAR';
  incomeSource?: string;
}

export interface FinancialInfo {
  netWorth?: Money;
  annualIncome?: Money;
  monthlyIncome?: Money;
  monthlyExpenses?: Money;
  existingLoans?: ExistingLoan[];
  investments?: Investment[];
  insurancePolicies?: InsurancePolicy[];
  taxResidency?: TaxResidency[];
  fatcaCrsDeclaration?: FatcaCrsDeclaration;
}

export interface ExistingLoan {
  lenderName: string;
  loanType: string;
  outstandingAmount: Money;
  emiAmount: Money;
  remainingTenure: number;
  accountNumber?: string;
}

export interface Investment {
  type: 'MUTUAL_FUND' | 'STOCKS' | 'BONDS' | 'FD' | 'RD' | 'PPF' | 'NPS' | 'INSURANCE' | 'REAL_ESTATE' | 'GOLD' | 'OTHER';
  name: string;
  currentValue: Money;
  investedAmount: Money;
  returns?: Money;
}

export interface InsurancePolicy {
  policyNumber: string;
  provider: string;
  type: 'LIFE' | 'HEALTH' | 'VEHICLE' | 'HOME' | 'TRAVEL' | 'TERM' | 'ENDOWMENT' | 'ULIP' | 'OTHER';
  sumAssured: Money;
  premium: Money;
  premiumFrequency: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUALLY';
  startDate: string;
  endDate?: string;
  nominees?: Nominee[];
}

export interface Nominee {
  name: string;
  relationship: string;
  dateOfBirth?: string;
  sharePercentage: number;
  contactDetails?: string;
}

export interface TaxResidency {
  country: string;
  taxIdNumber: string;
  taxIdType: string;
}

export interface FatcaCrsDeclaration {
  isUSPerson: boolean;
  usTin?: string;
  countryOfBirth?: string;
  countryOfCitizenship?: string[];
  declarationDate: string;
  declarationVersion: string;
}

export interface KycInfo {
  status: KycStatus;
  kycType: 'FULL' | 'MINIMUM' | 'OTP_BASED' | 'VIDEO_KYC' | 'IN_PERSON' | 'CKYC';
  completedAt?: string;
  expiresAt?: string;
  ckycNumber?: string;
  ckycStatus?: 'VALID' | 'INVALID' | 'EXPIRED' | 'NOT_FOUND';
  documents: KycDocument[];
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
  lastReviewedAt?: string;
  nextReviewDue?: string;
}

export type KycStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'PENDING_REVIEW';

export interface KycDocument {
  id: string;
  type: KycDocumentType;
  documentNumber: string;
  documentNumberMasked: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  fileUrl: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export type KycDocumentType =
  | 'PAN_CARD'
  | 'AADHAAR_CARD'
  | 'PASSPORT'
  | 'DRIVING_LICENSE'
  | 'VOTER_ID'
  | 'NREGA_JOB_CARD'
  | 'UTILITY_BILL'
  | 'BANK_STATEMENT'
  | 'RENT_AGREEMENT'
  | 'PROPERTY_DOCUMENT'
  | 'OTHER';

export interface ProfilePreferences {
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  numberFormat: string;
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  security: SecurityPreferences;
  accessibility: AccessibilityPreferences;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  callEnabled: boolean;
  transactionAlerts: boolean;
  paymentAlerts: boolean;
  securityAlerts: boolean;
  billReminders: boolean;
  emiReminders: boolean;
  promotionalOffers: boolean;
  productUpdates: boolean;
  newsletter: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONTACTS_ONLY';
  shareDataWithPartners: boolean;
  personalizedOffers: boolean;
  analyticsTracking: boolean;
  marketingCommunications: boolean;
}

export interface SecurityPreferences {
  loginAlerts: boolean;
  deviceManagement: boolean;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  autoLogoutMinutes: number;
  trustedDevicesOnly: boolean;
}

export interface AccessibilityPreferences {
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  colorBlindMode: 'NONE' | 'PROTANOPIA' | 'DEUTERANOPIA' | 'TRITANOPIA';
}

export interface ProfileDocument {
  id: string;
  type: ProfileDocumentType;
  name: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  expiresAt?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING';
}

export type ProfileDocumentType =
  | 'IDENTITY_PROOF'
  | 'ADDRESS_PROOF'
  | 'INCOME_PROOF'
  | 'BANK_STATEMENT'
  | 'EMPLOYMENT_PROOF'
  | 'PHOTOGRAPH'
  | 'SIGNATURE'
  | 'PAN_CARD'
  | 'AADHAAR_CARD'
  | 'PASSPORT'
  | 'DRIVING_LICENSE'
  | 'VOTER_ID'
  | 'FORM_16'
  | 'ITR'
  | 'SALARY_SLIP'
  | 'OTHER';

export interface ProfileUpdateRequest {
  customerId: string;
  personalInfo?: Partial<PersonalInfo>;
  contactInfo?: Partial<ContactInfo>;
  addressInfo?: Partial<AddressInfo>;
  employmentInfo?: Partial<EmploymentInfo>;
  preferences?: Partial<ProfilePreferences>;
  metadata?: Record<string, unknown>;
}

export interface ProfileUpdateResponse {
  customerId: string;
  updatedFields: string[];
  pendingVerifications: PendingVerification[];
  updatedAt: string;
}

export interface PendingVerification {
  field: string;
  type: 'EMAIL' | 'MOBILE' | 'ADDRESS' | 'IDENTITY' | 'INCOME' | 'OTHER';
  status: 'PENDING' | 'SENT' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
  initiatedAt: string;
  expiresAt?: string;
}

export interface AddressChangeRequest {
  customerId: string;
  addressType: 'RESIDENTIAL' | 'MAILING' | 'PERMANENT' | 'OFFICE';
  newAddress: Address;
  proofDocumentId?: string;
  effectiveDate?: string;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export interface AddressChangeResponse {
  requestId: string;
  status: 'SUBMITTED' | 'VERIFICATION_PENDING' | 'APPROVED' | 'REJECTED' | 'VERIFIED';
  estimatedCompletionDate?: string;
}

export interface ProfileAnalytics {
  totalCustomers: number;
  kycCompleted: number;
  kycPending: number;
  emailVerified: number;
  mobileVerified: number;
  profilesComplete: number;
  byEmploymentType: EmploymentStat[];
  byAgeGroup: AgeGroupStat[];
  byCity: CityStat[];
  byState: StateStat[];
  byKycStatus: KycStatusStat[];
  byRiskCategory: RiskCategoryStat[];
}

export interface EmploymentStat {
  employmentType: string;
  count: number;
  percentage: number;
}

export interface AgeGroupStat {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface CityStat {
  city: string;
  count: number;
  percentage: number;
}

export interface StateStat {
  state: string;
  count: number;
  percentage: number;
}

export interface KycStatusStat {
  status: KycStatus;
  count: number;
  percentage: number;
}

export interface RiskCategoryStat {
  riskCategory: string;
  count: number;
  percentage: number;
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