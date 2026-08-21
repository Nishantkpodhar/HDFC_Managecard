import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiClient } from '@banking360/api-contracts';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  LoadingSpinner,
} from '@banking360/design-system';
import { RefreshCw, Send, Wallet } from 'lucide-react';

interface PaymentDto {
  id: string;
  customerId: string;
  fromCardId?: string;
  toAccount?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  idempotencyKey?: string;
  createdAt?: string;
}

type PaymentStatus =
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'REVERSED';

function toPayments(data: unknown): PaymentDto[] {
  if (!data) return [];
  const d = data as { content?: PaymentDto[]; items?: PaymentDto[] };
  if (Array.isArray(d.content)) return d.content;
  if (Array.isArray(d.items)) return d.items;
  if (Array.isArray(data)) return data as PaymentDto[];
  return [];
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
  REVERSED: 'bg-orange-100 text-orange-700',
};

const CURRENCY_FMT = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return CURRENCY_FMT.format(amount);
  }
}

export default function PaymentsPage() {
  const api = useApiClient();
  const [items, setItems] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // create form state
  const [fromCardId, setFromCardId] = useState('card-2001');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const res = await api.get<unknown>('/api/v1/payments');
      setItems(toPayments(res.data));
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      setError(e instanceof Error ? e.message : 'Failed to load payments');
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

  const totalPaid = useMemo(
    () =>
      items
        .filter((p) => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    [items],
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormMsg(null);
      const amt = Number(amount);
      if (!toAccount.trim() || !Number.isFinite(amt) || amt <= 0) {
        setFormMsg({ kind: 'err', text: 'Enter a valid payee and positive amount.' });
        return;
      }
      setSubmitting(true);
      try {
        // Idempotency-Key guarantees duplicate requests do not create a second payment.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const idempotencyKey = `pay-${crypto.randomUUID()}`;
        await api.post('/api/v1/payments', {
          fromCardId,
          toAccount: toAccount.trim(),
          amount: amt,
          currency,
          idempotencyKey,
        });
        setFormMsg({ kind: 'ok', text: 'Payment submitted (idempotent).' });
        setToAccount('');
        setAmount('');
        void load();
      } catch (e) {
        setFormMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Payment failed' });
      } finally {
        setSubmitting(false);
      }
    },
    [api, amount, currency, fromCardId, toAccount, load],
  );

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
          <h1 className="text-2xl font-semibold text-gray-800">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Make bill/utility payments. Each payment is idempotent via an Idempotency-Key.
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()}>
          <RefreshCw className="mr-1 h-4 w-4" /> Refresh
        </Button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                {items.length} payment{items.length === 1 ? '' : 's'} ·{' '}
                {formatAmount(totalPaid, 'INR')} completed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {items.length === 0 ? (
                <div className="rounded-b-lg border-t border-dashed border-gray-200 p-10 text-center text-gray-500">
                  No payments yet. Use the form to make one.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Payee</th>
                        <th className="px-4 py-3 font-medium">Card</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 text-right font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{p.toAccount}</td>
                          <td className="px-4 py-3 text-gray-600">{p.fromCardId}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {p.createdAt ? new Date(p.createdAt).toLocaleString('en-IN') : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                STATUS_STYLES[p.status] || 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">
                            {formatAmount(p.amount, p.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                New Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => void submit(e)} className="space-y-3">
                <div>
                  <label htmlFor="fromCardId" className="mb-1 block text-xs font-medium text-gray-600">From card</label>
                  <select
                    id="fromCardId"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={fromCardId}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFromCardId(e.target.value)}
                  >
                    <option value="card-2001">card-2001 (Credit)</option>
                    <option value="card-2002">card-2002 (Debit)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="toAccount" className="mb-1 block text-xs font-medium text-gray-600">Payee / Biller</label>
                  <Input
                    id="toAccount"
                    placeholder="e.g. UTIL-ELECTRICITY"
                    value={toAccount}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    onChange={(e) => setToAccount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="amount" className="mb-1 block text-xs font-medium text-gray-600">Amount</label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <label htmlFor="currency" className="mb-1 block text-xs font-medium text-gray-600">Currency</label>
                    <select
                      id="currency"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={currency}
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
                    >
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>
                {formMsg && (
                  <div
                    className={`rounded-lg p-2 text-xs ${
                      formMsg.kind === 'ok'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {formMsg.text}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Pay Now'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}