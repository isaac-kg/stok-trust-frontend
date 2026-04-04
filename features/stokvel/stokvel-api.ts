import { createApi } from '@reduxjs/toolkit/query/react';
import { apiBaseQuery } from '@/lib/api-base-query';
import type { CreateStokvelRequest, CreateStokvelResponse } from './model/types';

export const stokvelApi = createApi({
  reducerPath: 'stokvelApi',
  baseQuery: apiBaseQuery,
  tagTypes: ['Stokvel'],
  endpoints: (builder) => ({
    createStokvel: builder.mutation<CreateStokvelResponse, CreateStokvelRequest>({
      query: (body) => ({
        url: '/stokvels',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stokvel'],
    }),
  }),
});

export const { useCreateStokvelMutation } = stokvelApi;
