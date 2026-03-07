import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SignUpRequest, SignInRequest, AuthResponse } from './model/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useSignUpMutation, useSignInMutation } = authApi;
