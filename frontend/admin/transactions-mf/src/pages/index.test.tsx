import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TransactionsPage from './index';

describe('TransactionsPage', () => {
  it('renders transactions title', () => {
    render(<TransactionsPage />);
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<TransactionsPage />);
    expect(screen.getByText('Transactions admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});
