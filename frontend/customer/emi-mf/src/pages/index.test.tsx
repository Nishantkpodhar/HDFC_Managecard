import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmiPage from './index';

describe('EmiPage', () => {
  it('renders EMI title', () => {
    render(<EmiPage />);
    expect(screen.getByText('Emi')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<EmiPage />);
    expect(screen.getByText('Emi micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});