/**
 * FASTag domain types
 */

import type { BaseEntity, Money, PageRequest, PageResponse, Channel} from './common';
import { EntityStatus, RequestStatus } from './common';

export interface FastagAccount extends BaseEntity {
  fastagId: string;
  customerId: string;
  vehicleNumber: string;
  vehicleNumberMasked: string;
  vehicleClass: VehicleClass;
  vehicleType: VehicleType;
  tagNumber: string;
  tagNumberMasked: string;
  issuerBankCode: string;
  issuerBankName: string;
  status: FastagStatus;
  statusReason?: string;
  issuedAt: string;
  activatedAt?: string;
  blockedAt?: string;
  blockedReason?: string;
  replacedAt?: string;
  replacementReason?: string;
  replacedByFastagId?: string;
  kycStatus: KycStatus;
  kycCompletedAt?: string;
  balance: Money;
  thresholdAmount: Money;
  autoRechargeEnabled: boolean;
  autoRechargeAmount?: Money;
  autoRechargeThreshold?: Money;
  linkedAccountId?: string;
  linkedAccountType?: string;
  metadata?: Record<string, unknown>;
}

export type VehicleClass =
  | 'CLASS_4'  // Car/Jeep/Van
  | 'CLASS_5'  // Light Commercial Vehicle
  | 'CLASS_6'  // Bus/Truck (2 axle)
  | 'CLASS_7'  // Bus/Truck (3 axle)
  | 'CLASS_8'  // Bus/Truck (4-6 axle)
  | 'CLASS_9'  // Heavy Commercial Vehicle (7+ axle)
  | 'CLASS_10' // Earth Moving Equipment
  | 'CLASS_11' // Tractor
  | 'CLASS_12' // Two Wheeler
  | 'CLASS_13' // Three Wheeler
  | 'OTHER';

export type VehicleType =
  | 'CAR'
  | 'JEEP'
  | 'VAN'
  | 'SUV'
  | 'LCV'
  | 'BUS'
  | 'TRUCK_2_AXLE'
  | 'TRUCK_3_AXLE'
  | 'TRUCK_4_6_AXLE'
  | 'TRUCK_7_PLUS_AXLE'
  | 'EARTH_MOVING'
  | 'TRACTOR'
  | 'TWO_WHEELER'
  | 'THREE_WHEELER'
  | 'OTHER';

export type FastagStatus =
  | 'ISSUED'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLOCKED'
  | 'HOTLISTED'
  | 'EXPIRED'
  | 'CLOSED'
  | 'REPLACED'
  | 'PENDING_ACTIVATION'
  | 'PENDING_KYC'
  | 'PENDING_DELIVERY';

export type KycStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'EXPIRED' | 'NOT_STARTED';

export interface FastagAccountSummary {
  fastagId: string;
  customerId: string;
  vehicleNumber: string;
  vehicleNumberMasked: string;
  vehicleClass: VehicleClass;
  tagNumber: string;
  tagNumberMasked: string;
  status: FastagStatus;
  balance: Money;
  thresholdAmount: Money;
  autoRechargeEnabled: boolean;
  lastRechargeAt?: string;
}

export interface FastagSearchRequest extends PageRequest {
  customerId?: string;
  fastagId?: string;
  vehicleNumber?: string;
  tagNumber?: string;
  status?: FastagStatus;
  vehicleClass?: VehicleClass;
  kycStatus?: KycStatus;
  issuedFrom?: string;
  issuedTo?: string;
}

export interface FastagSearchResponse extends PageResponse<FastagAccountSummary> {}

export interface CreateFastagRequest {
  customerId: string;
  vehicleNumber: string;
  vehicleClass: VehicleClass;
  vehicleType: VehicleType;
  vehicleDetails: VehicleDetails;
  ownerDetails: OwnerDetails;
  deliveryAddress: Address;
  linkedAccountId?: string;
  linkedAccountType?: string;
  autoRechargeEnabled?: boolean;
  autoRechargeAmount?: Money;
  autoRechargeThreshold?: Money;
  metadata?: Record<string, unknown>;
}

export interface VehicleDetails {
  registrationNumber: string;
  registrationDate: string;
  rtoCode: string;
  make: string;
  model: string;
  variant?: string;
  yearOfManufacture: number;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC' | 'HYBRID' | 'OTHER';
  chassisNumber?: string;
  engineNumber?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  pucCertificateNumber?: string;
  pucExpiryDate?: string;
  rcBookFrontUrl?: string;
  rcBookBackUrl?: string;
}

