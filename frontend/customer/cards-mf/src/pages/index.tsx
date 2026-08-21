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
import { CreditCard, ShieldCheck, ShieldAlert, Power, PowerOff } from 'lucide-react';

interface CardDto {
  id: string;
  maskedNumber: string;
  lastFour: string;
  type: string;
  productName: string;
  status: string;
  creditLimit?: number | null;
  availableLimit?: number | null;
  domesticEnabled?: boolean;
  internationalEnabled?: boolean;
  onlineEnabled?: boolean;
  contactlessEnabled?: boolean;
}

function toCards(data: unknown): CardDto[] {
  if (!data) return [];
  const d = data as { content?: CardDto[]; items?: CardDto[] };
  if (Array.isArray(d.content)) return d.content;
  if (Array.isArray(d.items)) return d.items;
  if (Array.isArray(data)) return data as CardDto[];
  return [];
}

function Toggle({
  label,
  value,
  disabled,
  onToggle,
}: {
  label: string;
  value?: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <Button
        type="button"
        size="sm"
        variant={value ? 'default' : 'outline'}
        disabled={disabled}
        onClick={onToggle}
      >
        {value ? <Power className="mr-1 h-4 w-4" /> : <PowerOff className="mr-1 h-4 w-4" />}
        {value ? 'On' : 'Off'}
      </Button>
    </div>
  );
}

export default function CardsPage() {
  const api = useApiClient();
  const [cards, setCards] = useState<CardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<unknown>('/api/v1/cards');
      setCards(toCards(res.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const updateControls = useCallback(
    async (id: string, patch: Record<string, boolean>) => {
      setBusyId(id);
      try {
        const res = await api.patch<CardDto>(`/api/v1/cards/${id}/controls`, patch);
        setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...res.data } : c)));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update controls');
      } finally {
        setBusyId(null);
      }
    },
    [api],
  );

  const setStatus = useCallback(
    async (id: string, status: string) => {
      setBusyId(id);
      try {
        const res = await api.post<CardDto>(`/api/v1/cards/${id}/status?status=${status}`, {});
        setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...res.data } : c)));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to change status');
      } finally {
        setBusyId(null);
      }
    },
    [api],
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
          <h1 className="text-2xl font-semibold text-gray-800">Cards</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your credit and debit cards. Only cards you own are visible (object-level authorization).
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {cards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
          No cards found for your account.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const active = card.status === 'ACTIVE';
            const blocked = card.status === 'BLOCKED';
            const hotlisted = card.status === 'HOTLISTED';
            return (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      {card.productName}
                    </CardTitle>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        active
                          ? 'bg-green-100 text-green-700'
                          : blocked || hotlisted
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{card.maskedNumber}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">{card.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last 4</p>
                      <p className="font-medium">{card.lastFour}</p>
                    </div>
                    {card.creditLimit != null && (
                      <div>
                        <p className="text-gray-500">Credit Limit</p>
                        <p className="font-medium">₹{card.creditLimit.toLocaleString('en-IN')}</p>
                      </div>
                    )}
                    {card.availableLimit != null && (
                      <div>
                        <p className="text-gray-500">Available</p>
                        <p className="font-medium">₹{card.availableLimit.toLocaleString('en-IN')}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Toggle
                      label="Domestic"
                      value={card.domesticEnabled}
                      disabled={busyId === card.id}
                      onToggle={() => void updateControls(card.id, { domesticEnabled: !card.domesticEnabled })}
                    />
                    <Toggle
                      label="International"
                      value={card.internationalEnabled}
                      disabled={busyId === card.id}
                      onToggle={() =>
                        void updateControls(card.id, { internationalEnabled: !card.internationalEnabled })
                      }
                    />
                    <Toggle
                      label="Online"
                      value={card.onlineEnabled}
                      disabled={busyId === card.id}
                      onToggle={() => void updateControls(card.id, { onlineEnabled: !card.onlineEnabled })}
                    />
                    <Toggle
                      label="Contactless"
                      value={card.contactlessEnabled}
                      disabled={busyId === card.id}
                      onToggle={() =>
                        void updateControls(card.id, { contactlessEnabled: !card.contactlessEnabled })
                      }
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                    {active ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === card.id}
                        onClick={() => void setStatus(card.id, 'INACTIVE')}
                      >
                        <PowerOff className="mr-1 h-4 w-4" /> Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={busyId === card.id}
                        onClick={() => void setStatus(card.id, 'ACTIVE')}
                      >
                        <Power className="mr-1 h-4 w-4" /> Activate
                      </Button>
                    )}
                    {!hotlisted && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busyId === card.id}
                        onClick={() => void setStatus(card.id, 'HOTLISTED')}
                      >
                        <ShieldAlert className="mr-1 h-4 w-4" /> Hotlist
                      </Button>
                    )}
                    {blocked && (
                      <Button
                        size="sm"
                        disabled={busyId === card.id}
                        onClick={() => void setStatus(card.id, 'ACTIVE')}
                      >
                        <ShieldCheck className="mr-1 h-4 w-4" /> Unblock
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}