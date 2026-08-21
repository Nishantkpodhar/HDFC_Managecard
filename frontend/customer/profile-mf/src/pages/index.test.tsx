import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfilePage from './index';

describe('ProfilePage', () => {
  it('renders profile title', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Profile micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});
