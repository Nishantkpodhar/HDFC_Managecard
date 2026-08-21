import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@banking360/design-system';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@banking360/auth-client';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

export function OtpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mobile = searchParams.get('mobile') || '9999999999';

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const otpValue = watch('otp');

  useEffect(() => {
    if (otpValue.length === 6) {
      void handleSubmit(onSubmit)();
    }
  }, [otpValue, handleSubmit]);

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await verifyOtp(mobile, data.otp);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError(null);
    try {
      await verifyOtp(mobile, '123456'); // In real app, this would call resend OTP
      setResendTimer(60);
      setCanResend(false);
      setValue('otp', '');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!e.currentTarget.value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key >= '0' && e.key <= '9') {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      setValue('otp', pastedData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <p className="text-gray-600 mt-2">
            Enter the 6-digit code sent to <strong>+91 {mobile}</strong>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                One-Time Password
              </label>
              <div className="flex gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 text-center text-2xl"
                    value={otpValue[i] || ''}
                    onChange={(e) => setValue('otp', otpValue.slice(0, i) + e.target.value + otpValue.slice(i + 1))}
                    disabled={isLoading}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading || otpValue.length !== 6}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify & Continue'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { void handleResend(); }}
                disabled={!canResend || isLoading}
                className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
              >
                {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400">
              <p>Development mode: Use OTP 123456</p>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
