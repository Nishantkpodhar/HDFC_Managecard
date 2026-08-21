import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RolesPage from './index';

describe('RolesPage', () => {
  it('renders roles title', () => {
    render(<RolesPage />);
    expect(screen.getByText('Roles')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<RolesPage />);
    expect(screen.getByText('Roles admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});