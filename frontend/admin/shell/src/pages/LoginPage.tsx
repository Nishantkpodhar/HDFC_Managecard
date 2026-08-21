import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { Card, CardContent, Button, Input } from '@banking360/design-system';
import { ShieldAlert } from 'lucide-react';
import type { AdminRole } from '@banking360/shared-types';

// Development seed credentials. In production this screen would integrate with
// OIDC + MFA and the password grant on the Identity Service. For local dev we
// authenticate through the real Identity Service (OTP channel) so a genuine
// SUPER_ADMIN JWT is issued via the API Gateway — no fake tokens.
const DEV_ADMIN_MOBILE = '9999999999';
const DEV_ADMIN_OTP = '123456';

const SUPER_ADMIN_ROLE: AdminRole = {
  id: 'role-super-admin',
  roleId: 'SUPER_ADMIN',
  name: 'Super Admin',
  description: 'Full administrative access (development seed)',
  permissions: ['*'],
  isSystem: true,
  level: 100,
  status: 'ACTIVE',
  metadata: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
};

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [mobile, setMobile] = useState(DEV_ADMIN_MOBILE);
  const [otp, setOtp] = useState(DEV_ADMIN_OTP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      // Step 1: request OTP challenge (channel=ADMIN)
      const loginRes = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, channel: 'ADMIN' }),
      });
      if (!loginRes.ok) {
        const err = await loginRes.json().catch(() => ({ error: { message: '' } })) as { error?: { message?: string } };
        throw new Error(err?.error?.message || 'Failed to initiate admin login');
      }

      // Step 2: verify OTP -> receive real JWT
      const verifyRes = await fetch('/api/v1/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, channel: 'ADMIN' }),
      });
      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({ error: { message: '' } })) as { error?: { message?: string } };
        throw new Error(err?.error?.message || 'Invalid OTP');
      }
      const verifyData = await verifyRes.json() as { data?: { token?: string; role?: string } };
      const token: string | undefined = verifyData?.data?.token;
      if (!token) {
        throw new Error('Authentication did not return a token');
      }

      // Persist the gateway-issued JWT so the shared API client can send it.
      sessionStorage.setItem('b360_admin_token', token);

      dispatch(
        loginSuccess({
          admin: {
            id: 'admin-001',
            adminId: 'admin-001',
            employeeId: 'ADM001',
            email: 'admin@banking360.com',
            emailVerified: true,
            firstName: 'System',
            lastName: 'Administrator',
            fullName: 'System Administrator',
            mobile,
            mobileVerified: true,
            status: 'ACTIVE',
            roles: [SUPER_ADMIN_ROLE],
            permissions: ['*'],
            failedLoginAttempts: 0,
            passwordChangedAt: new Date().toISOString(),
            mfaEnabled: false,
            mfaMethods: [],
            sessionTimeoutMinutes: 30,
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
          },
          accessToken: token,
          refreshToken: token,
        })
      );
      navigate('/admin/dashboard');
    } catch (err) {
      dispatch(loginFailure(err instanceof Error ? err.message : 'Admin login failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <ShieldAlert className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900">Banking360 Admin</h1>
          <p className="text-sm text-center text-gray-500 mb-6">Secure administrative console</p>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-xs text-amber-800">
            DEVELOPMENT ONLY — seed admin mobile {DEV_ADMIN_MOBILE} / OTP {DEV_ADMIN_OTP}
            (authenticated via Identity Service, channel=ADMIN)
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Admin Mobile</label>
              <Input id="mobile" type="text" value={mobile}
                onChange={(e) => setMobile(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <Input id="otp" type="text" value={otp}
                onChange={(e) => setOtp(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
