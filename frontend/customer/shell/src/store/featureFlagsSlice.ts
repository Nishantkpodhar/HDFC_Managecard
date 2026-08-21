import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FeatureFlagsState {
  flags: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}

const initialState: FeatureFlagsState = {
  flags: {},
  loading: false,
  error: null,
};

const featureFlagsSlice = createSlice({
  name: 'featureFlags',
  initialState,
  reducers: {
    fetchFlagsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFlagsSuccess: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.flags = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchFlagsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFlag: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.flags[action.payload.key] = action.payload.value;
    },
  },
});

export const { fetchFlagsStart, fetchFlagsSuccess, fetchFlagsFailure, setFlag } = featureFlagsSlice.actions;
export default featureFlagsSlice.reducer;