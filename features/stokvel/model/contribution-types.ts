/**
 * Stokvel-scoped contributions (group ledger).
 *
 * Suggested backend:
 *   GET  /stokvels/:stokvelId/contributions
 *   POST /stokvels/:stokvelId/contributions              { amount, periodLabel, paymentDate, reference? }
 *   POST /stokvels/:stokvelId/contributions/:id/receipts  (multipart)
 *   PUT  /stokvels/:stokvelId/contributions/:id/verify     { verified: boolean, note? }
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
  /** URL or object URL for preview (mock uses placeholder) */
  url: string;
  uploadedAt: string;
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
  contributions: StokvelContribution[];
  meta?: { page?: number; size?: number; total?: number };
}
