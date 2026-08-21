import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@banking360/design-system';
import { useApiClient } from '@banking360/api-contracts';

interface DashboardAccount {
  id: string;
  name: string;
  balance: string;
  currency: string;
}

interface DashboardCard {
  id: string;
  name: string;
  maskedNumber: string;
  availableLimit: string;
}

interface DashboardTransaction {
  id: string;
  description: string;
  amount: string;
  date: string;
}

interface DashboardData {
  accounts: DashboardAccount[];
  cards: DashboardCard[];
  recentTransactions: DashboardTransaction[];
}

export function DashboardPage() {
  const api = useApiClient();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<DashboardData>('/api/v1/customer/dashboard')
      .then((res) => {
        if (active) setData(res.data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Request failed');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <Card>
                <CardContent className="h-20 bg-gray-200 rounded" />
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle>{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {account.currency} {account.balance}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.cards.map((card) => (
              <div key={card.id} className="mb-4 p-4 border rounded">
                <div className="font-medium">{card.name}</div>
                <div className="text-sm text-gray-600">**** **** **** {card.maskedNumber}</div>
                <div className="text-sm text-green-600">Available: {card.availableLimit}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentTransactions.map((txn) => (
              <div key={txn.id} className="flex justify-between py-2 border-b">
                <div>
                  <div className="font-medium">{txn.description}</div>
                  <div className="text-sm text-gray-600">{txn.date}</div>
                </div>
                <div className="font-medium">{txn.amount}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;