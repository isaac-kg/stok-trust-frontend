import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/config';

/** Narrow store slice used for auth headers — avoids importing the full store (circular deps). */
type AuthTokenSlice = { auth: { accessToken: string | null } };

export const apiBaseQuery = fetchBaseQuery({
  baseUrl: API_URL || '/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AuthTokenSlice).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});
