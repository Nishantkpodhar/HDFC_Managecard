import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logout } from '../store/authSlice';
import {
  Avatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@banking360/design-system';
import { LayoutDashboard, Users, CreditCard, History, CreditCard as PaymentsIcon, BookOpen, Award, Calculator, Home, Truck, Tag, FileText, UserCog, Shield, Key, Settings, Flag, FileCheck, Activity, Bell, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Cards', href: '/admin/cards', icon: CreditCard },
  { name: 'Transactions', href: '/admin/transactions', icon: History },
  { name: 'Payments', href: '/admin/payments', icon: PaymentsIcon },
  { name: 'Ledger', href: '/admin/ledger', icon: BookOpen },
  { name: 'Rewards', href: '/admin/rewards', icon: Award },
  { name: 'EMI', href: '/admin/emi', icon: Calculator },
  { name: 'Loans', href: '/admin/loans', icon: Home },
  { name: 'FASTag', href: '/admin/fastag', icon: Truck },
  { name: 'Offers', href: '/admin/offers', icon: Tag },
  { name: 'CMS', href: '/admin/cms', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: UserCog },
  { name: 'Roles', href: '/admin/roles', icon: Shield },
  { name: 'Permissions', href: '/admin/permissions', icon: Key },
  { name: 'Configuration', href: '/admin/configuration', icon: Settings },
  { name: 'Feature Flags', href: '/admin/features', icon: Flag },
  { name: 'Audit', href: '/admin/audit', icon: FileCheck },
  { name: 'System Health', href: '/admin/system-health', icon: Activity },
];

export function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { admin } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
    setUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-indigo-600">Banking360 Admin</h1>
            <button
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto" aria-label="Main navigation">
            <ul className="space-y-1 px-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <Avatar
                name={admin?.fullName || admin?.firstName || 'Admin'}
                size="md"
              />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {admin?.fullName || admin?.firstName || 'Administrator'}
                </p>
                <p className="text-xs text-gray-500 truncate">{admin?.email || 'admin@banking360.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="User menu"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <Avatar name={admin?.fullName || admin?.firstName || 'Admin'} size="sm" />
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {admin?.fullName || admin?.firstName || 'Administrator'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{admin?.fullName || admin?.firstName || 'Administrator'}</p>
                    <p className="text-xs text-gray-500 truncate">{admin?.email || 'admin@banking360.com'}</p>
                  </div>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}