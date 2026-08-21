import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuditPage from './index';

describe('AuditPage', () => {
  it('renders audit title', () => {
    render(<AuditPage />);
    expect(screen.getByText('Audit')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<AuditPage />);
    expect(screen.getByText('Audit admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});