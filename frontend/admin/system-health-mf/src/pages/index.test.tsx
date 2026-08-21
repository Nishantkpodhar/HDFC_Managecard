import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SystemHealthPage from './index';

describe('SystemHealthPage', () => {
  it('renders system health title', () => {
    render(<SystemHealthPage />);
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<SystemHealthPage />);
    expect(screen.getByText('System Health admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});