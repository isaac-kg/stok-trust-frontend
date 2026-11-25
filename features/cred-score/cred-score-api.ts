import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQuery } from "@/lib/api-base-query";

export interface CredScoreResponse {
  userId: string;
  credScore: number;
  onTimePayments: number;
  latePayments: number;
  missedPayments: number;
  rejectedPayments: number;
}

export const credScoreApi = createApi({
  reducerPath: "credScoreApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    getMyCredScore: builder.query<CredScoreResponse, void>({
      query: () => ({
        url: "/cred-score/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMyCredScoreQuery } = credScoreApi;
