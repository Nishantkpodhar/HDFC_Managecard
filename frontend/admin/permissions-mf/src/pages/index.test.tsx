import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PermissionsPage from './index';

describe('PermissionsPage', () => {
  it('renders permissions title', () => {
    render(<PermissionsPage />);
    expect(screen.getByText('Permissions')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<PermissionsPage />);
    expect(screen.getByText('Permissions admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});
