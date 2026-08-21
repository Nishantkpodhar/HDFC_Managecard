import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import CardsPage from './index';

// Create a proper mock reducer
const mockReducer = (state: Record<string, unknown> = {}): Record<string, unknown> => state;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string };
type DivProps = React.HTMLAttributes<HTMLDivElement>;

// Mock the API client
const mockGet = vi.fn();
const mockPatch = vi.fn();
const mockPost = vi.fn();

vi.mock('@banking360/api-contracts', () => ({
  useApiClient: () => ({
    get: mockGet,
    patch: mockPatch,
    post: mockPost,
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
  LoadingSpinner: () => <div data-testid="loading-spinner" />,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  CreditCard: () => <span data-testid="credit-card-icon" />,
  ShieldCheck: () => <span data-testid="shield-check-icon" />,
  ShieldAlert: () => <span data-testid="shield-alert-icon" />,
  Power: () => <span data-testid="power-icon" />,
  PowerOff: () => <span data-testid="power-off-icon" />,
}));

const renderWithProviders = (component: React.ReactNode) => {
  const store = configureStore({ reducer: { test: mockReducer } });
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('CardsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSuccessResponse = {
    success: true,
    data: [],
    message: '',
    meta: {
      requestId: 'test-request-id',
      timestamp: new Date().toISOString(),
    },
  };

  it('renders cards title', async () => {
    mockGet.mockResolvedValue(mockSuccessResponse);
    renderWithProviders(<CardsPage />);
    await waitFor(() => {
      expect(screen.getByText('Cards')).toBeInTheDocument();
    });
  });

  it('renders loading spinner initially', () => {
    mockGet.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithProviders(<CardsPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty state when no cards', async () => {
    mockGet.mockResolvedValue(mockSuccessResponse);
    renderWithProviders(<CardsPage />);
    await waitFor(() => {
      expect(screen.getByText('No cards found for your account.')).toBeInTheDocument();
    });
  });
});
