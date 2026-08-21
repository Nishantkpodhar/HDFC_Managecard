import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import TransactionsPage from './index';

// Create a proper mock reducer
const mockReducer = (state: Record<string, unknown> = {}): Record<string, unknown> => state;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string };
type DivProps = React.HTMLAttributes<HTMLDivElement>;
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// Mock the API client
const mockGet = vi.fn();
vi.mock('@banking360/api-contracts', () => ({
  useApiClient: () => ({
    get: mockGet,
  }),
}));

// Mock design system components
vi.mock('@banking360/design-system', () => ({
  Button: ({ children, onClick, ...props }: ButtonProps) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  Card: ({ children, ...props }: DivProps) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: DivProps) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: DivProps) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: DivProps) => <h2 {...props}>{children}</h2>,
  Input: ({ ...props }: InputProps) => <input {...props} />,
  LoadingSpinner: () => <div data-testid="loading-spinner" />,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Search: () => <span data-testid="search-icon" />,
  ArrowDownLeft: () => <span data-testid="arrow-down-left" />,
  ArrowUpRight: () => <span data-testid="arrow-up-right" />,
  RefreshCw: () => <span data-testid="refresh-icon" />,
}));

const renderWithProviders = (component: React.ReactNode) => {
  const store = configureStore({ reducer: { test: mockReducer } });
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('TransactionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders transactions title', async () => {
    mockGet.mockResolvedValue({ data: [] });
    renderWithProviders(<TransactionsPage />);
    await waitFor(() => {
      expect(screen.getByText('Transactions')).toBeInTheDocument();
    });
  });

  it('renders loading spinner initially', () => {
    mockGet.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithProviders(<TransactionsPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty state when no transactions', async () => {
    mockGet.mockResolvedValue({ data: [] });
    renderWithProviders(<TransactionsPage />);
    await waitFor(() => {
      expect(screen.getByText('No transactions found.')).toBeInTheDocument();
    });
  });
});