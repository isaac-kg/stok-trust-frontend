import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthResponse } from './model/types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthResponse>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
