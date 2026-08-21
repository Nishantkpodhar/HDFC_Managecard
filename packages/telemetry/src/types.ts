/**
 * @banking360/telemetry - Telemetry Types
 * 
 * Shared telemetry and observability types for all micro-frontends.
 * Supports structured logging, metrics, and distributed tracing.
 */

export interface TelemetryConfig {
  serviceName: string;
  serviceVersion: string;
  environment: 'development' | 'staging' | 'production';
  sampleRate: number; // 0-1
  endpoint?: string;
  enableConsoleExport: boolean;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  serviceName: string;
  serviceVersion: string;
  traceId?: string;
  spanId?: string;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  error?: ErrorInfo;
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface ErrorInfo {
  name: string;
  message: string;
  stack?: string;
  code?: string;
}

export interface MetricData {
  name: string;
  type: MetricType;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
  unit?: string;
}

export type MetricType = 'COUNTER' | 'GAUGE' | 'HISTOGRAM' | 'SUMMARY';

export interface SpanData {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  serviceName: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  status: SpanStatus;
  tags?: Record<string, unknown>;
  logs?: SpanLog[];
}

export type SpanStatus = 'OK' | 'ERROR' | 'TIMEOUT' | 'CANCELLED';

export interface SpanLog {
  timestamp: number;
  fields: Record<string, unknown>;
}

export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  sampled: boolean;
  baggage?: Record<string, string>;
}

export interface TelemetryProvider {
  log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void;
  metric(name: string, type: MetricType, value: number, tags?: Record<string, string>): void;
  startSpan(operationName: string, parentContext?: TraceContext): Span;
  endSpan(span: Span, status?: SpanStatus): void;
  injectContext(context: TraceContext, carrier: Record<string, string>): void;
  extractContext(carrier: Record<string, string>): TraceContext | null;
}

export interface Span {
  context(): TraceContext;
  setTag(key: string, value: unknown): void;
  setAttribute(key: string, value: unknown): void;
  log(fields: Record<string, unknown>): void;
  finish(status?: SpanStatus): void;
}

// Standard telemetry event names
export const TelemetryEvents = {
  // Page/Navigation
  PAGE_VIEW: 'page_view',
  PAGE_LOAD: 'page_load',
  NAVIGATION: 'navigation',
  
  // User Actions
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  FORM_ERROR: 'form_error',
  LINK_CLICK: 'link_click',
  
  // Authentication
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  MFA_CHALLENGE: 'mfa_challenge',
  MFA_SUCCESS: 'mfa_success',
  MFA_FAILURE: 'mfa_failure',
  
  // API Calls
  API_REQUEST: 'api_request',
  API_RESPONSE: 'api_response',
  API_ERROR: 'api_error',
  
  // Business Events
  CARD_VIEWED: 'card_viewed',
  TRANSACTION_VIEWED: 'transaction_viewed',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  EMI_BOOKED: 'emi_booked',
  LOAN_APPLIED: 'loan_applied',
  FASTAG_RECHARGED: 'fastag_recharged',
  OFFER_CLAIMED: 'offer_claimed',
  REWARD_REDEEMED: 'reward_redeemed',
  
  // Errors
  FRONTEND_ERROR: 'frontend_error',
  NETWORK_ERROR: 'network_error',
  VALIDATION_ERROR: 'validation_error',
  
  // Performance
  RESOURCE_LOAD_TIME: 'resource_load_time',
  API_LATENCY: 'api_latency',
  COMPONENT_RENDER_TIME: 'component_render_time',
} as const;

export type TelemetryEventName = (typeof TelemetryEvents)[keyof typeof TelemetryEvents];