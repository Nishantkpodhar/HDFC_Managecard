import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@banking360/design-system';
import { Lock, Mail, Smartphone, AlertCircle } from 'lucide-react';
import type { Customer, KycStatus } from '@banking360/shared-types';

export function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [otpSent, setOtpSent] = useState(false);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length !== 10) return;
    
    dispatch(loginStart());
    setOtpSent(true);
    setStep('otp');
    
    // Simulate OTP sending
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    void setTimeout(() => {}, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;
    
    dispatch(loginStart());
    
    // Simulate API call - DEVELOPMENT ONLY credentials
    // Mobile: 9999999999, OTP: 123456
    if (mobile === '9999999999' && otp === '123456') {
      const mockCustomer: Customer = {
        id: 'cust_001',
        customerId: 'CUST001',
        firstName: 'John',
        middleName: '',
        lastName: 'Doe',
        displayName: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        email: 'john.doe@banking360.com',
        mobile: '9999999999',
        pan: 'ABCDE1234F',
        kycStatus: 'VERIFIED' as KycStatus,
        kycCompletedAt: '2024-01-01T00:00:00Z',
        segment: 'PREMIUM',
        status: 'ACTIVE',
        addresses: [],
        contacts: { email: 'john.doe@banking360.com', phone: '9999999999' },
        preferredLanguage: 'en',
        timezone: 'Asia/Kolkata',
        marketingConsent: true,
        loginCount: 1,
        failedLoginAttempts: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        version: 1,
      };
      
      dispatch(loginSuccess({
        customer: mockCustomer,
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      }));
      
      navigate('/dashboard');
    } else {
      dispatch(loginFailure('Invalid OTP. Use 123456 for development.'));
    }
  };

  const handleResendOtp = () => {
    setOtpSent(false);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    void setTimeout(() => setOtpSent(true), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-blue-600">Banking360</h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Use mobile 9999999999 and OTP 123456 (DEVELOPMENT ONLY)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Enter your mobile number</CardTitle>
            <CardDescription>We&#39;ll send you a 6-digit OTP to verify your identity</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === 'mobile' ? handleMobileSubmit : handleOtpSubmit} className="space-y-6">
              {step === 'mobile' && (
                <div>
                  <label htmlFor="mobile" className="sr-only">Mobile number</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const value: string = e.target.value;
                        setMobile(value.replace(/\D/g, '').slice(0, 10));
                      }}
                      className="pl-10"
                      maxLength={10}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>
              )}
              
              {step === 'otp' && (
                <div>
                  <label htmlFor="otp" className="sr-only">OTP</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const value: string = e.target.value;
                        setOtp(value.replace(/\D/g, '').slice(0, 6));
                      }}
                      className="pl-10 text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                      autoComplete="one-time-code"
                      inputMode="numeric"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    {otpSent ? (
                      <>
                        OTP sent to <span className="font-medium">{mobile.slice(0, 6)}****</span>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="ml-2 text-blue-600 hover:text-blue-500 text-sm font-medium"
                          disabled={!otpSent}
                        >
                          Resend
                        </button>
                      </>
                    ) : (
                      'Sending OTP...'
                    )}
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                {step === 'mobile' ? 'Send OTP' : 'Verify & Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <button className="text-blue-600 hover:text-blue-500 underline" onClick={() => {}}>
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-blue-600 hover:text-blue-500 underline" onClick={() => {}}>
                  Privacy Policy
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            <strong>DEVELOPMENT MODE:</strong> Use mobile <code className="bg-gray-100 px-1 rounded">9999999999</code> and OTP <code className="bg-gray-100 px-1 rounded">123456</code>
          </p>
        </div>
      </div>
    </div>
  );
}