export interface OwnerDetails {
  name: string;
  mobile: string;
  email?: string;
  address: Address;
  idProofType: 'PAN' | 'AADHAAR' | 'PASSPORT' | 'DRIVING_LICENSE' | 'VOTER_ID';
  idProofNumber: string;
  idProofNumberMasked: string;
  idProofUrl?: string;
  photoUrl?: string;
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

export interface FastagRechargeRequest {
  fastagId: string;
  customerId: string;
  amount: Money;
  paymentMethod: FastagPaymentMethod;
  paymentId?: string;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export type FastagPaymentMethod =
  | 'UPI'
  | 'NET_BANKING'
  | 'CARD'
  | 'WALLET'
  | 'AUTO_DEBIT'
  | 'CASH'
  | 'OTHER';

export interface FastagRechargeResponse {
  rechargeId: string;
  fastagId: string;
  amount: Money;
  previousBalance: Money;
  newBalance: Money;
  status: RechargeStatus;
  transactionReference: string;
  rechargedAt: string;
}

export type RechargeStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED' | 'REFUNDED';

export interface FastagTransaction extends BaseEntity {
  fastagId: string;
  customerId: string;
  transactionId: string;
  plazaId: string;
  plazaName: string;
  plazaLocation: PlazaLocation;
  laneNumber?: string;
  vehicleClass: VehicleClass;
  amount: Money;
  transactionType: FastagTransactionType;
  status: FastagTransactionStatus;
  entryTime?: string;
  exitTime?: string;
  entryPlazaId?: string;
  entryPlazaName?: string;
  distanceKm?: number;
  tripType: 'SINGLE' | 'RETURN' | 'LOCAL';
  discountAmount?: Money;
  penaltyAmount?: Money;
  metadata?: Record<string, unknown>;
}

export type FastagTransactionType = 'TOLL_DEDUCTION' | 'RECHARGE' | 'REFUND' | 'PENALTY' | 'ADJUSTMENT' | 'BALANCE_TRANSFER';

export type FastagTransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REVERSED' | 'DISPUTED';

export interface PlazaLocation {
  state: string;
  district?: string;
  city?: string;
  highway?: string;
  kmMarker?: number;
  latitude?: number;
  longitude?: number;
}

export interface FastagTransactionSummary {
  transactionId: string;
  fastagId: string;
  plazaName: string;
  plazaLocation: PlazaLocation;
  amount: Money;
  transactionType: FastagTransactionType;
  status: FastagTransactionStatus;
  exitTime: string;
  tripType: 'SINGLE' | 'RETURN' | 'LOCAL';
}

export interface FastagTransactionSearchRequest extends PageRequest {
  fastagId?: string;
  customerId?: string;
  transactionId?: string;
  plazaId?: string;
  plazaName?: string;
  state?: string;
  amountMin?: Money;
  amountMax?: Money;
  dateFrom?: string;
  dateTo?: string;
  transactionType?: FastagTransactionType;
  status?: FastagTransactionStatus;
  tripType?: 'SINGLE' | 'RETURN' | 'LOCAL';
}

export interface FastagTransactionSearchResponse extends PageResponse<FastagTransactionSummary> {}

export interface FastagStatement {
  fastagId: string;
  statementId: string;
  statementDate: string;
  periodStart: string;
  periodEnd: string;
  openingBalance: Money;
  totalRecharges: Money;
  totalDeductions: Money;
  totalRefunds: Money;
  totalPenalties: Money;
  closingBalance: Money;
  transactions: FastagTransactionSummary[];
}

export interface FastagReplacementRequest {
  fastagId: string;
  customerId: string;
  reason: 'LOST' | 'STOLEN' | 'DAMAGED' | 'VEHICLE_CHANGE' | 'VEHICLE_SOLD' | 'TECHNICAL_ISSUE' | 'OTHER';
  newVehicleNumber?: string;
  newVehicleDetails?: VehicleDetails;
  deliveryAddress: Address;
  idempotencyKey: string;
  channel: Channel;
  deviceInfo?: DeviceInfo;
  location?: GeoLocation;
}

export interface FastagReplacementResponse {
  replacementId: string;
  oldFastagId: string;
  newFastagId: string;
  status: ReplacementStatus;
  newTagNumber: string;
  newTagNumberMasked: string;
  estimatedDeliveryDate?: string;
  replacementFee: Money;
}

export type ReplacementStatus = 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'ACTIVATED' | 'FAILED' | 'CANCELLED';

export interface FastagAnalytics {
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: Money;
  totalRecharges: number;
  totalRechargeAmount: Money;
  totalTransactions: number;
  totalTollCollected: Money;
  byVehicleClass: VehicleClassStat[];
  byState: StateStat[];
  byMonth: MonthlyStat[];
  averageRechargeAmount: Money;
  averageBalance: Money;
  rechargeSuccessRate: number;
}

export interface VehicleClassStat {
  vehicleClass: VehicleClass;
  count: number;
  totalBalance: Money;
  totalTransactions: number;
  totalAmount: Money;
}

export interface StateStat {
  state: string;
  transactions: number;
  amount: Money;
  plazas: number;
}

export interface MonthlyStat {
  month: string;
  newAccounts: number;
  recharges: number;
  rechargeAmount: Money;
  transactions: number;
  tollCollected: Money;
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