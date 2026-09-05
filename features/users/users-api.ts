import { createApi } from '@reduxjs/toolkit/query/react';
import { apiBaseQuery } from '@/lib/api-base-query';
import type { UpdateUserArgs, UpdateUserResponse } from './model/types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: apiBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserArgs>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
    }),
  }),
});

export const { useUpdateUserMutation } = usersApi;
