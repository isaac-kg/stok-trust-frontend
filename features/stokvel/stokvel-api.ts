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
    //get all stokvels BASED ON SEARCH AND FILTERS
    getStokvels: builder.query({
      query: ({ search, filters }: { search: string, filters: Record<string, string> }) => ({
        url: '/stokvels',
        method: 'GET',
        params: {
          search,
          filters,
        },
      }),
    }),
    //get stokvel by id
    getStokvelById: builder.query({
      query: (id) => ({
        url: `/stokvels/${id}`,
        method: 'GET',
      }),
    }),
    //update stokvel by id
    updateStokvelById: builder.mutation({
      query: ({ id, body }) => ({
        url: `/stokvels/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Stokvel'],
    }),
  }),
});

export const { useCreateStokvelMutation, useGetStokvelsQuery, useGetStokvelByIdQuery, useUpdateStokvelByIdMutation } = stokvelApi;
