import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PaymentsPage from './index';
import { useApiClient } from '@banking360/api-contracts';

// Mock the API client
vi.mock('@banking360/api-contracts', () => ({
  useApiClient: vi.fn(() => ({
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({}),
  })),
}));

describe('PaymentsPage', () => {
  it('renders payments title', async () => {
    render(<PaymentsPage />);
    await waitFor(() => expect(screen.getByText('Payments')).toBeInTheDocument());
  });

  it('renders description text', async () => {
    render(<PaymentsPage />);
    await waitFor(() => expect(screen.getByText('Make bill/utility payments. Each payment is idempotent via an Idempotency-Key.')).toBeInTheDocument());
  });
});