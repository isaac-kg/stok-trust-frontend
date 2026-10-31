"use client";

import { Calendar, FileText, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { MyInviteItem } from "../model/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invite: MyInviteItem | null;
  onAccept: (invite: MyInviteItem) => void;
  onDecline: (invite: MyInviteItem) => void;
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const CONSTITUTION_FIELDS: {
  key: keyof NonNullable<MyInviteItem["constitution"]>;
  label: string;
}[] = [
  { key: "purpose", label: "Purpose" },
  { key: "membershipRules", label: "Membership" },
  { key: "contributionRules", label: "Contributions" },
  { key: "payoutRules", label: "Payouts" },
];

export function InviteDetailModal({
  open,
  onOpenChange,
  invite,
  onAccept,
  onDecline,
}: Props): React.ReactElement {
  if (!invite) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg" />
      </Dialog>
    );
  }

  const invitedBy = invite.invitedBy
    ? `${invite.invitedBy.firstName} ${invite.invitedBy.lastName}`
    : null;
  const contributionLabel =
    invite.stokvel.monthlyContribution != null
      ? `R${invite.stokvel.monthlyContribution.toLocaleString("en-ZA")}${
          invite.stokvel.contributionFrequency
            ? ` · ${invite.stokvel.contributionFrequency}`
            : ""
        }`
      : null;

  const constitutionEntries = CONSTITUTION_FIELDS.filter(
    (field) => invite.constitution?.[field.key],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl tracking-tight text-slate-900">
                  {invite.stokvel.name}
                </DialogTitle>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  Pending
                </span>
              </div>
              <DialogDescription className="mt-1.5 text-slate-500">
                Review this stokvel before you accept or decline the invite.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          {invite.stokvel.description ? (
            <p className="text-sm text-slate-700">{invite.stokvel.description}</p>
          ) : null}

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {invite.stokvel.type ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Type
                </dt>
                <dd className="mt-0.5 text-sm font-medium capitalize text-slate-900">
                  {invite.stokvel.type}
                </dd>
              </div>
            ) : null}
            {contributionLabel ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Contribution
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">
                  {contributionLabel}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Invited by
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {invitedBy ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Invite code
              </dt>
              <dd className="mt-0.5 font-mono text-sm tracking-wide text-slate-900">
                {invite.inviteCode}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Sent
              </dt>
              <dd className="mt-0.5 flex items-center gap-1 text-sm text-slate-900">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(invite.invitedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Expires
              </dt>
              <dd className="mt-0.5 text-sm text-slate-900">
                {formatDate(invite.expiresAt)}
              </dd>
            </div>
          </dl>

          {constitutionEntries.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Constitution
                  {invite.constitution?.version
                    ? ` · v${invite.constitution.version}`
                    : ""}
                </h3>
              </div>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                {constitutionEntries.map((field) => (
                  <div key={field.key}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {field.label}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                      {invite.constitution?.[field.key]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              No constitution summary on this invite — Accept will open the full
              join flow.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onDecline(invite)}
          >
            Decline
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => onAccept(invite)}
          >
            Accept invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
