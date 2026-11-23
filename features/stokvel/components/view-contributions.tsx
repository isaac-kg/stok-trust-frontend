"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Search,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Wallet,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Table, { type TableColumn } from "@/components/shared/Table";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/components/EmptyState";
import { useAppSelector } from "@/store/hooks";
import { useGetStokvelByIdQuery } from "../stokvel-api";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";
import type {
  AdminVerificationStatus,
  ContributionPaymentStatus,
  StokvelContribution,
} from "../model/contribution-types";
import {
  useGetStokvelContributionsQuery,
  useReviewMonthlyContributionMutation,
  type StokvelContributionActivity,
} from "@/features/payments/payments-api";
import ContributionDetailModal from "./contribution-detail-modal";
import PaymentProofModal from "@/features/payments/components/payment-proof-modal";

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

function formatPeriod(value: string): string {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  return new Date(`${value}-01T00:00:00`).toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });
}

function toContribution(
  activity: StokvelContributionActivity,
): StokvelContribution {
  const proofStatus = activity.paymentProof?.status;
  let status: ContributionPaymentStatus = "Pending";
  let adminVerification: AdminVerificationStatus = "unverified";

  if (proofStatus === "rejected") {
    status = "Rejected";
    adminVerification = "rejected";
  } else if (proofStatus === "paid") {
    status = "Paid_On_Time";
    adminVerification = "verified";
  } else if (proofStatus === "pending") {
    status = "Pending_Approval";
  } else if (activity.status === "overdue") {
    status = "Missed";
  } else if (activity.status === "paid") {
    status = "Paid_On_Time";
  }

  return {
    _id: activity._id,
    stokvelId: activity.stokvel?._id ?? "",
    member: activity.member,
    amount: activity.amount,
    currency: "ZAR",
    periodLabel: formatPeriod(activity.month),
    paymentDate: activity.paidAt,
    status,
    adminVerification,
    verifiedAt: activity.paymentProof?.reviewedAt ?? undefined,
    verifiedByName: activity.paymentProof?.reviewedByName,
    verificationNote: activity.paymentProof?.note ?? undefined,
    receipts: activity.receipts,
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }
  if (typeof error === "object" && error !== null && "status" in error) {
    return `Request failed (${String(error.status)})`;
  }
  return "Could not complete the request.";
}

function VerificationPill({
  status,
}: {
  status: AdminVerificationStatus;
}): React.ReactElement {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
        <ShieldCheck className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
        <XCircle className="h-3.5 w-3.5" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
      <ShieldAlert className="h-3.5 w-3.5" />
      Unverified
    </span>
  );
}

interface ContributionCardProps {
  contribution: StokvelContribution;
  onView: (contribution: StokvelContribution) => void;
}

function ContributionCard({
  contribution,
  onView,
}: ContributionCardProps): React.ReactElement {
  const memberName = `${contribution.member.firstName} ${contribution.member.lastName}`;

  return (
    <Card className="border-slate-200/80 p-4 shadow-sm">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-900">
            {formatAmount(contribution.amount)}
          </p>
          <StatusBadge status={contribution.status} />
        </div>
        <p className="mt-1 truncate text-sm font-medium text-slate-700">
          {memberName}
        </p>
        <p className="text-xs text-slate-500">{contribution.periodLabel}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="h-3 w-3" />
          {contribution.paymentDate
            ? `Paid ${formatDate(contribution.paymentDate)}`
            : "No payment date"}
        </p>
        <div className="mt-2">
          <VerificationPill status={contribution.adminVerification} />
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          {contribution.receipts.length} proof
          {contribution.receipts.length === 1 ? "" : "s"}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-3 w-full"
        onClick={() => onView(contribution)}
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </Button>
    </Card>
  );
}

