/**
 * Stokvel-scoped contributions (group ledger).
 *
 * Backend:
 *   GET   /monthly-contribution/stokvel/:stokvelId
 *   POST  /monthly-contribution (multipart proof upload)
 *   PATCH /monthly-contribution/:contributionId/review
 */

export type ContributionPaymentStatus =
  | "Pending"
  | "Pending_Approval"
  | "Paid_On_Time"
  | "Paid_Late"
  | "Missed"
  | "Rejected";

export type AdminVerificationStatus =
  | "unverified"
  | "verified"
  | "rejected";

export interface ContributionReceipt {
  _id: string;
  fileName: string;
  url: string;
  uploadedAt: string;
  note?: string | null;
  reviewedAt?: string | null;
  reviewedByName?: string;
  uploadedByName?: string;
}

export interface StokvelContribution {
  _id: string;
  stokvelId: string;
  member: {
    userId: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  amount: number;
  currency: "ZAR";
  periodLabel: string;
  paymentDate?: string;
  dueDate?: string;
  status: ContributionPaymentStatus;
  adminVerification: AdminVerificationStatus;
  verifiedAt?: string;
  verifiedByName?: string;
  verificationNote?: string;
  receipts: ContributionReceipt[];
  reference?: string;
}

export interface StokvelContributionsResponse {
  stokvel: { _id: string; name: string };
  canReview: boolean;
  data: StokvelContribution[];
}
