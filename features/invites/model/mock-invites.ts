import type { MyInviteItem } from "./types";

/** Temporary mock rows so UI + backend contract can be reviewed together. */
export const MOCK_MY_INVITES: MyInviteItem[] = [
  {
    _id: "inv_mock_001",
    inviteCode: "8E8C6691",
    status: "pending",
    invitedAt: "2026-10-28T10:15:00.000Z",
    expiresAt: "2026-11-28T10:15:00.000Z",
    invitee: {
      firstName: "Member",
      lastName: "One",
      email: "member1@example.com",
    },
    stokvel: {
      _id: "stok_mock_a",
      name: "December Club MOCK_MY_INVITES December Club MOCK_MY_INVITES",
      description: "Year-end savings for December groceries and gifts Year-end savings for December groceries and gifts..",
      type: "savings",
      monthlyContribution: 500,
      contributionFrequency: "monthly",
    },
    invitedBy: {
      firstName: "Admin",
      lastName: "Tester joe role roger that",
    },
    constitution: {
      version: 1,
      purpose:
        "Members save together each month and share a lump-sum payout in December.",
      membershipRules:
        "Members must be invited by an admin and accept the constitution.",
      contributionRules:
        "R500 due on the 1st of each month. Late payments incur a R50 fine.",
      payoutRules:
        "Payouts rotate among members in joining order, subject to verified contributions.",
    },
  },
  {
    _id: "inv_mock_002",
    inviteCode: "A41F2B09",
    status: "pending",
    invitedAt: "2026-10-30T08:00:00.000Z",
    invitee: {
      firstName: "Member",
      lastName: "One",
      email: "member1@example.com",
    },
    stokvel: {
      _id: "stok_mock_b",
      name: "Family Burial",
      description: "Mutual support for funeral costs.",
      type: "burial",
      monthlyContribution: 300,
      contributionFrequency: "monthly",
    },
    invitedBy: {
      firstName: "Thandi",
      lastName: "Mokoena",
    },
    constitution: {
      version: 2,
      purpose:
        "Provide financial support to members' families in the event of a death.",
      membershipRules: "Open to family members aged 18+ who live in Gauteng.",
      contributionRules: "R300 monthly. Missed payments pause cover until caught up.",
      payoutRules: "Claims are paid within 7 days after admin verification.",
    },
  },
  {
    _id: "inv_mock_003",
    inviteCode: "C7D019EE",
    status: "pending",
    invitedAt: "2026-10-25T14:40:00.000Z",
    expiresAt: "2026-11-10T14:40:00.000Z",
    invitee: {
      firstName: "Member",
      lastName: "One",
      email: "member1@example.com",
    },
    stokvel: {
      _id: "stok_mock_c",
      name: "Soweto Sisters Savings",
      description: "Monthly rotating savings circle.",
      type: "savings",
      monthlyContribution: 200,
      contributionFrequency: "monthly",
    },
    constitution: {
      version: 1,
      purpose: "Rotating savings to help each sister reach personal goals.",
      membershipRules: "Women-only circle; max 12 active members.",
      contributionRules: "R200 by the 5th of each month.",
      payoutRules: "One member receives the pot each month by agreed schedule.",
    },
  },
];
