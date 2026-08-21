import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FastagPage from './index';

describe('FastagPage', () => {
  it('renders fastag title', () => {
    render(<FastagPage />);
    expect(screen.getByText('Fastag')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<FastagPage />);
    expect(screen.getByText('Fastag admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});