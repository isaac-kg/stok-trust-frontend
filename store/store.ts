import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { authApi } from '@/features/auth/auth-api';
import { authSlice } from '@/features/auth/auth-slice';
import { usersApi } from '@/features/users/users-api';
import { stokvelApi } from '@/features/stokvel/stokvel-api';

function createNoopStorage() {
  return {
    getItem: () => Promise.resolve(null as string | null),
    setItem: (_key: string, value: unknown) => Promise.resolve(value),
    removeItem: () => Promise.resolve(),
  };
}

const storage =
  typeof window !== 'undefined'
    ? require('redux-persist/lib/storage').default
    : createNoopStorage();

const authPersistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer);

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [stokvelApi.reducerPath]: stokvelApi.reducer,
  auth: persistedAuthReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware, usersApi.middleware, stokvelApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
