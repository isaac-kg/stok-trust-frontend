"use client";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Wallet,
  Vote,
  FileText,
  Settings,
  ArrowLeft,
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
import InviteMemberModal from "./inviteMemberModal";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";

export default function StokvelOverview({
  id,
}: {
  id: string;
}): React.ReactElement {

  const [inviteOpen, setInviteOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  // ✅ ALL hooks first, before any early returns
  const {
    data,
    isLoading: isLoadingStokvel,
    error: errorStokvel,
  } = useGetStokvelByIdQuery({ id: id ?? "" });


  // ✅ No args here — args go to the trigger function, not the hook
  const [download, { isFetching }] = useLazyDownloadConstitutionQuery();

  const handleDownload = async () => {
    try {
      // ✅ args passed here
      console.log("id =>", id);
      const blob = await download({ stokvelId: id ?? "" }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (blob as any)._filename ?? "constitution.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // 404 = no constitution found — show a toas
      console.log("err", err);
      toast.error("No constitution found for this stokvel");
    }
  };

  // after hooks, before early returns — nothing else changes
  if (isLoadingStokvel) return <Loader message="Loading group details…" />;
  if (!data) return <ErrorState />;

  const {
    stokvel: groupDetails,
    members,
    totalContributions,
    totalPolicies,
    totalPayouts,
    totalDisputes,
    totalMeetings,
    totalAmendments,
  } = data;

  const isDisabled = !totalPolicies || isFetching;
  const isStokvelAdmin = groupDetails?.adminIds?.includes(user?._id ?? "");

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
          <Link href="/dashboard/group">
            <ArrowLeft className="h-4 w-4" />
            Back to Groups
          </Link>
        </Button>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {groupDetails.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {groupDetails.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isStokvelAdmin && (
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Invite member
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/group">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
            {groupDetails.name?.[0] || "S"}
          </div>
          <StatusBadge
            status={groupDetails?.isActive ? "active" : "inactive"}
          />
        </div>
        <ReputationBadge score={100} level={"Trusted"} size="lg" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/group/members">
          <StatCard
            icon={Users}
            label="Members"
            subValue="View & Manage"
            value={members ?? 0}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
        </Link>
        <Link href="/dashboard/group/payments">
          <StatCard
            icon={Wallet}
            label="Contributions"
            subValue="View & Manage"
            value={totalContributions ?? 0}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />
        </Link>
        <Link href="/dashboard/group/votes">
          <StatCard
            icon={Wallet}
            label="Payouts"
            subValue="View & Manage"
            value={10}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
        </Link>
        <Link href="/dashboard/group/documents">
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
        <Link href="/dashboard/group/meetings">
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
