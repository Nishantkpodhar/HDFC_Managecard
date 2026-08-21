/**
 * @banking360/frontend-events - Frontend Event Types
 * 
 * Shared event types for cross-micro-frontend communication.
 * Uses a typed event bus pattern to avoid uncontrolled global state.
 */

export interface BaseEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  source: string; // micro-frontend name
  correlationId?: string;
}

export interface EventSubscription {
  unsubscribe: () => void;
}

export type EventHandler<T = unknown> = (event: BaseEvent<T>) => void;

export interface EventBus {
  emit<T>(event: BaseEvent<T>): void;
  on<T>(eventType: string, handler: EventHandler<T>): EventSubscription;
  off(eventType: string, handler: EventHandler): void;
  once<T>(eventType: string, handler: EventHandler<T>): EventSubscription;
}

// Standard event types for cross-MF communication
export interface CardSelectedEvent extends BaseEvent<{
  cardId: string;
  cardType: 'CREDIT' | 'DEBIT';
  maskedNumber: string;
  lastFour: string;
}> {
  type: 'CARD_SELECTED';
}

export interface PaymentCompletedEvent extends BaseEvent<{
  paymentId: string;
  amount: string;
  currency: string;
  status: 'SUCCESS' | 'FAILED';
  beneficiaryName?: string;
}> {
  type: 'PAYMENT_COMPLETED';
}

export interface FeatureFlagChangedEvent extends BaseEvent<{
  flagKey: string;
  enabled: boolean;
  variant?: string;
}> {
  type: 'FEATURE_FLAG_CHANGED';
}

export interface CustomerUpdatedEvent extends BaseEvent<{
  customerId: string;
  updatedFields: string[];
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}> {
  type: 'CUSTOMER_UPDATED';
}

export interface LogoutEvent extends BaseEvent<{
  reason: 'USER_INITIATED' | 'SESSION_EXPIRED' | 'FORCED' | 'SECURITY';
  redirectTo?: string;
}> {
  type: 'LOGOUT';
}

export interface NavigationEvent extends BaseEvent<{
  from: string;
  to: string;
  params?: Record<string, string>;
}> {
  type: 'NAVIGATION';
}

export interface NotificationEvent extends BaseEvent<{
  notificationId: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  actionUrl?: string;
}> {
  type: 'NOTIFICATION';
}

export interface TransactionCreatedEvent extends BaseEvent<{
  transactionId: string;
  cardId: string;
  amount: string;
  currency: string;
  merchantName?: string;
  category?: string;
  status: 'AUTHORIZED' | 'PENDING' | 'SETTLED';
}> {
  type: 'TRANSACTION_CREATED';
}

export interface CardControlChangedEvent extends BaseEvent<{
  cardId: string;
  controlType: 'TEMPORARY_BLOCK' | 'INTERNATIONAL' | 'CONTACTLESS' | 'ONLINE' | 'ATM' | 'SPEND_LIMIT';
  enabled: boolean;
}> {
  type: 'CARD_CONTROL_CHANGED';
}

export interface EmiBookedEvent extends BaseEvent<{
  emiPlanId: string;
  cardId: string;
  transactionId: string;
  tenure: number;
  amount: string;
  currency: string;
  monthlyInstallment: string;
}> {
  type: 'EMI_BOOKED';
}

export interface LoanApplicationSubmittedEvent extends BaseEvent<{
  applicationId: string;
  loanType: string;
  amount: string;
  currency: string;
}> {
  type: 'LOAN_APPLICATION_SUBMITTED';
}

export interface FastagRechargedEvent extends BaseEvent<{
  fastagId: string;
  vehicleNumber: string;
  amount: string;
  currency: string;
  newBalance: string;
}> {
  type: 'FASTAG_RECHARGED';
}

export interface OfferClaimedEvent extends BaseEvent<{
  offerId: string;
  customerOfferId: string;
  offerTitle: string;
}> {
  type: 'OFFER_CLAIMED';
}

export interface ServiceRequestCreatedEvent extends BaseEvent<{
  requestId: string;
  requestType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}> {
  type: 'SERVICE_REQUEST_CREATED';
}

export interface ProfileUpdatedEvent extends BaseEvent<{
  customerId: string;
  updatedFields: string[];
}> {
  type: 'PROFILE_UPDATED';
}

// Union of all event types for type-safe handling
export type AppEvent =
  | CardSelectedEvent
  | PaymentCompletedEvent
  | FeatureFlagChangedEvent
  | CustomerUpdatedEvent
  | LogoutEvent
  | NavigationEvent
  | NotificationEvent
  | TransactionCreatedEvent
  | CardControlChangedEvent
  | EmiBookedEvent
  | LoanApplicationSubmittedEvent
  | FastagRechargedEvent
  | OfferClaimedEvent
  | ServiceRequestCreatedEvent
  | ProfileUpdatedEvent;