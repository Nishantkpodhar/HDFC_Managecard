import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConfigurationPage from './index';

describe('ConfigurationPage', () => {
  it('renders configuration title', () => {
    render(<ConfigurationPage />);
    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ConfigurationPage />);
    expect(screen.getByText('Configuration admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});