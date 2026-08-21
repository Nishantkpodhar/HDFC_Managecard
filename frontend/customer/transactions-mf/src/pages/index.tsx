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
import { Search, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';

interface TransactionDto {
  id: string;
  customerId: string;
  cardId: string;
  description: string;
  amount: number;
  currency: string;
  state: TransactionState;
  createdAt?: string;
}

type TransactionState =
  | 'AUTHORIZED'
  | 'PENDING'
  | 'UNSETTLED'
  | 'SETTLED'
  | 'BILLED'
  | 'REFUNDED'
  | 'REVERSED'
  | 'FAILED';

function toTransactions(data: unknown): TransactionDto[] {
  if (!data) return [];
  const d = data as { content?: TransactionDto[]; items?: TransactionDto[] };
  if (Array.isArray(d.content)) return d.content;
  if (Array.isArray(d.items)) return d.items;
  if (Array.isArray(data)) return data as TransactionDto[];
  return [];
}

const STATE_STYLES: Record<string, string> = {
  SETTLED: 'bg-green-100 text-green-700',
  AUTHORIZED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  UNSETTLED: 'bg-yellow-100 text-yellow-700',
  BILLED: 'bg-indigo-100 text-indigo-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
  REVERSED: 'bg-orange-100 text-orange-700',
  FAILED: 'bg-red-100 text-red-700',
};

const REFUND_STATES = new Set(['REFUNDED', 'REVERSED']);

function formatAmount(amount: number, currency: string, state: string): string {
  const sign = REFUND_STATES.has(state) ? '+' : '-';
  const value = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
  return `${sign} ${value}`;
}

export default function TransactionsPage() {
  const api = useApiClient();
  const [items, setItems] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');

      const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const params = new URLSearchParams();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (stateFilter !== 'ALL') params.set('state', stateFilter);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (query.trim()) params.set('description', query.trim());
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const qs = params.toString();
      const res = await api.get<unknown>(`/api/v1/transactions${qs ? `?${qs}` : ''}`);
      setItems(toTransactions(res.data));
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      setError(e instanceof Error ? e.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [api, query, stateFilter]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const t = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      void load();
    }, 300);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return () => clearTimeout(t);
  }, [load]);

  const filtered = useMemo(() => items, [items]);

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
          <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your transaction history (object-level authorized — only your own transactions).
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()}>
          <RefreshCw className="mr-1 h-4 w-4" /> Refresh
        </Button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
            className="pl-9"
            placeholder="Search by description"
            value={query}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700"
          value={stateFilter}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="ALL">All states</option>
          <option value="AUTHORIZED">Authorized</option>
          <option value="PENDING">Pending</option>
          <option value="UNSETTLED">Unsettled</option>
          <option value="SETTLED">Settled</option>
          <option value="BILLED">Billed</option>
          <option value="REFUNDED">Refunded</option>
          <option value="REVERSED">Reversed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
          No transactions found.
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-blue-600" />
              {filtered.length} transaction{filtered.length === 1 ? '' : 's'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Card</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">State</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{t.description}</td>
                      <td className="px-4 py-3 text-gray-600">{t.cardId}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleString('en-IN')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            STATE_STYLES[t.state] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {t.state}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        <span className="inline-flex items-center gap-1">
                          {REFUND_STATES.has(t.state) ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                          {formatAmount(t.amount, t.currency, t.state)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}