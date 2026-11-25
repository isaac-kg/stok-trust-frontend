"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Upload,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";
import { useFetchUserStokvelsQuery } from "@/features/stokvel/stokvel-api";
import type { Stokvel } from "@/features/stokvel/model/types";
import type { MonthlyContributionActivity } from "../payments-api";
import type { MyPaymentItem } from "../model/types";
import { useGetMyMonthlyContributionsQuery } from "../payments-api";
import PaymentProofModal from "./payment-proof-modal";
import { cn } from "@/lib/utils";

function formatAmount(amount: number, currency: string = "ZAR"): string {
  return `R${amount.toLocaleString("en-ZA")}${currency === "ZAR" ? "" : ` ${currency}`}`;
}

function formatDate(value?: string): string | null {
  if (!value) return null;
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
  const date = new Date(`${value}-01T00:00:00`);
  return date.toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });
}

function toPaymentItem(payment: MonthlyContributionActivity): MyPaymentItem {
  let status: MyPaymentItem["status"] = "Pending";
  if (payment.paymentProof?.status === "rejected") {
    status = "Rejected";
  } else if (payment.paymentProof?.status === "pending") {
    status = "Pending_Approval";
  } else if (
    payment.paymentProof?.status === "paid" ||
    payment.status === "paid"
  ) {
    status = "Paid";
  } else if (
    payment.paymentProof?.status === "overdue" ||
    payment.status === "overdue"
  ) {
    status = "Missed";
  }

  return {
    _id: payment._id,
    type: "contribution",
    status,
    amount: payment.amount,
    currency: "ZAR",
    periodLabel: formatPeriod(payment.month),
    paidAt: payment.paidAt,
    stokvel: payment.stokvel ?? { _id: payment._id, name: "Stokvel" },
    note:
      status === "Pending_Approval"
        ? "Proof submitted — awaiting admin verification"
        : status === "Rejected"
          ? payment.paymentProof?.note ?? "Payment proof rejected"
          : undefined,
  };
}

function PaymentCard({ payment }: { payment: MyPaymentItem }): React.ReactElement {
  const isContribution = payment.type === "contribution";
  const paidLabel = formatDate(payment.paidAt);

  return (
    <Card className="h-full border-slate-200/80 p-4 shadow-sm transition hover:border-emerald-200">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            isContribution
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700",
          )}
        >
          {isContribution ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownLeft className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">
              {formatAmount(payment.amount, payment.currency)}
            </p>
            <StatusBadge status={payment.status} />
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Contribution
            </span>
          </div>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {payment.stokvel.name}
          </p>
          <p className="text-xs text-slate-500">{payment.periodLabel}</p>

          {paidLabel && (
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Paid {paidLabel}
              </span>
            </p>
          )}

          {payment.note && (
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {payment.note}
            </p>
          )}

          <div className="mt-3">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/dashboard/stokvel/${payment.stokvel._id}`}>
                Open stokvel
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "status" in error) {
    return `Request failed (${String(error.status)})`;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return "Something went wrong";
}

export function PaymentsInbox(): React.ReactElement {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    data: stokvelData,
    isLoading: isLoadingStokvels,
    error: stokvelError,
  } = useFetchUserStokvelsQuery({
    searchTerm: "",
    roleFilter: "all",
    page: 1,
    size: 50,
  });
  const {
    data: activityData,
    isLoading: isLoadingPayments,
    error: paymentError,
  } = useGetMyMonthlyContributionsQuery();

  if (isLoadingStokvels || isLoadingPayments) {
    return <Loader message="Loading your payments…" />;
  }
  if (stokvelError || paymentError) {
    return (
      <ErrorState
        message={getErrorMessage(paymentError ?? stokvelError)}
      />
    );
  }

  const stokvels: Stokvel[] = stokvelData?.data ?? [];
  const payments = (activityData?.data ?? []).map(toPaymentItem);
  const latestPayments = payments.slice(0, 5);
  const dueCount = payments.filter(
    (payment) => payment.status === "Pending",
  ).length;
  const awaitingCount = payments.filter(
    (payment) => payment.status === "Pending_Approval",
  ).length;

  function scrollCarousel(direction: "previous" | "next"): void {
    carouselRef.current?.scrollBy({
      left:
        (direction === "next" ? 1 : -1) *
        (carouselRef.current?.clientWidth ?? 0),
      behavior: "smooth",
    });
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Payments
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your contributions and payment proofs across your stokvels.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          disabled={stokvels.length === 0}
        >
          <Upload className="h-4 w-4" />
          Upload proof of payment
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-slate-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Pending contributions
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{dueCount}</p>
        </Card>
        <Card className="border-slate-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Awaiting verification
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {awaitingCount}
          </p>
        </Card>
        <Card className="border-slate-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Upcoming payouts
          </p>
          <p
            className="mt-1 text-2xl font-bold text-slate-900"
            aria-label="Payout activity is not available"
          >
            —
          </p>
        </Card>
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-900">
              Your payment activity
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {!showAll && latestPayments.length > 1 && (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label="Previous payments"
                  onClick={() => scrollCarousel("previous")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label="Next payments"
                  onClick={() => scrollCarousel("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? "Show latest" : "View all"}
            </Button>
          </div>
        </div>

        {payments.length === 0 ? (
          <Card className="border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No payment activity yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Submitted payment proofs will appear here.
            </p>
          </Card>
        ) : showAll ? (
          <div className="grid gap-3 md:grid-cols-2">
            {payments.map((payment) => (
              <PaymentCard key={payment._id} payment={payment} />
            ))}
          </div>
        ) : (
          <div>
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Latest payment activity"
            >
              {latestPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="w-full shrink-0 snap-start sm:w-[calc(50%-0.375rem)]"
                >
                  <PaymentCard payment={payment} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {stokvels.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Contribute inside a stokvel
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {stokvels.map((stokvel) => (
              <Card
                key={stokvel._id}
                className="border-slate-200/80 p-4 shadow-sm transition hover:border-emerald-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {stokvel.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {[stokvel.type, stokvel.contributionFrequency]
                        .filter(Boolean)
                        .join(" · ") || "Open group"}
                      {stokvel.monthlyContribution != null
                        ? ` · R${stokvel.monthlyContribution.toLocaleString()}`
                        : ""}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/stokvel/${stokvel._id}`}>
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <PaymentProofModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        stokvels={stokvels}
      />
    </div>
  );
}
