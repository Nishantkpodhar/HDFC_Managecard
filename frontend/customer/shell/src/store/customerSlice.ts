import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CustomerProfile } from '@banking360/shared-types';

export interface CustomerState {
  profile: CustomerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  profile: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<CustomerProfile>) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<CustomerProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { fetchProfileStart, fetchProfileSuccess, fetchProfileFailure, updateProfile } = customerSlice.actions;
export default customerSlice.reducer;