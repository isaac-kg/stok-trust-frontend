import { createApi } from '@reduxjs/toolkit/query/react';
import { apiBaseQuery } from '@/lib/api-base-query';
import type { CreateStokvelRequest, StokvelMember, FetchStokvelsResponse, Stokvel, StokvelConstitution, StokvelConstitutionRequest } from './model/types';

export const stokvelApi = createApi({
  reducerPath: 'stokvelApi',
  baseQuery: apiBaseQuery,
  tagTypes: ['Stokvel'],
  endpoints: (builder) => ({
    createStokvel: builder.mutation<Stokvel, CreateStokvelRequest>({
      query: (body) => ({
        url: '/stokvels',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stokvel'],
    }),
    createStokvelConstitution: builder.mutation<StokvelConstitution, StokvelConstitutionRequest>({
      query: (body) => ({
        url: 'stokvels/create-constitution',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stokvel'],
    }),
    fetchUserStokvels: builder.query<FetchStokvelsResponse, {
      searchTerm: string;
      roleFilter: string;
      page: number;
      size: number;
    }>({
      query: ({
        searchTerm,
        roleFilter,
        page,
        size
      }) => ({
        url: '/stokvels',
        method: 'GET',
        params: {
          searchTerm,
          roleFilter,
          page,
          size
        }
      }),
    }),
    fetchStokvel: builder.query<{ members: { meta: { totalCount: number, page: number, size: number }, users: StokvelMember[] }, stokvel: Stokvel }, { id: string }>({
      query: ({ id }) => ({
        url: `/stokvels/${id}`,
        method: 'GET'
      }),
    }),
  }),
});

export const { useCreateStokvelMutation, useCreateStokvelConstitutionMutation, useFetchUserStokvelsQuery, useFetchStokvelQuery } = stokvelApi;

