import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CmsPage from './index';

describe('CmsPage', () => {
  it('renders cms title', () => {
    render(<CmsPage />);
    expect(screen.getByText('Cms')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<CmsPage />);
    expect(screen.getByText('Cms admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});
