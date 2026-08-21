import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import RewardsPage from './index';
import { useApiClient } from '@banking360/api-contracts';

// Mock the API client
vi.mock('@banking360/api-contracts', () => ({
  useApiClient: vi.fn(() => ({
    get: vi.fn().mockResolvedValue({ data: { account: null, transactions: [] } }),
  })),
}));

describe('RewardsPage', () => {
  it('renders rewards title', async () => {
    render(<RewardsPage />);
    await waitFor(() => expect(screen.getByText('Rewards')).toBeInTheDocument());
  });

  it('renders description text', async () => {
    render(<RewardsPage />);
    await waitFor(() => expect(screen.getByText('Your reward points balance and recent reward activity (fictional/demo data).')).toBeInTheDocument());
  });
});
