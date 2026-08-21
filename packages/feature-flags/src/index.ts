/**
 * @banking360/feature-flags - Feature Flags Client
 * 
 * This package provides feature flag management for all micro-frontends.
 * Flags are fetched from the Feature Flag Service and cached locally.
 */

export * from './types';

// Feature flag provider and hooks (to be implemented)
// export { FeatureFlagsProvider, useFeatureFlags, useFeatureFlag } from './hooks/useFeatureFlags';

// API client (to be implemented)
// export { featureFlagsApi } from './api/featureFlagsApi';

export const FEATURE_FLAGS_VERSION = '1.0.0';