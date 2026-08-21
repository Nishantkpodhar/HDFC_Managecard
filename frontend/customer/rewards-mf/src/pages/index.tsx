import { useCallback, useEffect, useState } from 'react';
import { useApiClient } from '@banking360/api-contracts';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from '@banking360/design-system';
import { Award, Gift, RefreshCw } from 'lucide-react';

interface RewardAccount {
  id: string;
  customerId: string;
  balance: number;
  currency: string;
}

interface RewardTxn {
  id: string;
  type: string;
  points: number;
  description?: string;
  createdAt?: string;
}

interface RewardResponse {
  account?: RewardAccount;
  transactions?: RewardTxn[];
}

function fmt(points: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(points);
  } catch {
    return `${points} ${currency || 'INR'}`;
  }
}

export default function RewardsPage() {
  const api = useApiClient();
  const [account, setAccount] = useState<RewardAccount | null>(null);
  const [txns, setTxns] = useState<RewardTxn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<RewardResponse>('/api/v1/rewards/me');
      setAccount(res.data.account ?? null);
      setTxns(res.data.transactions ?? []);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      setError(e instanceof Error ? e.message : 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const t = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      void load();
    }, 300);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return () => clearTimeout(t);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Rewards</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your reward points balance and recent reward activity (fictional/demo data).
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()}>
          <RefreshCw className="mr-1 h-4 w-4" /> Refresh
        </Button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Award className="h-5 w-5" /> Reward Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {account ? fmt(account.balance, account.currency) : '—'}
              </div>
              <p className="mt-2 text-sm text-amber-50">
                Redeem points for cashback, vouchers and partner offers.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-600" /> Recent Reward Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {txns.length === 0 ? (
                <div className="rounded-b-lg border-t border-dashed border-gray-200 p-10 text-center text-gray-500">
                  No reward transactions yet.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {txns.map((t) => (
                    <li key={t.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {t.description || t.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : '—'}
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          t.points >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {t.points >= 0 ? '+' : ''}
                        {t.points}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}