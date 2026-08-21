import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotificationsPage from './index';

describe('NotificationsPage', () => {
  it('renders notifications title', () => {
    render(<NotificationsPage />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<NotificationsPage />);
    expect(screen.getByText('Notifications micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});