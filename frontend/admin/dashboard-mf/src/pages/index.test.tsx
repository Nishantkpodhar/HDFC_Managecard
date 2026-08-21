import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from './index';
import '@testing-library/jest-dom/vitest';

describe('DashboardPage', () => {
  it('renders dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});