"use client";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Wallet,
  Vote,
  FileText,
  ArrowLeft,
  MapPin,
  Calendar,
  BadgeCheck,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import ReputationBadge from "@/components/shared/ReputableTab";
import StatusBadge from "@/components/shared/StatusBadge";
import StatCard from "@/components/shared/StatCard";
import {
  useGetStokvelByIdQuery,
  useLazyDownloadConstitutionQuery,
} from "@/features/stokvel/stokvel-api";
import { useAppSelector } from "@/store/hooks";
import InviteMemberModal from "./invite-member-modal";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";

export default function StokvelOverview({
  id,
}: {
  id: string;
}): React.ReactElement {

  const [inviteOpen, setInviteOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  // ✅ ALL hooks first, before any early returns
  const {
    data,
    isLoading: isLoadingStokvel,
  } = useGetStokvelByIdQuery({ id: id ?? "" });


  // ✅ No args here — args go to the trigger function, not the hook
  const [download, { isFetching }] = useLazyDownloadConstitutionQuery();

  const handleDownload = async () => {
    try {
      // ✅ args passed here
      const blob = await download({ stokvelId: id ?? "" }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (blob as never)._filename ?? "constitution.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // 404 = no constitution found — show a toas
      console.log("err", err);
      toast.error("No constitution found for this stokvel");
    }
  };

  // after hooks, before early returns — nothing else changes
  if (isLoadingStokvel) return <Loader message="Loading stokvel details…" />;
  if (!data) return <ErrorState />;

  const {
    stokvel: groupDetails,
    members,
    totalContributions,
    totalPolicies,
  } = data;

  const isDisabled = !totalPolicies || isFetching;
  const isStokvelAdmin = groupDetails?.adminIds?.includes(user?._id ?? "");
  const description = groupDetails.description ?? "";
  const isDescriptionLong = description.length > 140;
  const contributionLabel =
    groupDetails.monthlyContribution != null
      ? `R${groupDetails.monthlyContribution.toLocaleString()}`
      : null;
  const frequencyLabel = groupDetails.contributionFrequency ?? null;

  return (
    <div className="p-6">
      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        stokvelId={id}
        stokvelName={groupDetails.name ?? ""}
      />
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="-ml-4 mb-4" asChild>
          <Link href="/dashboard/stokvel">
            <ArrowLeft className="h-4 w-4" />
            Back to Stokvels
          </Link>
        </Button>
        <Card className="overflow-hidden border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      {groupDetails.name}
                    </h1>
                    <StatusBadge
                      status={groupDetails?.isActive ? "active" : "inactive"}
                    />
                  </div>
                  {description && (
                    <div className="mt-2 max-w-2xl">
                      <p
                        className={
                          isDescriptionExpanded || !isDescriptionLong
                            ? "text-sm leading-relaxed text-slate-600"
                            : "text-sm leading-relaxed text-slate-600 line-clamp-2"
                        }
                      >
                        {description}
                      </p>
                      {isDescriptionLong && (
                        <button
                          type="button"
                          className="mt-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                          onClick={() =>
                            setIsDescriptionExpanded((expanded) => !expanded)
                          }
                        >
                          {isDescriptionExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                <ReputationBadge score={100} level={"Trusted"} size="sm" />
                {isStokvelAdmin && (
                  <Button size="sm" className="w-full md:w-auto" onClick={() => setInviteOpen(true)}>
                    <UserPlus className="mr-1 h-4 w-4" />
                    Invite member
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-5 py-4 sm:gap-3 sm:px-6">
            {groupDetails.type && (
              <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 md:w-auto">
                <Tag className="h-3.5 w-3.5 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {groupDetails.type}
                  </p>
                </div>
              </div>
            )}
            {contributionLabel && (
              <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 md:w-auto">
                <Wallet className="h-3.5 w-3.5 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Contribution
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {contributionLabel}
                    {frequencyLabel ? (
                      <span className="font-normal text-slate-500">
                        {" "}
                        · {frequencyLabel}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
            )}
            {!contributionLabel && frequencyLabel && (
              <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 md:w-auto">
                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Frequency
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {frequencyLabel}
                  </p>
                </div>
              </div>
            )}
            {groupDetails.location && (
              <div className="flex w-full max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 md:w-auto">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Location
                  </p>
                  <p className="truncate text-sm font-medium text-slate-800">
                    {groupDetails.location}
                  </p>
                </div>
              </div>
            )}
            {groupDetails.nasasaRegistrationNumber && (
              <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 md:w-auto">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    NASASA
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {groupDetails.nasasaRegistrationNumber}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       <Link href={`/dashboard/stokvel/${id}/members`}> 
          <StatCard
            icon={Users}
            label="Members"
            subValue="View & Manage"
            value={members ?? 0}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
        </Link>
        <Link href="/dashboard/stokvel/payments">
          <StatCard
            icon={Wallet}
            label="Contributions"
            subValue="View & Manage"
            value={totalContributions ?? 0}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />
        </Link>
        <Link href="/dashboard/stokvel/votes">
          <StatCard
            icon={Wallet}
            label="Payouts"
            subValue="View & Manage"
            value={10}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
        </Link>
        <Link href="/dashboard/stokvel/documents">
          <StatCard
            icon={Vote}
            label="Votes"
            subValue="View & Manage"
            value={10}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </Link>

        <div
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
          aria-label="Download constitution PDF"
          aria-busy={isFetching}
          onClick={() => {
            if (!isDisabled) handleDownload();
          }}
          onKeyDown={(e) => {
            if (isDisabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleDownload();
            }
          }}
          className={`rounded-lg transition-opacity ${
            isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:opacity-90"
          }`}
        >
          <StatCard
            icon={FileText}
            label={isFetching ? "Downloading…" : "Constitution"}
            subValue={
              isFetching
                ? "Please wait"
                : totalPolicies
                  ? "Download PDF"
                  : "No constitution yet"
            }
            value={totalPolicies ?? 0}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
          />
        </div>
        <Link href="/dashboard/stokvel/meetings">
          <StatCard
            icon={Wallet}
            label="Banking"
            subValue="View & Manage"
            value={10}
            iconBg="bg-teal-100"
            iconColor="text-teal-600"
          />
        </Link>
      </div>
    </div>
  );
}
