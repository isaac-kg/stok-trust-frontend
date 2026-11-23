import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQuery } from "@/lib/api-base-query";

export interface MonthlyContributionActivity {
  _id: string;
  stokvelId: string;
  amount: number;
  month: string;
  status: "pending" | "paid" | "overdue";
  paidAt?: string;
  createdAt: string;
  stokvel: { _id: string; name: string } | null;
  paymentProof: PaymentProofActivity | null;
}

export interface PaymentProofActivity {
  _id: string;
  status: "pending" | "paid" | "overdue" | "rejected";
  fileUrl: string;
  fileName: string;
  note?: string | null;
  reviewedBy?: string | null;
  reviewedByName?: string;
  reviewedAt?: string | null;
  createdAt: string;
}

interface MonthlyContributionActivityResponse {
  data: MonthlyContributionActivity[];
}

export interface StokvelContributionActivity extends MonthlyContributionActivity {
  member: {
    userId: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  receipts: {
    _id: string;
    fileName: string;
    url: string;
    uploadedAt: string;
    note?: string | null;
    reviewedAt?: string | null;
    reviewedByName?: string;
    uploadedByName?: string;
  }[];
}

export interface StokvelContributionsResponse {
  stokvel: { _id: string; name: string };
  canReview: boolean;
  data: StokvelContributionActivity[];
}

export interface CreateMonthlyContributionRequest {
  stokvelId: string;
  month: string;
  amount: number;
  proof: File;
}

export interface ReviewMonthlyContributionRequest {
  stokvelId: string;
  contributionId: string;
  decision: "approve" | "reject";
  reason?: string;
}

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["PaymentActivity", "StokvelContributions"],
  endpoints: (builder) => ({
    getMyMonthlyContributions: builder.query<
      MonthlyContributionActivityResponse,
      void
    >({
      query: () => ({
        url: "/monthly-contribution/me",
        method: "GET",
      }),
      providesTags: ["PaymentActivity"],
    }),
    getStokvelContributions: builder.query<
      StokvelContributionsResponse,
      string
    >({
      query: (stokvelId) => ({
        url: `/monthly-contribution/stokvel/${stokvelId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, stokvelId) => [
        { type: "StokvelContributions", id: stokvelId },
      ],
    }),
    createMonthlyContribution: builder.mutation<
      MonthlyContributionActivity,
      CreateMonthlyContributionRequest
    >({
      query: ({ proof, ...fields }) => {
        const body = new FormData();
        body.append("stokvelId", fields.stokvelId);
        body.append("month", fields.month);
        body.append("amount", String(fields.amount));
        body.append("proof", proof);
        return {
          url: "/monthly-contribution",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["PaymentActivity", "StokvelContributions"],
    }),
    reviewMonthlyContribution: builder.mutation<
      unknown,
      ReviewMonthlyContributionRequest
    >({
      query: ({ contributionId, decision, reason }) => ({
        url: `/monthly-contribution/${contributionId}/review`,
        method: "PATCH",
        body:
          decision === "approve"
            ? { decision, approvalNote: reason }
            : { decision, reason },
      }),
      invalidatesTags: (_result, _error, { stokvelId }) => [
        "PaymentActivity",
        { type: "StokvelContributions", id: stokvelId },
      ],
    }),
  }),
});

export const {
  useGetMyMonthlyContributionsQuery,
  useGetStokvelContributionsQuery,
  useCreateMonthlyContributionMutation,
  useReviewMonthlyContributionMutation,
} = paymentsApi;
