import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UsersPage from './index';

describe('UsersPage', () => {
  it('renders users title', () => {
    render(<UsersPage />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<UsersPage />);
    expect(screen.getByText('Users admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});