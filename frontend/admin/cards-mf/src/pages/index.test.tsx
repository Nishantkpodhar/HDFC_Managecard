import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardsPage from './index';

describe('CardsPage', () => {
  it('renders cards title', () => {
    render(<CardsPage />);
    expect(screen.getByText('Cards')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<CardsPage />);
    expect(screen.getByText('Cards admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});
