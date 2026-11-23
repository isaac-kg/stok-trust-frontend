export type MyInviteStatus = "pending" | "accepted" | "declined";

export interface MyInviteConstitutionSummary {
  version?: number;
  purpose?: string;
  membershipRules?: string;
  contributionRules?: string;
  payoutRules?: string;
}

export interface MyInviteItem {
  _id: string;
  inviteCode: string;
  status: MyInviteStatus;
  invitedAt: string;
  expiresAt?: string;
  /** Person the invite was sent to (should match logged-in user's email). */
  invitee: {
    firstName: string;
    lastName: string;
    email: string;
  };
  stokvel: {
    _id: string;
    name: string;
    description?: string;
    type?: string;
    monthlyContribution?: number;
    contributionFrequency?: string;
  } | null;
  /** Optional: who sent the invite (admin). */
  invitedBy?: {
    firstName: string;
    lastName: string;
  };
  /** Constitution summary so the invitee can review before Accept. */
  constitution?: MyInviteConstitutionSummary | null;
}

export interface MyInvitesResponse {
  data: MyInviteItem[];
  meta?: {
    page?: number;
    size?: number;
    total?: number;
  };
}
