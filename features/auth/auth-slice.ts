import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthResponse } from './model/types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthResponse>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    patchUserProfile: (
      state,
      action: PayloadAction<Partial<NonNullable<AuthResponse['user']>['profile']>>,
    ) => {
      if (state.user?.profile) {
        state.user.profile = { ...state.user.profile, ...action.payload };
      }
    },
  },
});

export const { setAuth, clearAuth, patchUserProfile } = authSlice.actions;
export const authReducer = authSlice.reducer;
