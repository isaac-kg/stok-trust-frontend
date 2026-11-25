/**
 * Personal / cross-stokvel payment inbox contract.
 *
 * The inbox adapts GET /monthly-contribution/me into these card items.
 */

export type MyPaymentType = "contribution" | "payout";

/** Aligns with StatusBadge keys used in the UI. */
export type MyPaymentStatus =
  | "Pending"
  | "Paid_On_Time"
  | "Paid_Late"
  | "Missed"
  | "Pending_Approval"
  | "Approved"
  | "Rejected"
  | "Paid";

export interface MyPaymentItem {
  _id: string;
  /** contribution = money member pays in; payout = money member receives */
  type: MyPaymentType;
  status: MyPaymentStatus;
  amount: number;
  currency: "ZAR";
  /** Period this payment belongs to, e.g. "2026-10" or "October 2026" */
  periodLabel: string;
  dueDate?: string;
  paidAt?: string;
  stokvel: {
    _id: string;
    name: string;
  };
  /** Short helper for the card, e.g. "Awaiting admin verification" */
  note?: string;
}

export interface MyPaymentsResponse {
  data: MyPaymentItem[];
  meta?: {
    page?: number;
    size?: number;
    total?: number;
  };
}
