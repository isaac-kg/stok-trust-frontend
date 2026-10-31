"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contribution: StokvelContribution | null;
  isAdmin: boolean;
  onUploadReceipt: (contributionId: string, file: File) => void;
  onVerify: (
    contributionId: string,
    status: Exclude<AdminVerificationStatus, "unverified">,
  ) => void;
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
        Admin verified
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        Rejected by admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
      <ShieldAlert className="h-3.5 w-3.5" />
      Not verified
    </span>
  );
}

export default function ContributionDetailModal({
  open,
  onOpenChange,
  contribution,
  isAdmin,
  onUploadReceipt,
  onVerify,
}: Props): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!contribution) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg" />
      </Dialog>
    );
  }

  const memberName = `${contribution.member.firstName} ${contribution.member.lastName}`;

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = e.target.files?.[0];
    if (!file || !contribution) return;
    setIsUploading(true);
    try {
      onUploadReceipt(contribution._id, file);
      toast.success("Receipt added (mock)");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl tracking-tight text-slate-900">
                Contribution details
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-slate-500">
                {memberName} · {contribution.periodLabel}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-5">
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
                Reference
              </dt>
              <dd className="mt-0.5 font-mono text-sm text-slate-800">
                {contribution.reference ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Due date
              </dt>
              <dd className="mt-0.5 text-sm text-slate-800">
                {formatDate(contribution.dueDate)}
              </dd>
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
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm">
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
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Receipts</h3>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" />
                  {isUploading ? "Uploading…" : "Upload receipt"}
                </Button>
              </div>
            </div>

            {contribution.receipts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
                No receipts uploaded yet
              </p>
            ) : (
              <ul className="space-y-2">
                {contribution.receipts.map((receipt: ContributionReceipt) => (
                  <li
                    key={receipt._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {receipt.fileName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {formatDate(receipt.uploadedAt)}
                          {receipt.uploadedByName
                            ? ` · ${receipt.uploadedByName}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <Button type="button" size="sm" variant="ghost" asChild>
                      <a href={receipt.url} target="_blank" rel="noreferrer">
                        View
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isAdmin && contribution.adminVerification === "unverified" && (
            <div
              className={cn(
                "flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end",
              )}
            >
              <Button
                type="button"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => onVerify(contribution._id, "rejected")}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                type="button"
                onClick={() => onVerify(contribution._id, "verified")}
              >
                <CheckCircle2 className="h-4 w-4" />
                Verify payment
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
