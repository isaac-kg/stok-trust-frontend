"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import type {
  AdminVerificationStatus,
  ContributionReceipt,
  StokvelContribution,
} from "../model/contribution-types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contribution: StokvelContribution | null;
  isAdmin: boolean;
  currentUserId?: string;
  onVerify: (
    contributionId: string,
    status: Exclude<AdminVerificationStatus, "unverified">,
    reason: string,
  ) => Promise<boolean>;
}

function formatAmount(amount: number): string {
  return `R${amount.toLocaleString("en-ZA")}`;
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

function VerificationBadge({
  status,
}: {
  status: AdminVerificationStatus;
}): React.ReactElement {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <ShieldCheck className="h-3.5 w-3.5" />
        Admin approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
      <ShieldAlert className="h-3.5 w-3.5" />
      Awaiting review
    </span>
  );
}

export default function ContributionDetailModal({
  open,
  onOpenChange,
  contribution,
  isAdmin,
  currentUserId,
  onVerify,
}: Props): React.ReactElement {
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewReason, setReviewReason] = useState("");

  function handleOpenChange(next: boolean): void {
    if (!next) setReviewReason("");
    onOpenChange(next);
  }

  if (!contribution) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg" />
      </Dialog>
    );
  }

  const memberName = `${contribution.member.firstName} ${contribution.member.lastName}`;
  const contributionId = contribution._id;
  const isOwnPayment = contribution.member.userId === currentUserId;
  const canReview =
    isAdmin &&
    !isOwnPayment &&
    contribution.status === "Pending_Approval" &&
    contribution.receipts.length > 0;

  async function handleReview(
    status: Exclude<AdminVerificationStatus, "unverified">,
  ): Promise<void> {
    setIsReviewing(true);
    try {
      const succeeded = await onVerify(
        contributionId,
        status,
        reviewReason.trim(),
      );
      if (succeeded) setReviewReason("");
    } finally {
      setIsReviewing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-x-hidden overflow-y-auto sm:max-w-lg">
        <div className="w-full min-w-0 border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl tracking-tight text-slate-900">
                Payment details
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-slate-500">
                {memberName} · {contribution.periodLabel}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className="w-full min-w-0 space-y-5 px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-2xl font-bold text-slate-900">
              {formatAmount(contribution.amount)}
            </p>
            <StatusBadge status={contribution.status} />
            <VerificationBadge status={contribution.adminVerification} />
          </div>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Member
              </dt>
              <dd className="mt-0.5 text-sm text-slate-800">{memberName}</dd>
              {contribution.member.email && (
                <dd className="text-xs text-slate-500">
                  {contribution.member.email}
                </dd>
              )}
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Date paid
              </dt>
              <dd className="mt-0.5 text-sm text-slate-800">
                {formatDate(contribution.paymentDate)}
              </dd>
            </div>
          </dl>

          {(contribution.verifiedByName || contribution.verificationNote) && (
            <div className="min-w-0 break-words rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm">
              {contribution.verifiedByName && (
                <p className="text-slate-700">
                  Reviewed by{" "}
                  <span className="font-medium">
                    {contribution.verifiedByName}
                  </span>
                  {contribution.verifiedAt
                    ? ` on ${formatDate(contribution.verifiedAt)}`
                    : ""}
                </p>
              )}
              {contribution.verificationNote && (
                <p className="mt-1 text-slate-600">
                  {contribution.verificationNote}
                </p>
              )}
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Payment proofs
            </h3>
            {contribution.receipts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
                No proof uploaded yet
              </p>
            ) : (
              <ul className="min-w-0 space-y-2">
                {contribution.receipts.map((receipt: ContributionReceipt) => (
                  <li
                    key={receipt._id}
                    className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                      <div className="min-w-0 flex-1">
                        <p
                          className="block min-w-0 max-w-full truncate text-sm font-medium text-slate-800"
                          title={receipt.fileName}
                        >
                          {receipt.fileName}
                        </p>
                        <p className="truncate text-[11px] text-slate-500">
                          {formatDate(receipt.uploadedAt)}
                          {receipt.uploadedByName
                            ? ` · ${receipt.uploadedByName}`
                            : ""}
                        </p>
                        {receipt.note && (
                          <p className="mt-1 break-words text-xs text-red-600">
                            {receipt.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="shrink-0"
                      asChild
                    >
                      <a href={receipt.url} target="_blank" rel="noreferrer">
                        View
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {canReview && (
            <div className="min-w-0 space-y-3 border-t border-slate-100 pt-4">
              <label
                htmlFor={`review-reason-${contribution._id}`}
                className="text-sm font-medium text-slate-800"
              >
                Review note{" "}
                <span className="font-normal text-slate-500">
                  (required to reject)
                </span>
              </label>
              <textarea
                key={contribution._id}
                id={`review-reason-${contribution._id}`}
                maxLength={500}
                rows={3}
                value={reviewReason}
                onChange={(event) => setReviewReason(event.target.value)}
                placeholder="Explain why this payment is being rejected"
                className="w-full resize-y rounded-md border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => void handleReview("rejected")}
                  disabled={isReviewing || !reviewReason.trim()}
                >
                  <XCircle className="h-4 w-4" />
                  {isReviewing ? "Saving…" : "Reject"}
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleReview("verified")}
                  disabled={isReviewing}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isReviewing ? "Saving…" : "Approve payment"}
                </Button>
              </div>
            </div>
          )}

          {isAdmin && isOwnPayment && contribution.status === "Pending_Approval" && (
            <p className="min-w-0 break-words whitespace-normal rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              You can&apos;t approve or reject your own payment. Ask another
              stokvel admin to review it.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
