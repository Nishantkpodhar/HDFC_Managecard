import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPage } from './DashboardPage';
import { useApiClient } from '@banking360/api-contracts';

// Mock the api-contracts module
vi.mock('@banking360/api-contracts', () => ({
  useApiClient: vi.fn(),
}));

const mockApiClient = {
  get: vi.fn(),
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useApiClient).mockReturnValue(mockApiClient);
  });

  it('renders loading skeleton initially', () => {
    mockApiClient.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<DashboardPage />);

    // Should show loading skeletons (3 cards with animate-pulse class)
    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBe(3);
  });

  it('renders error message when API call fails', async () => {
    mockApiClient.get.mockRejectedValue(new Error('Network error'));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
    });
  });

  it('renders dashboard data when API call succeeds', async () => {
    const mockData = {
      accounts: [
        { id: '1', name: 'Savings Account', balance: '50,000', currency: 'INR' },
        { id: '2', name: 'Current Account', balance: '25,000', currency: 'INR' },
      ],
      cards: [
        { id: '1', name: 'Credit Card', maskedNumber: '1234', availableLimit: '75,000' },
      ],
      recentTransactions: [
        { id: '1', description: 'Online Payment', amount: '-1,500', date: '2024-01-15' },
        { id: '2', description: 'Salary Credit', amount: '+50,000', date: '2024-01-10' },
      ],
    };

    mockApiClient.get.mockResolvedValue({ data: mockData });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Savings Account')).toBeInTheDocument();
      expect(screen.getByText('Current Account')).toBeInTheDocument();
      expect(screen.getByText('INR 50,000')).toBeInTheDocument();
      expect(screen.getByText('INR 25,000')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Your Cards')).toBeInTheDocument();
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
      expect(screen.getByText('**** **** **** 1234')).toBeInTheDocument();
      expect(screen.getByText('Available: 75,000')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      expect(screen.getByText('Online Payment')).toBeInTheDocument();
      expect(screen.getByText('-1,500')).toBeInTheDocument();
      expect(screen.getByText('Salary Credit')).toBeInTheDocument();
      expect(screen.getByText('+50,000')).toBeInTheDocument();
    });
  });

  it('calls the correct API endpoint', async () => {
    mockApiClient.get.mockResolvedValue({ data: { accounts: [], cards: [], recentTransactions: [] } });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/v1/customer/dashboard');
    });
  });

  it('handles empty data gracefully', async () => {
    mockApiClient.get.mockResolvedValue({ data: { accounts: [], cards: [], recentTransactions: [] } });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.queryByText('Savings Account')).not.toBeInTheDocument();
      expect(screen.queryByText('Your Cards')).toBeInTheDocument(); // Card section still renders
      expect(screen.queryByText('Recent Transactions')).toBeInTheDocument(); // Transaction section still renders
    });
  });
});