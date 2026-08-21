import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SupportPage from './index';

describe('SupportPage', () => {
  it('renders support title', () => {
    render(<SupportPage />);
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<SupportPage />);
    expect(screen.getByText('Support micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});
