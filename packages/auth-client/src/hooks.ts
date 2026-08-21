import { useCallback, useState } from 'react';
import type { AuthState, Customer, LoginRequest, LoginResponse, OtpVerifyRequest, OtpVerifyResponse } from '@banking360/shared-types';

const API_BASE = '/api/v1';

interface ApiErrorResponse {
  error?: {
    message?: string;
  };
}

interface OtpVerifySuccessResponse {
  data?: {
    token?: string;
    mobile?: string;
    role?: string;
  };
}

interface MeResponse {
  customer?: Customer;
}

/**
 * Authentication hook providing login, OTP verification, and session management
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    customer: null,
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (mobile: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
      try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile } as LoginRequest),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const error = (await response.json()) as ApiErrorResponse;
        throw new Error(error.error?.message || 'Failed to send OTP');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const data = (await response.json()) as LoginResponse;
      // Store mobile for OTP verification
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      sessionStorage.setItem('pending_mobile', mobile);
      
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        // Don't set isAuthenticated until OTP is verified
      }));
    } catch (err) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Login failed' 
      }));
      throw err;
    }
  }, []);

  const verifyOtp = useCallback(async (mobile: string, otp: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const response = await fetch(`${API_BASE}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp } as OtpVerifyRequest),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const error = (await response.json()) as ApiErrorResponse;
        throw new Error(error.error?.message || 'Invalid OTP');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const data = (await response.json()) as OtpVerifySuccessResponse;
      const token = data.data?.token;
      if (token) {
        // Persist the gateway-issued JWT so the shared API client can send it.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        sessionStorage.setItem('b360_token', token);
      }

      setAuthState({
        isAuthenticated: true,
        customer: null,
        isLoading: false,
        error: null,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      sessionStorage.removeItem('pending_mobile');
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'OTP verification failed'
      }));
      throw err;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
      });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      console.warn('Logout API call failed:', err);
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      sessionStorage.removeItem('b360_token');
      setAuthState({
        isAuthenticated: false,
        customer: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const response = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const data = (await response.json()) as MeResponse;
        setAuthState({
          isAuthenticated: true,
          customer: data.customer ?? null,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          customer: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (err) {
      setAuthState({
        isAuthenticated: false,
        customer: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  return {
    ...authState,
    login,
    verifyOtp,
    logout,
    refreshSession,
  };
}

/**
 * Hook for getting current customer info
 */
export function useCustomer(): Customer | null {
  const { customer } = useAuth();
  return customer;
}

/**
 * Hook for checking authentication status
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}