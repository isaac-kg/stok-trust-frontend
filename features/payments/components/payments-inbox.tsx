"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";
import { useFetchUserStokvelsQuery } from "@/features/stokvel/stokvel-api";
import type { Stokvel } from "@/features/stokvel/model/types";
import { MOCK_MY_PAYMENTS } from "../model/mock-payments";
import type { MyPaymentItem } from "../model/types";
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

function PaymentCard({ payment }: { payment: MyPaymentItem }): React.ReactElement {
  const isContribution = payment.type === "contribution";
  const dueLabel = formatDate(payment.dueDate);
  const paidLabel = formatDate(payment.paidAt);

  return (
    <Card className="border-slate-200/80 p-4 shadow-sm transition hover:border-emerald-200">
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
              {isContribution ? "Contribution" : "Payout"}
            </span>
          </div>

          <p className="mt-1 truncate text-sm font-medium text-slate-700">
            {payment.stokvel.name}
          </p>
          <p className="text-xs text-slate-500">{payment.periodLabel}</p>

          {(dueLabel || paidLabel) && (
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              {dueLabel && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due {dueLabel}
                </span>
              )}
              {paidLabel && <span>Paid {paidLabel}</span>}
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

export function PaymentsInbox(): React.ReactElement {
  const { data, isLoading, error } = useFetchUserStokvelsQuery({
    searchTerm: "",
    roleFilter: "all",
    page: 1,
    size: 50,
  });

  if (isLoading) return <Loader message="Loading your payments…" />;
  if (error) {
    const message =
      "status" in error
        ? `Request failed (${error.status})`
        : (error.message ?? "Something went wrong");
    return <ErrorState message={message} />;
  }

  const stokvels: Stokvel[] = data?.data ?? [];
  const payments = MOCK_MY_PAYMENTS;
  const dueCount = payments.filter(
    (p) => p.type === "contribution" && p.status === "Pending",
  ).length;
  const awaitingCount = payments.filter(
    (p) => p.status === "Pending_Approval",
  ).length;
  const upcomingPayouts = payments.filter(
    (p) => p.type === "payout" && (p.status === "Approved" || p.status === "Pending_Approval"),
  ).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Payments
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your dues and payouts across all stokvels — not one group&apos;s
          ledger.
        </p>
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Showing mock card data for UI review. Replace with{" "}
          <code className="rounded bg-amber-100 px-1">GET /users/me/payments</code>{" "}
          when the backend is ready.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-slate-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Due now
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{dueCount}</p>
        </Card>
        <Card className="border-slate-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Awaiting verification
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{awaitingCount}</p>
        </Card>
        <Card className="border-slate-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Upcoming payouts
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{upcomingPayouts}</p>
        </Card>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-emerald-600" />
          <h2 className="text-sm font-semibold text-slate-900">
            Your payment activity
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {payments.map((payment) => (
            <PaymentCard key={payment._id} payment={payment} />
          ))}
        </div>
      </div>

      {stokvels.length > 0 && (
        <div>
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
        </div>
      )}
    </div>
  );
}
