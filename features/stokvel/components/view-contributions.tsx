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
import { getMockContributions } from "../model/mock-contributions";
import type {
  AdminVerificationStatus,
  StokvelContribution,
} from "../model/contribution-types";
import ContributionDetailModal from "./contribution-detail-modal";
import RecordContributionModal, {
  type RecordContributionSubmitValues,
} from "./record-contribution-modal";
import { cn } from "@/lib/utils";

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
      <div className="flex items-start justify-between gap-3">
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
            Paid {formatDate(contribution.paymentDate)}
          </p>
          <div className="mt-2">
            <VerificationPill status={contribution.adminVerification} />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {contribution.receipts.length} receipt
            {contribution.receipts.length === 1 ? "" : "s"}
          </p>
        </div>
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
  const [recordOpen, setRecordOpen] = useState(false);
  const [contributions, setContributions] = useState<StokvelContribution[]>(
    () => getMockContributions(id),
  );

  const { data, isLoading, error } = useGetStokvelByIdQuery({ id: id ?? "" });

  const stokvel = data?.stokvel;
  const isStokvelAdmin = (stokvel?.adminIds ?? []).includes(user?._id ?? "");

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return contributions;
    return contributions.filter((c) => {
      const name = `${c.member.firstName} ${c.member.lastName}`.toLowerCase();
      return (
        name.includes(q) ||
        c.periodLabel.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        (c.reference ?? "").toLowerCase().includes(q)
      );
    });
  }, [contributions, searchTerm]);

  function openDetail(contribution: StokvelContribution): void {
    setSelected(contribution);
    setDetailOpen(true);
  }

  function handleRecordContribution(
    values: RecordContributionSubmitValues,
  ): void {
    const memberName =
      `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}`.trim() ||
      "You";
    const [firstName, ...rest] = memberName.split(" ");
    const lastName = rest.join(" ") || "";
    const receipts = values.receiptFile
      ? [
          {
            _id: `rcpt_${Date.now()}`,
            fileName: values.receiptFile.name,
            url: URL.createObjectURL(values.receiptFile),
            uploadedAt: new Date().toISOString(),
            uploadedByName: memberName,
          },
        ]
      : [];

    const next: StokvelContribution = {
      _id: `contrib_${Date.now()}`,
      stokvelId: id,
      member: {
        userId: user?._id ?? "me",
        firstName: firstName || "You",
        lastName,
        email: user?.profile?.email,
      },
      amount: values.amount,
      currency: "ZAR",
      periodLabel: values.periodLabel,
      paymentDate: values.paymentDate,
      status: "Pending_Approval",
      adminVerification: "unverified",
      reference: values.reference,
      receipts,
    };

    setContributions((prev) => [next, ...prev]);
    toast.success("Contribution submitted — awaiting admin verification");
  }

  function handleUploadReceipt(contributionId: string, file: File): void {
    setContributions((prev) =>
      prev.map((c) => {
        if (c._id !== contributionId) return c;
        const nextReceipt = {
          _id: `rcpt_${Date.now()}`,
          fileName: file.name,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString(),
          uploadedByName:
            `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}`.trim() ||
            "You",
        };
        const updated = {
          ...c,
          receipts: [...c.receipts, nextReceipt],
          status:
            c.status === "Missed" || c.status === "Pending"
              ? ("Pending_Approval" as const)
              : c.status,
          adminVerification: "unverified" as const,
        };
        setSelected(updated);
        return updated;
      }),
    );
  }

  function handleVerify(
    contributionId: string,
    status: Exclude<AdminVerificationStatus, "unverified">,
  ): void {
    setContributions((prev) =>
      prev.map((c) => {
        if (c._id !== contributionId) return c;
        const updated: StokvelContribution = {
          ...c,
          adminVerification: status,
          verifiedAt: new Date().toISOString().slice(0, 10),
          verifiedByName:
            `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}`.trim() ||
            "Admin",
          status:
            status === "verified"
              ? c.status === "Pending_Approval"
                ? "Paid_On_Time"
                : c.status
              : "Rejected",
          verificationNote:
            status === "rejected"
              ? "Rejected by admin — please re-upload a clearer receipt"
              : c.verificationNote,
        };
        setSelected(updated);
        return updated;
      }),
    );
    toast.success(
      status === "verified" ? "Payment verified" : "Payment rejected",
    );
  }

  if (isLoading) return <Loader message="Loading contributions…" />;
  if (error || !stokvel) {
    const message =
      error && "status" in error
        ? `Request failed (${error.status})`
        : "Could not load stokvel";
    return <ErrorState message={message} />;
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
    {
      key: "periodLabel",
      header: "Period",
    },
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
      header: "Receipts",
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
        open={detailOpen}
        onOpenChange={setDetailOpen}
        contribution={selected}
        isAdmin={isStokvelAdmin}
        onUploadReceipt={handleUploadReceipt}
        onVerify={handleVerify}
      />
      <RecordContributionModal
        open={recordOpen}
        onOpenChange={setRecordOpen}
        defaultAmount={stokvel.monthlyContribution}
        onSubmit={handleRecordContribution}
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
                    Contributions
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    <Wallet className="h-3 w-3" />
                    {filtered.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {stokvel.name
                    ? `Payments for ${stokvel.name}`
                    : "Stokvel contribution ledger"}
                </p>
                <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
                  Mock data for UI review — wire to{" "}
                  <code className="rounded bg-amber-100 px-1">
                    GET /stokvels/:id/contributions
                  </code>
                </p>
              </div>
              <Button
                type="button"
                className="w-full shrink-0 sm:w-auto"
                onClick={() => setRecordOpen(true)}
              >
                <Upload className="h-4 w-4" />
                Record contribution
              </Button>
            </div>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search member, period, status…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </Card>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Wallet className="h-8 w-8 text-slate-400" />}
          title={searchTerm ? "No matching contributions" : "No contributions yet"}
          description={
            searchTerm
              ? "Try a different name, period, or status"
              : "Use Record contribution above to submit your first payment"
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

      <p
        className={cn(
          "mt-4 flex items-center gap-2 text-xs text-slate-400",
        )}
      >
        <Upload className="h-3.5 w-3.5" />
        Open a row to view details, upload receipts, and (as admin) verify
        payments.
      </p>
    </div>
  );
}
