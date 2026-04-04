import { createApi } from '@reduxjs/toolkit/query/react';
import { apiBaseQuery } from '@/lib/api-base-query';
import type { SignUpRequest, SignInRequest, AuthResponse } from './model/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: apiBaseQuery,
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
