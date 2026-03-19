import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SignUpRequest, SignInRequest, AuthResponse } from './model/types';
import { API_URL } from '@/config';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL || '/api',
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: (body) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      query: (body) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useSignUpMutation, useSignInMutation } = authApi;
