/**
 * @banking360/auth-client - Authentication Client
 * 
 * This package provides shared authentication logic, state management,
 * and API integration for all micro-frontends.
 */

export * from './types';
export * from './hooks';

// Auth slice for Redux (to be implemented)
// export { authSlice, useAuth } from './store/authSlice';

// API client (to be implemented)
// export { authApi } from './api/authApi';

// Utilities (to be implemented)
// export { parseJwt, isTokenExpired, refreshTokenIfNeeded } from './utils/tokenUtils';

export const AUTH_CLIENT_VERSION = '1.0.0';
