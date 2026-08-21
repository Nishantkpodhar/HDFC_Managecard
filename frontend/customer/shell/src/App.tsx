import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppSelector } from './store';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { LoadingSpinner } from '@banking360/design-system';

// Remote micro-frontends (exposed as default App components)
const DashboardApp = lazy(() => import('customer_dashboard_mf/App'));
const CardsApp = lazy(() => import('customer_cards_mf/App'));
const TransactionsApp = lazy(() => import('customer_transactions_mf/App'));
const PaymentsApp = lazy(() => import('customer_payments_mf/App'));
const RewardsApp = lazy(() => import('customer_rewards_mf/App'));
const EmiApp = lazy(() => import('customer_emi_mf/App'));
const LoansApp = lazy(() => import('customer_loans_mf/App'));
const FastagApp = lazy(() => import('customer_fastag_mf/App'));
const OffersApp = lazy(() => import('customer_offers_mf/App'));
const ProfileApp = lazy(() => import('customer_profile_mf/App'));
const NotificationsApp = lazy(() => import('customer_notifications_mf/App'));
const SupportApp = lazy(() => import('customer_support_mf/App'));

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const loading = useAppSelector((s) => s.auth.loading);
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cards"
          element={
            <ProtectedRoute>
              <CardsApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <RewardsApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emi"
          element={
            <ProtectedRoute>
              <EmiApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans"
          element={
            <ProtectedRoute>
              <LoansApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fastag"
          element={
            <ProtectedRoute>
              <FastagApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offers"
          element={
            <ProtectedRoute>
              <OffersApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-requests"
          element={
            <ProtectedRoute>
              <SupportApp />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
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