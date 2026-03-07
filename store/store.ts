import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/auth-api';
import { authSlice } from '@/features/auth/auth-slice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
