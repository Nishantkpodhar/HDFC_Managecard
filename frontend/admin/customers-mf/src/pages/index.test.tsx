import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomersPage from './index';

describe('CustomersPage', () => {
  it('renders customers title', () => {
    render(<CustomersPage />);
    expect(screen.getByText('Customers')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<CustomersPage />);
    expect(screen.getByText('Customers admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});
