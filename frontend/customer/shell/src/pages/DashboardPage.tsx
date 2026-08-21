import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '@banking360/design-system';
import { CreditCard, TrendingUp, DollarSign, Award, Loader2 } from 'lucide-react';

export function DashboardPage() {
  const { customer } = useSelector((state: RootState) => state.auth);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { profile } = useSelector((state: RootState) => state.customer);

  const stats = [
    {
      title: 'Total Cards',
      value: '3',
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Available Credit',
      value: '₹2,45,000',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Total Balance',
      value: '₹1,23,456',
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Reward Points',
      value: '12,345',
      icon: Award,
      color: 'text-amber-600 bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {customer?.firstName || customer?.displayName?.split(' ')[0] || 'Customer'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here&#39;s an overview of your banking portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
            {customer?.segment || 'PREMIUM'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'View Cards', href: '/cards', icon: CreditCard },
          { title: 'Transactions', href: '/transactions', icon: TrendingUp },
          { title: 'Make Payment', href: '/payments', icon: DollarSign },
          { title: 'Rewards', href: '/rewards', icon: Award },
        ].map((action) => (
          <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <action.icon className="w-8 h-8 mx-auto text-blue-600" />
              <h3 className="mt-3 font-medium text-gray-900">{action.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-3" />
            <p>Loading recent transactions...</p>
            <p className="text-sm mt-1">This will connect to the Transaction Service API</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
