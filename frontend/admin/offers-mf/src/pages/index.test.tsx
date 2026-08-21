import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OffersPage from './index';

describe('OffersPage', () => {
  it('renders offers title', () => {
    render(<OffersPage />);
    expect(screen.getByText('Offers')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<OffersPage />);
    expect(screen.getByText('Offers admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});