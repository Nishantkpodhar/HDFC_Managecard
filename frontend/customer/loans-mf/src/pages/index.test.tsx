import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoansPage from './index';

describe('LoansPage', () => {
  it('renders loans title', () => {
    render(<LoansPage />);
    expect(screen.getByText('Loans')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<LoansPage />);
    expect(screen.getByText('Loans micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});