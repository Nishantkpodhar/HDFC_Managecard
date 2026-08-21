import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RewardsPage from './index';

describe('RewardsPage', () => {
  it('renders rewards title', () => {
    render(<RewardsPage />);
    expect(screen.getByText('Rewards')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<RewardsPage />);
    expect(screen.getByText('Rewards admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});