export default function StokvelContributions({
  id,
}: {
  id: string;
}): React.ReactElement {
  const user = useAppSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<StokvelContribution | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const {
    data: stokvelData,
    isLoading: isLoadingStokvel,
    error: stokvelError,
  } = useGetStokvelByIdQuery({ id });
  const {
    data: contributionData,
    isLoading: isLoadingContributions,
    error: contributionError,
  } = useGetStokvelContributionsQuery(id);
  const [reviewContribution] = useReviewMonthlyContributionMutation();

  const stokvel = stokvelData?.stokvel;
  const contributions = useMemo(
    () => (contributionData?.data ?? []).map(toContribution),
    [contributionData],
  );
  const isStokvelAdmin = contributionData?.canReview ?? false;
  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return contributions;
    return contributions.filter((contribution) => {
      const name =
        `${contribution.member.firstName} ${contribution.member.lastName}`.toLowerCase();
      return (
        name.includes(query) ||
        contribution.periodLabel.toLowerCase().includes(query) ||
        contribution.status.toLowerCase().includes(query)
      );
    });
  }, [contributions, searchTerm]);

  function openDetail(contribution: StokvelContribution): void {
    setSelected(contribution);
    setDetailOpen(true);
  }

  async function handleReview(
    contributionId: string,
    status: Exclude<AdminVerificationStatus, "unverified">,
    reason: string,
  ): Promise<boolean> {
    try {
      await reviewContribution({
        stokvelId: id,
        contributionId,
        decision: status === "verified" ? "approve" : "reject",
        reason: reason || undefined,
      }).unwrap();
      toast.success(
        status === "verified" ? "Payment approved." : "Payment rejected.",
      );
      setDetailOpen(false);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  }

  if (isLoadingStokvel || isLoadingContributions) {
    return <Loader message="Loading stokvel payments…" />;
  }
  if (stokvelError || contributionError || !stokvel) {
    return (
      <ErrorState
        message={getErrorMessage(contributionError ?? stokvelError)}
      />
    );
  }

  const columns: TableColumn<StokvelContribution>[] = [
    {
      key: "member",
      header: "Member",
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-900">
            {row.member.firstName} {row.member.lastName}
          </p>
          <p className="text-xs text-slate-500">{row.member.email ?? "—"}</p>
        </div>
      ),
    },
    { key: "periodLabel", header: "Period" },
    {
      key: "amount",
      header: "Amount",
      render: (_, row) => (
        <span className="font-semibold text-slate-900">
          {formatAmount(row.amount)}
        </span>
      ),
    },
    {
      key: "paymentDate",
      header: "Date paid",
      render: (_, row) => formatDate(row.paymentDate),
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => <StatusBadge status={row.status} />,
    },
    {
      key: "adminVerification",
      header: "Admin",
      render: (_, row) => (
        <VerificationPill status={row.adminVerification} />
      ),
    },
    {
      key: "receipts",
      header: "Proofs",
      render: (_, row) => (
        <span className="text-xs text-slate-500">
          {row.receipts.length || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => openDetail(row)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <ContributionDetailModal
        key={selected?._id ?? "none"}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        contribution={selected}
        isAdmin={isStokvelAdmin}
        currentUserId={user?._id}
        onVerify={handleReview}
      />
      <PaymentProofModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        stokvels={[stokvel]}
        fixedStokvelId={id}
      />

      <div className="mb-6">
        <Button variant="ghost" size="sm" className="-ml-4 mb-4" asChild>
          <Link href={`/dashboard/stokvel/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Stokvel
          </Link>
        </Button>

        <Card className="overflow-hidden border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Payments
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    <Wallet className="h-3 w-3" />
                    {filtered.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Payments for {stokvel.name}
                </p>
              </div>
              <Button
                type="button"
                className="w-full shrink-0 sm:w-auto"
                onClick={() => setUploadOpen(true)}
              >
                <Upload className="h-4 w-4" />
                Upload payment proof
              </Button>
            </div>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search member, period, status…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </Card>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Wallet className="h-8 w-8 text-slate-400" />}
          title={searchTerm ? "No matching payments" : "No payments yet"}
          description={
            searchTerm
              ? "Try a different member, period, or status."
              : "Submitted payments and proofs will appear here."
          }
        />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {filtered.map((contribution) => (
              <ContributionCard
                key={contribution._id}
                contribution={contribution}
                onView={openDetail}
              />
            ))}
          </div>
          <div className="hidden md:block">
            <Table columns={columns} data={filtered} />
          </div>
        </>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <Upload className="h-3.5 w-3.5" />
        Open a payment to view its proof and review notes. Only other members&apos;
        payments can be approved by a stokvel admin.
      </p>
    </div>
  );
}
