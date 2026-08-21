import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LedgerPage from './index';

describe('LedgerPage', () => {
  it('renders ledger title', () => {
    render(<LedgerPage />);
    expect(screen.getByText('Ledger')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<LedgerPage />);
    expect(screen.getByText('Ledger admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});