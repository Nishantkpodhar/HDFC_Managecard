import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureFlagsPage from './index';

describe('FeatureFlagsPage', () => {
  it('renders feature flags title', () => {
    render(<FeatureFlagsPage />);
    expect(screen.getByText('Feature Flags')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<FeatureFlagsPage />);
    expect(screen.getByText('Feature Flags admin micro-frontend loaded via Module Federation.')).toBeInTheDocument();
  });
});