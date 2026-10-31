/**
 * Personal pending-invites inbox contract.
 *
 * Suggested backend endpoints:
 *   GET  /users/me/invites
 *        Query (optional): ?status=pending|accepted|declined&page=&size=
 *   GET  /users/me/invites/:id   (optional detail — or embed full stokvel+constitution in list)
 *
 * Accept / decline (already exists by code):
 *   PUT /stokvels/:code/update-invite  { newInviteStatus: "accepted" | "declined" }
 *
 * Response shape:
 *   { data: MyInviteItem[]; meta?: { page; size; total } }
 *
 * After accept: remove from pending list; stokvel appears in GET user stokvels.
 * After decline: remove from pending list (or filter status=declined if you keep history).
 */

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
  };
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
