import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaymentsPage from './index';

describe('PaymentsPage', () => {
  it('renders payments title', () => {
    render(<PaymentsPage />);
    expect(screen.getByText('Payments')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<PaymentsPage />);
    expect(screen.getByText('Payments admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});