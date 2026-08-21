import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppSelector } from './store';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { LoadingSpinner } from '@banking360/design-system';

const DashboardApp = lazy(() => import('admin_dashboard_mf/App'));
const CustomersApp = lazy(() => import('admin_customers_mf/App'));
const CardsApp = lazy(() => import('admin_cards_mf/App'));
const TransactionsApp = lazy(() => import('admin_transactions_mf/App'));
const PaymentsApp = lazy(() => import('admin_payments_mf/App'));
const LedgerApp = lazy(() => import('admin_ledger_mf/App'));
const RewardsApp = lazy(() => import('admin_rewards_mf/App'));
const EmiApp = lazy(() => import('admin_emi_mf/App'));
const LoansApp = lazy(() => import('admin_loans_mf/App'));
const FastagApp = lazy(() => import('admin_fastag_mf/App'));
const OffersApp = lazy(() => import('admin_offers_mf/App'));
const CmsApp = lazy(() => import('admin_cms_mf/App'));
const UsersApp = lazy(() => import('admin_users_mf/App'));
const RolesApp = lazy(() => import('admin_roles_mf/App'));
const PermissionsApp = lazy(() => import('admin_permissions_mf/App'));
const ConfigurationApp = lazy(() => import('admin_configuration_mf/App'));
const FeatureFlagsApp = lazy(() => import('admin_feature_flags_mf/App'));
const AuditApp = lazy(() => import('admin_audit_mf/App'));
const SystemHealthApp = lazy(() => import('admin_system_health_mf/App'));

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const loading = useAppSelector((s) => s.auth.loading);
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<Layout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardApp /></ProtectedRoute>} />
        <Route path="customers" element={<ProtectedRoute><CustomersApp /></ProtectedRoute>} />
        <Route path="cards" element={<ProtectedRoute><CardsApp /></ProtectedRoute>} />
        <Route path="transactions" element={<ProtectedRoute><TransactionsApp /></ProtectedRoute>} />
        <Route path="payments" element={<ProtectedRoute><PaymentsApp /></ProtectedRoute>} />
        <Route path="ledger" element={<ProtectedRoute><LedgerApp /></ProtectedRoute>} />
        <Route path="rewards" element={<ProtectedRoute><RewardsApp /></ProtectedRoute>} />
        <Route path="emi" element={<ProtectedRoute><EmiApp /></ProtectedRoute>} />
        <Route path="loans" element={<ProtectedRoute><LoansApp /></ProtectedRoute>} />
        <Route path="fastag" element={<ProtectedRoute><FastagApp /></ProtectedRoute>} />
        <Route path="offers" element={<ProtectedRoute><OffersApp /></ProtectedRoute>} />
        <Route path="cms" element={<ProtectedRoute><CmsApp /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute><UsersApp /></ProtectedRoute>} />
        <Route path="roles" element={<ProtectedRoute><RolesApp /></ProtectedRoute>} />
        <Route path="permissions" element={<ProtectedRoute><PermissionsApp /></ProtectedRoute>} />
        <Route path="configuration" element={<ProtectedRoute><ConfigurationApp /></ProtectedRoute>} />
        <Route path="features" element={<ProtectedRoute><FeatureFlagsApp /></ProtectedRoute>} />
        <Route path="audit" element={<ProtectedRoute><AuditApp /></ProtectedRoute>} />
        <Route path="system-health" element={<ProtectedRoute><SystemHealthApp /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}