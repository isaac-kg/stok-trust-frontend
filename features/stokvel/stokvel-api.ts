import { createApi } from '@reduxjs/toolkit/query/react';
import { apiBaseQuery } from '@/lib/api-base-query';
import type {
  CreateStokvelRequest,
  GetStokvelByIdResponse,
  FetchStokvelsResponse,
  Stokvel,
  StokvelConstitution,
  StokvelConstitutionRequest,
  StokvelInviteResponse,
  CreateStokvelInviteRequest,
  InviteDetailsResponse,
  StokvelMembersResponse
} from './model/types';

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
    //get stokvel by id
    getStokvelById: builder.query<GetStokvelByIdResponse, { id: string }>({
      query: ({ id }) => ({
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

    downloadConstitution: builder.query<
      Blob,
      { stokvelId: string; version?: number }
    >({
      query: ({ stokvelId, version }) => ({
        url: `/stokvels/${stokvelId}/generate-constitution-pdf`,
        method: 'GET',
        params: version !== undefined ? { version } : undefined,
        // Parse as binary, not JSON — and capture the filename from headers
        responseHandler: async (response) => {
          const blob = await response.blob();
          const disposition = response.headers.get('Content-Disposition') ?? '';
          const match = disposition.match(/filename="?([^";]+)"?/);
          return Object.assign(blob, {
            _filename: match?.[1] ?? `constitution.pdf`,
          });
        },
      }),
    }),
    createStokvelInvite: builder.mutation<
      StokvelInviteResponse,
      CreateStokvelInviteRequest
    >({
      query: ({ stokvelId, ...body }) => ({
        url: `/stokvels/${stokvelId}/invites`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Stokvel"],
    }),

    getInviteByCode: builder.query<InviteDetailsResponse, string>({
      query: (code) => ({
        url: `/stokvels/${code}/get-by-code`,
        method: "GET"
      }),
      providesTags: ["Stokvel"],
    }),

    getStokvelMembers: builder.query<StokvelMembersResponse, {
      searchTerm: string;
      stokvelId: string;
      page: number;
      size: number;
    }>({
      query: ({
        searchTerm,
        stokvelId,
        page,
        size
      }) => ({
        url: `/stokvels/${stokvelId}/members`,
        method: 'GET',
        params: {
          searchTerm,
          stokvelId,
          page,
          size
        }
      }),
    }),

    updateInvite: builder.mutation<{ success: boolean }, { code: string; newInviteStatus: string }>({
      query: ({ code, newInviteStatus }) => ({
        url: `/stokvels/${code}/update-invite`,
        method: "PUT",
        body: { newInviteStatus }
      }),
      invalidatesTags: ["Stokvel"],
    }),
  }),
});

export const {
  useFetchUserStokvelsQuery,
  useGetStokvelByIdQuery,
  useLazyDownloadConstitutionQuery,
  useGetInviteByCodeQuery,
  useCreateStokvelMutation,
  useGetStokvelMembersQuery,
  useCreateStokvelInviteMutation,
  useCreateStokvelConstitutionMutation,
  useUpdateStokvelByIdMutation,
  useUpdateInviteMutation
} = stokvelApi;
